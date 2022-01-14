import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormMode } from 'src/app/contracts/enums/form-mode.enum';
import { Subject } from 'src/app/contracts/models/subject';
import { errorToStrings } from 'src/helpers';
import { SubjectsService } from '../subjects.service';

@Component({
	selector: 'app-subjects-form',
	templateUrl: './subjects-form.component.html',
	styleUrls: ['./subjects-form.component.css'],
})
export class SubjectsFormComponent implements OnInit {
	mode: FormMode = FormMode.ADD;

	processing = false;

	data = new Subject();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: SubjectsService,
		private toastr: ToastrService
	) {}

	ngOnInit(): void {
		if (location.pathname.includes('edit')) {
			this.route.params.subscribe((params) => {
				this.fetchSubject(params['id']);
			});
		}
	}

	fetchSubject(id: any) {
		this.service.find(id).subscribe({
			next: (subject) => {
				this.data = subject;
				this.mode = FormMode.EDIT;
			},
			error: () => {
				this.toastr.error('Unable to fetch Subject.');
				this.goBack();
			},
		});
	}

	get title() {
		return `${this.mode} Subject`;
	}

	submit() {
		this.processing = true;
		this.service
			.save(this.data)
			.subscribe({
				next: () => {
					this.toastr.success('Subject saved successfully!');
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
		this.router.navigateByUrl('/dashboard/subjects');
	}
}
