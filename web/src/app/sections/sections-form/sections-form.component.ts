import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormMode } from 'src/app/contracts/enums/form-mode.enum';
import { Section } from 'src/app/contracts/models/section';
import { errorToStrings } from 'src/helpers';
import { SectionsService } from '../sections.service';

@Component({
	selector: 'app-sections-form',
	templateUrl: './sections-form.component.html',
	styleUrls: ['./sections-form.component.css'],
})
export class SectionsFormComponent implements OnInit {
	mode: FormMode = FormMode.ADD;

	processing = false;

	data = new Section();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: SectionsService,
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
			next: (section) => {
				this.data = section;
				this.mode = FormMode.EDIT;
			},
			error: () => {
				this.toastr.error('Unable to fetch Section.');
				this.goBack();
			},
		});
	}

	get title() {
		return `${this.mode} Section`;
	}

	submit() {
		this.processing = true;
		this.service
			.save(this.data)
			.subscribe({
				next: () => {
					this.toastr.success('Section saved successfully!');
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
		this.router.navigateByUrl('/dashboard/sections');
	}
}
