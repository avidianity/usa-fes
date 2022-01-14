import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Section } from 'src/app/contracts/models/section';
import { Asker } from 'src/helpers';
import { SectionsService } from '../sections.service';

@Component({
	selector: 'app-sections-list',
	templateUrl: './sections-list.component.html',
	styleUrls: ['./sections-list.component.css'],
})
export class SectionsListComponent implements OnInit, OnDestroy {
	constructor(
		private service: SectionsService,
		private toastr: ToastrService
	) {}

	@ViewChild(DataTableDirective, { static: false })
	dtElement!: DataTableDirective;

	datatableOptions: DataTables.Settings = {
		pagingType: 'full_numbers',
		pageLength: 10,
		responsive: true,
	};

	datatableTrigger = new Subject<DataTables.Settings>();

	items = new Array<Section>();

	loading = false;

	ngOnInit(): void {
		this.fetchItems();
	}

	fetchItems() {
		this.loading = true;
		this.service
			.all()
			.subscribe((sections) => {
				this.items = sections;

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
			await Asker.danger('Are you sure you want to delete this section?')
		) {
			this.service
				.delete(id)
				.subscribe({
					next: () => {
						this.toastr.success('Section deleted successfully!');
					},
					error: () => {
						this.toastr.error('Unable to delete section.');
					},
				})
				.add(() => this.fetchItems());
		}
	}

	ngOnDestroy(): void {
		this.datatableTrigger.unsubscribe();
	}
}
