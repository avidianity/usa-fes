import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'src/app/contracts/models/subject';
import { SubjectsService } from '../subjects.service';
import { Subject as Trigger } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { truncate } from 'lodash-es';
import { Asker } from 'src/helpers';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-subjects-list',
	templateUrl: './subjects-list.component.html',
	styleUrls: ['./subjects-list.component.css'],
})
export class SubjectsListComponent implements OnInit, OnDestroy {
	constructor(
		private service: SubjectsService,
		private toastr: ToastrService
	) {}

	@ViewChild(DataTableDirective, { static: false })
	dtElement!: DataTableDirective;

	datatableOptions: DataTables.Settings = {
		pagingType: 'full_numbers',
		pageLength: 10,
		responsive: true,
	};

	datatableTrigger = new Trigger<DataTables.Settings>();

	items = new Array<Subject>();

	loading = false;

	ngOnInit(): void {
		this.fetchItems();
	}

	fetchItems() {
		this.loading = true;
		this.service
			.all()
			.subscribe((subjects) => {
				this.items = subjects;

				if (this.dtElement.dtInstance) {
					this.dtElement.dtInstance
						.then((instance) => {
							instance.destroy();
						})
						.finally(() => {
							this.datatableTrigger.next(this.datatableOptions);
						});
				} else {
					this.datatableTrigger.next(this.datatableOptions);
				}
			})
			.add(() => (this.loading = false));
	}

	async remove(id: any) {
		if (
			await Asker.danger('Are you sure you want to delete this subject?')
		) {
			this.service
				.delete(id)
				.subscribe({
					next: () => {
						this.toastr.success('Subject deleted successfully!');
					},
					error: () => {
						this.toastr.error('Unable to delete subject.');
					},
				})
				.add(() => this.fetchItems());
		}
	}

	ngOnDestroy(): void {
		this.datatableTrigger.unsubscribe();
	}

	truncate(data: string) {
		return truncate(data, {
			length: 30,
		});
	}
}
