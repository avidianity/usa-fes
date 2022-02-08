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
import { Question } from '../contracts/models/question';
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
	faculties: User[] = [];

	answers: AnswerContract[][] = [];

	analyticsSubscription!: Subscription;

	faculty_id = '';

	faculty: User | null = null;

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
			.subscribe((faculties) => (this.faculties = faculties))
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
		} else {
			this.faculty = null;
		}
	}

	start() {
		if (this.faculty) {
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
		this.faculty = null;
		this.fetchFaculties();
	}

	submit() {
		this.processing = true;
		this.evaluationService
			.store(this.faculty!, flatten(this.answers), this.comments)
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
