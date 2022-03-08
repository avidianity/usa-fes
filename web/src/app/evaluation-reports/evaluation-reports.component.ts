import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { errorToStrings, numberToWord } from 'src/helpers';
import { Roles } from '../contracts/enums/roles.enum';
import { Criteria } from '../contracts/models/criteria';
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
	faculties: User[] = [];
	faculty = new User();

	faculty_id = '';

	analytics = new Analytics();

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
				this.fetchForFaculty(user.id);
				this.faculties = [user];
				this.faculty_id = user.id?.toString()!;
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
			.subscribe((faculties) => (this.faculties = faculties));
	}

	onChange(value: string) {
		this.faculty_id = value;
		if (value.length > 0) {
			this.fetchForFaculty(value);
		} else {
			this.criterias = [];
			this.faculty = new User();
		}
	}

	fetchForFaculty(faculty_id: any) {
		this.usersService
			.find(Number(faculty_id))
			.subscribe((faculty) => (this.faculty = faculty));
		this.criteriasService.fetchForFaculty(faculty_id).subscribe({
			next: (criterias) => (this.criterias = criterias),
			error: (error: HttpErrorResponse) =>
				errorToStrings(error).forEach((error) =>
					this.toastr.error(error)
				),
		});
		this.criteriasService
			.fetchCommentsForFaculty(faculty_id)
			.subscribe((comments) => (this.comments = comments));
	}

	getRating(question: any, rating: number) {
		return question.answer_meta[numberToWord(rating)];
	}
}
