import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { flatten } from 'lodash-es';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Asker, errorToStrings } from 'src/helpers';
import { AuthService } from '../auth/auth.service';
import { AnswerContract } from '../contracts/answer.contract';
import { Criteria } from '../contracts/models/criteria';
import { Faculty } from '../contracts/models/faculty';
import { Question } from '../contracts/models/question';
import { Subject } from '../contracts/models/subject';
import { User } from '../contracts/models/user';
import { Analytics } from '../dashboard/main-panel/analytics';
import { MainPanelService } from '../dashboard/main-panel/main-panel.service';
import { CriteriasService } from '../evaluation-criterias/criterias.service';
import { StateService } from '../state.service';
import { UsersService } from '../users/users.service';
import { EvaluationService } from './evaluation.service';

@Component({
	selector: 'app-evaluate',
	templateUrl: './evaluate.component.html',
	styleUrls: ['./evaluate.component.css'],
})
export class EvaluateComponent implements OnInit, OnDestroy {
	loaded = false;
	user = new User();
	isStarted = false;
	analytics = new Analytics();

	processing = false;

	criterias: Criteria[] = [];
	faculties: Faculty[] = [];
	subjects: Subject[] = [];

	answers: AnswerContract[][] = [];

	analyticsSubscription!: Subscription;

	faculty_id = '';
	subject_id = '';

	faculty: Faculty | null = null;

	subject: Subject | null = null;

	comments = '';

	constructor(
		private state: StateService,
		private usersService: UsersService,
		private toastr: ToastrService,
		private criteriasService: CriteriasService,
		private mainPanelService: MainPanelService,
		private evaluationService: EvaluationService,
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit(): void {
		const user = this.state.get<User>('user');

		if (user) {
			this.user = user;
		}

		this.fetchFaculties();
		this.fetchCriterias();

		this.analyticsSubscription = this.mainPanelService.analytics.subscribe(
			(analytics) => (this.analytics = analytics)
		);
		this.fetchAnalytics();
	}

	ngOnDestroy(): void {
		this.analyticsSubscription.unsubscribe();
	}

	fetchAnalytics() {
		this.mainPanelService.fetchAnalytics();
	}

	fetchFaculties() {
		this.usersService
			.faculties()
			.subscribe((faculties) => {
				this.faculties = faculties;
			})
			.add(() => (this.loaded = true));
	}

	fetchCriterias() {
		this.criteriasService
			.all()
			.subscribe((criterias) => (this.criterias = criterias));
	}

	onChange(value: string) {
		const id = Number(value);

		const faculty = this.faculties.find((faculty) => faculty.id === id);

		if (faculty) {
			this.faculty = faculty;
			this.subjects =
				faculty.subjects?.map((subject) => subject.subject!) ?? [];
		} else {
			this.faculty = null;
			this.subjects = [];
			this.subject = null;
		}
	}

	onSubjectChange(value: string) {
		const id = Number(value);

		const subject = this.subjects.find((subject) => subject.id === id);

		if (subject) {
			this.subject = subject;
			this.subject_id = value;
		}
	}

	start() {
		if (this.faculty && this.subject) {
			this.answers = this.criterias.map((criteria) =>
				criteria.questions!.map((question) => ({
					question_id: question.id!,
					rating: 0,
				}))
			);
			this.isStarted = true;
		} else {
			this.toastr.error('No faculty selected.');
		}
	}

	stop() {
		this.isStarted = false;
		this.answers = [];
		this.subjects = [];
		this.faculty = null;
		this.subject = null;
		this.fetchFaculties();
	}

	submit() {
		this.processing = true;
		this.evaluationService
			.store(
				this.faculty!,
				this.subject!,
				flatten(this.answers),
				this.comments
			)
			.subscribe({
				next: () => {
					this.toastr.success(
						`Faculty ${this.faculty
							?.name!} has been evaluated successfully!`
					);
					this.stop();
				},
				error: (error: HttpErrorResponse) =>
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					),
			})
			.add(() => (this.processing = false));
	}

	getInputName(question: Question) {
		return `answers[${question.id}][answer]`;
	}

	async logout() {
		if (await Asker.notice('Are you sure you want to logout?')) {
			this.authService
				.logout()
				.subscribe()
				.add(() => {
					this.state.remove('token').remove('user');
					this.toastr.success('Logged out successfully!');
					this.router.navigateByUrl('/login');
				});
		}
	}
}
