import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EvaluationStatuses } from 'src/app/contracts/enums/evaluation-statuses.enum';
import { FormMode } from 'src/app/contracts/enums/form-mode.enum';
import { Semesters } from 'src/app/contracts/enums/semesters.enum';
import { AcademicYear } from 'src/app/contracts/models/academic-year';
import { errorToStrings } from 'src/helpers';
import { AcademicYearsService } from '../academic-years.service';

@Component({
	selector: 'app-academic-years-form',
	templateUrl: './academic-years-form.component.html',
	styleUrls: ['./academic-years-form.component.css'],
})
export class AcademicYearsFormComponent implements OnInit {
	mode: FormMode = FormMode.ADD;

	processing = false;

	data = new AcademicYear();

	semesters = Object.values(Semesters);

	statuses = Object.values(EvaluationStatuses);

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: AcademicYearsService,
		private toastr: ToastrService
	) {}

	ngOnInit(): void {
		if (location.pathname.includes('edit')) {
			this.route.params.subscribe((params) => {
				this.fetchItem(params['id']);
			});
		}
	}

	fetchItem(id: any) {
		this.service.find(id).subscribe({
			next: (academicYear) => {
				this.data = academicYear;
				this.mode = FormMode.EDIT;
			},
			error: () => {
				this.toastr.error('Unable to fetch Academic Year.');
				this.goBack();
			},
		});
	}

	get title() {
		return `${this.mode} Academic Year`;
	}

	submit() {
		this.processing = true;
		this.service
			.save(this.data)
			.subscribe({
				next: () => {
					this.toastr.success('Academic Year saved successfully!');
					this.goBack();
				},
				error: (error: HttpErrorResponse) =>
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					),
			})
			.add(() => (this.processing = false));
	}

	goBack() {
		this.router.navigateByUrl('/dashboard/academic-years');
	}
}
