import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { errorToStrings, numberToWord } from 'src/helpers';
import { Roles } from '../contracts/enums/roles.enum';
import { Criteria } from '../contracts/models/criteria';
import { Faculty } from '../contracts/models/faculty';
import { Subject } from '../contracts/models/subject';
import { User } from '../contracts/models/user';
import { Analytics } from '../dashboard/main-panel/analytics';
import { MainPanelService } from '../dashboard/main-panel/main-panel.service';
import { CriteriasService } from '../evaluation-criterias/criterias.service';
import { StateService } from '../state.service';
import { UsersService } from '../users/users.service';

@Component({
	selector: 'app-evaluation-reports',
	templateUrl: './evaluation-reports.component.html',
	styleUrls: ['./evaluation-reports.component.css'],
})
export class EvaluationReportsComponent implements OnInit, OnDestroy {
	criterias: Criteria[] = [];
	faculties: Faculty[] = [];
	faculty = new Faculty();

	faculty_id = '';

	analytics = new Analytics();

	subject = new Subject();

	subjects: Subject[] = [];

	subject_id = '';

	analyticsSubscription!: Subscription;

	comments: string[] = [];

	constructor(
		private usersService: UsersService,
		private criteriasService: CriteriasService,
		private toastr: ToastrService,
		private mainPanelService: MainPanelService,
		private state: StateService
	) {}

	ngOnInit(): void {
		const user = this.state.get<User>('user');
		if (user) {
			if (user.role === Roles.ADMIN) {
				this.fetchFaculties();
			} else if (user.role === Roles.FACULTY) {
				this.faculties = [user as any];
				this.subjects =
					(user as Faculty).subjects?.map(
						(subject) => subject.subject!
					) ?? [];
				this.faculty_id = user.id?.toString()!;
				this.faculty = user as any;
			}
		}
		this.analyticsSubscription = this.mainPanelService.analytics.subscribe(
			(analytics) => (this.analytics = analytics)
		);
		this.mainPanelService.fetchAnalytics();
	}

	ngOnDestroy(): void {
		this.analyticsSubscription.unsubscribe();
	}

	fetchFaculties() {
		this.usersService
			.all(Roles.FACULTY)
			.subscribe((faculties) => (this.faculties = faculties as any));
	}

	onChange(value: string) {
		const subjectId = Number(value);

		const subject = this.subjects.find(
			(subject) => subject.id === subjectId
		);

		if (value.length > 0 && this.faculty_id.length > 0 && subject) {
			this.subject = subject!;
			this.subject_id = subject.id?.toString()!;
			this.fetchForFaculty(this.faculty_id);
		}
	}

	resetSubjectId(value: string) {
		const id = Number(value);

		const faculty = this.faculties.find((faculty) => faculty.id === id);

		if (faculty) {
			this.subject_id = '';
			this.faculty = faculty;
			this.faculty_id = value;
			this.subjects =
				faculty.subjects?.map((subject) => subject.subject!) ?? [];
		}
	}

	fetchForFaculty(faculty_id: any) {
		this.usersService
			.find(Number(faculty_id))
			.subscribe((faculty) => (this.faculty = faculty as any));
		this.criteriasService
			.fetchForFaculty(faculty_id, this.subject_id)
			.subscribe({
				next: (criterias) => (this.criterias = criterias),
				error: (error: HttpErrorResponse) => {
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					);
					this.criterias = [];
					this.subjects = [];
					this.faculty = new Faculty();
					this.subject = new Subject();
				},
			});
		this.criteriasService
			.fetchCommentsForFaculty(faculty_id, this.subject_id)
			.subscribe((comments) => (this.comments = comments));
	}

	getRating(question: any, rating: number) {
		return question.answer_meta[numberToWord(rating)];
	}
}
