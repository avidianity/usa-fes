import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { EvaluationStatuses } from 'src/app/contracts/enums/evaluation-statuses.enum';
import { AcademicYear } from 'src/app/contracts/models/academic-year';
import { Asker } from 'src/helpers';
import { AcademicYearsService } from '../academic-years.service';

@Component({
	selector: 'app-academic-years-list',
	templateUrl: './academic-years-list.component.html',
	styleUrls: ['./academic-years-list.component.css'],
})
export class AcademicYearsListComponent implements OnInit, OnDestroy {
	constructor(
		private service: AcademicYearsService,
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

	statuses = EvaluationStatuses;

	items = new Array<AcademicYear>();

	loading = false;

	ngOnInit(): void {
		this.fetchItems();
	}

	fetchItems() {
		this.loading = true;
		this.service
			.all()
			.subscribe((academicYears) => {
				this.items = academicYears;

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
			await Asker.danger(
				'Are you sure you want to delete this Academic Year?'
			)
		) {
			this.service
				.delete(id)
				.subscribe({
					next: () => {
						this.toastr.success(
							'Academic Year deleted successfully!'
						);
					},
					error: () => {
						this.toastr.error('Unable to delete Academic Year.');
					},
				})
				.add(() => this.fetchItems());
		}
	}

	ngOnDestroy(): void {
		this.datatableTrigger.unsubscribe();
	}
}
