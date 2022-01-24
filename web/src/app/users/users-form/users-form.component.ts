import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isString } from 'lodash-es';
import { ToastrService } from 'ngx-toastr';
import pluralize from 'pluralize';
import { Observable, Subscription } from 'rxjs';
import { FormMode } from 'src/app/contracts/enums/form-mode.enum';
import { Roles } from 'src/app/contracts/enums/roles.enum';
import { Section } from 'src/app/contracts/models/section';
import { User } from 'src/app/contracts/models/user';
import { SectionsService } from 'src/app/sections/sections.service';
import { errorToStrings } from 'src/helpers';
import { UsersService } from '../users.service';

class Input extends User {
	password_confirmation = '';
}

@Component({
	selector: 'app-users-form',
	templateUrl: './users-form.component.html',
	styleUrls: ['./users-form.component.css'],
})
export class UsersFormComponent implements OnInit {
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: UsersService,
		private toastr: ToastrService,
		private sectionsService: SectionsService
	) {}

	role!: Roles;

	roles = Roles;

	activatedRouteData!: Subscription;

	mode: FormMode = FormMode.ADD;

	processing = false;

	sections!: Observable<Section[]>;

	data = new Input();

	preview: string | null = null;

	ngOnInit(): void {
		this.activatedRouteData = this.route.data.subscribe((data) => {
			this.role = data['role'];
		});

		if (location.pathname.includes('edit')) {
			this.route.params.subscribe((params) => {
				this.fetchItem(params['id']);
			});
		}

		if (this.role === Roles.STUDENT) {
			this.sections = this.sectionsService.all();
		}

		this.listenToPictureChanges();
	}

	fetchItem(id: any) {
		this.service.find(id).subscribe({
			next: ({ picture, ...user }) => {
				this.data = { ...user, password_confirmation: '' };
				this.mode = FormMode.EDIT;

				if (picture?.url) {
					this.preview = picture.url;
				}
			},
			error: () => {
				this.toastr.error(`Unable to fetch ${this.role}.`);
				this.goBack();
			},
		});
	}

	get title() {
		return `${this.mode} ${this.role}`;
	}

	submit() {
		this.processing = true;

		this.data.role = this.role;

		this.service
			.save(this.data)
			.subscribe({
				next: () => {
					this.toastr.success(`${this.role} saved successfully!`);
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
		this.router.navigateByUrl(
			`/dashboard/${pluralize(this.role).toLowerCase()}`
		);
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

					this.data.picture = file as any;
				}
			});
		}
	}
}
