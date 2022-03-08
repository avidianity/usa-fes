import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Roles } from 'src/app/contracts/enums/roles.enum';
import { FacultySubject } from 'src/app/contracts/models/faculty-subject';
import { Section } from 'src/app/contracts/models/section';
import { Subject } from 'src/app/contracts/models/subject';
import { User } from 'src/app/contracts/models/user';
import { SectionsService } from 'src/app/sections/sections.service';
import { UsersService } from 'src/app/users/users.service';
import { Asker, errorToStrings } from 'src/helpers';
import { SubjectsService } from '../subjects.service';

@Component({
	selector: 'app-subjects-assign',
	templateUrl: './subjects-assign.component.html',
	styleUrls: ['./subjects-assign.component.css'],
})
export class SubjectsAssignComponent implements OnInit {
	loading = {
		users: false,
		sections: false,
		subjects: false,
	};

	processing = false;

	selectedSubjects: number[] = [];
	subject_id = 0;
	section_id = 0;

	user = new User();

	protected _type: Roles.FACULTY | Roles.STUDENT = Roles.FACULTY;

	protected _user_id = 0;

	get user_id() {
		return this._user_id;
	}

	set user_id(value: number) {
		const id = Number(value);
		this._user_id = id;
		this.loading.users = true;
		const user = this.users.find((user) => user.id === id);
		if (user) {
			this.user = user;
			if (this.type === Roles.STUDENT) {
				this.selectedSubjects =
					user.subjects?.map((subject) => subject.id!) ?? [];
			} else {
				this.selectedSubjects = [];
			}
		}
		this.loading.users = false;
	}

	get isLoading() {
		return (
			this.loading.users || this.loading.sections || this.loading.subjects
		);
	}

	roles = Roles;

	get type() {
		return this._type;
	}

	set type(value: Roles.FACULTY | Roles.STUDENT) {
		this._type = value;
		this.fetchUsers();
	}

	users: User[] = [];
	subjects: Subject[] = [];
	sections: Section[] = [];

	constructor(
		protected userService: UsersService,
		protected subjectService: SubjectsService,
		protected sectionService: SectionsService,
		protected toastr: ToastrService
	) {}

	ngOnInit(): void {
		this.fetchAll();
	}

	isSubjectSelected(id: number) {
		return (
			this.selectedSubjects.find((subjectId) => subjectId === id) !==
			undefined
		);
	}

	submit() {
		if (!this.user.id) {
			this.toastr.error(`Please select a ${this.type}.`);
			return;
		}
		if (this.type === Roles.STUDENT) {
			this.processing = true;
			this.userService
				.assignStudentSubjects(this.user.id, this.selectedSubjects)
				.subscribe({
					next: () => {
						this.toastr.success('Subjects assigned successfully!');
						this.user = new User();
						this.selectedSubjects = [];
						this.fetchAll();
					},
					error: (error: HttpErrorResponse) =>
						errorToStrings(error).forEach((error) =>
							this.toastr.error(error)
						),
				})
				.add(() => (this.processing = false));
		} else if (this.type === Roles.FACULTY) {
			this.processing = true;
			this.userService
				.assignFacultyToSubjects(this.user.id!, {
					section_id: this.section_id,
					subject_id: this.subject_id,
				})
				.subscribe({
					next: () => {
						this.toastr.success('Subjects assigned successfully!');
						this.user = new User();
						this.selectedSubjects = [];
						this.fetchAll();
					},
					error: (error: HttpErrorResponse) =>
						errorToStrings(error).forEach((error) =>
							this.toastr.error(error)
						),
				})
				.add(() => (this.processing = false));
		}
	}

	async removeFacultySubject(id: number) {
		if (
			await Asker.notice(
				'Are you sure you want to unassign this subject?'
			)
		) {
			this.userService.removeFacultySubject(id).subscribe({
				next: () => {
					this.toastr.success('Subject unassigned successfully!');
				},
				error: (error) => {
					console.error(error);
					this.toastr.error(
						'Something went wrong. Please try again later.'
					);
				},
			});
		}
	}

	extractSubjects(user: any): FacultySubject[] {
		return user.subjects;
	}

	toggleSubjectSelection(id: number) {
		if (!this.isSubjectSelected(id)) {
			this.selectedSubjects.push(id);
		} else {
			const index = this.selectedSubjects.findIndex(
				(subjectId) => subjectId === id
			);
			this.selectedSubjects.splice(index, 1);
		}
	}

	switchType() {
		if (this.type === Roles.FACULTY) {
			this.type = Roles.STUDENT;
		} else {
			this.type = Roles.FACULTY;
		}

		this.user = new User();
		this.selectedSubjects = [];
	}

	fetchAll() {
		this.fetchUsers();
		this.fetchSections();
		this.fetchSubjects();
	}

	fetchUsers() {
		this.loading.users = true;
		this.userService
			.all(this.type)
			.subscribe((users) => {
				this.users = users;
			})
			.add(() => (this.loading.users = false));
	}

	fetchSections() {
		this.loading.sections = true;
		this.sectionService
			.all()
			.subscribe((sections) => {
				this.sections = sections;
			})
			.add(() => (this.loading.sections = false));
	}

	fetchSubjects() {
		this.loading.subjects = true;
		this.subjectService
			.all()
			.subscribe((subjects) => {
				this.subjects = subjects;
			})
			.add(() => (this.loading.subjects = false));
	}
}
