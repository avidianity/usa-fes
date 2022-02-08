import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isString } from 'lodash-es';
import { ToastrService } from 'ngx-toastr';
import { Roles } from 'src/app/contracts/enums/roles.enum';
import { Section } from 'src/app/contracts/models/section';
import { SectionsService } from 'src/app/sections/sections.service';
import { errorToStrings } from 'src/helpers';
import { AuthService } from '../auth.service';
import { Register } from './register';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
	constructor(
		private auth: AuthService,
		private toastr: ToastrService,
		private router: Router,
		private section: SectionsService
	) {}

	sections: Section[] = [];

	processing = false;

	data = new Register();

	preview: null | string = null;

	roles = [Roles.FACULTY, Roles.STUDENT];

	rolesEnum = Roles;

	ngOnInit(): void {
		this.auth.redirectIfAuthenticated();

		this.listenToPictureChanges();

		this.fetchSections();
	}

	fetchSections() {
		this.section.all().subscribe((sections) => (this.sections = sections));
	}

	listenToPictureChanges() {
		const picture = document.querySelector<HTMLInputElement>('#picture');

		if (picture) {
			picture.addEventListener('change', () => {
				const file = picture.files?.[0];
				if (file) {
					const reader = new FileReader();

					reader.onload = (e) => {
						if (e.target?.result && isString(e.target.result)) {
							this.preview = e.target.result;
						}
					};

					reader.readAsDataURL(file);

					this.data.picture = file;
				}
			});
		}
	}

	submit() {
		this.processing = true;

		this.auth
			.register(this.data)
			.subscribe({
				next: () => {
					this.toastr.success(
						'Registered successfully! Please wait for an admin to approve your account.'
					);
					this.data = new Register();
					this.router.navigateByUrl('/login');
				},
				error: (error: HttpErrorResponse) =>
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					),
			})
			.add(() => {
				this.processing = false;
			});
	}
}
