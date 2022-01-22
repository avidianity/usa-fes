import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { errorToStrings, Asker } from 'src/helpers';
import { AcademicYear } from '../contracts/models/academic-year';
import { Criteria } from '../contracts/models/criteria';
import { Question } from '../contracts/models/question';
import { MainPanelService } from '../dashboard/main-panel/main-panel.service';
import { CriteriasService } from '../evaluation-criterias/criterias.service';
import { QuestionsService } from './questions.service';

@Component({
	selector: 'app-questionnaires',
	templateUrl: './questionnaires.component.html',
	styleUrls: ['./questionnaires.component.css'],
})
export class QuestionnairesComponent implements OnInit, OnDestroy {
	data = new Question();

	academicYear = new AcademicYear();

	criterias: Criteria[] = [];

	processing = false;

	analyticsSubscription!: Subscription;

	constructor(
		private criteriasService: CriteriasService,
		private questionsService: QuestionsService,
		private mainPanelService: MainPanelService,
		private toastr: ToastrService
	) {}

	ngOnInit(): void {
		this.analyticsSubscription = this.mainPanelService.analytics.subscribe(
			(analytics) => {
				if (analytics.academic_year) {
					this.academicYear = analytics.academic_year;
				}
			}
		);
		this.fetchItems();
	}

	ngOnDestroy(): void {
		this.analyticsSubscription.unsubscribe();
	}

	fetchItems() {
		this.criteriasService.all().subscribe((criterias) => {
			this.criterias = criterias;
		});
		this.mainPanelService.fetchAnalytics();
	}

	setQuestion(question: Question) {
		this.data = { ...question };
	}

	clearQuestion() {
		this.setQuestion(new Question());
	}

	moveUp = (question: Question) => {
		const criteriaIndex = this.criterias.findIndex(
			(item) => item.id === question.criteria_id
		);

		const criteria = this.criterias[criteriaIndex];

		const questionIndex = criteria.questions!.findIndex(
			(item) => item.id === question.id
		);

		if (questionIndex !== 0) {
			criteria.questions!.splice(questionIndex, 1);
			criteria.questions!.splice(questionIndex - 1, 0, question);

			this.criterias.splice(criteriaIndex, 1, criteria);
		}
	};

	moveDown = (question: Question) => {
		const criteriaIndex = this.criterias.findIndex(
			(item) => item.id === question.criteria_id
		);

		const criteria = this.criterias[criteriaIndex];

		const questionIndex = criteria.questions!.findIndex(
			(item) => item.id === question.id
		);

		if (questionIndex !== criteria.questions!.length - 1) {
			criteria.questions!.splice(questionIndex, 1);
			criteria.questions!.splice(questionIndex + 1, 0, question);

			this.criterias.splice(criteriaIndex, 1, criteria);
		}
	};

	edit = (question: Question) => {
		this.setQuestion(question);
	};

	delete = async (question: Question) => {
		await this.remove(question);
	};

	submit() {
		this.processing = true;
		this.questionsService
			.save(this.data)
			.subscribe({
				next: () => {
					this.toastr.success('Question saved successfully!');
					this.fetchItems();
					this.clearQuestion();
				},
				error: (error: HttpErrorResponse) =>
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					),
			})
			.add(() => (this.processing = false));
	}

	saveOrder() {
		this.processing = true;
		this.questionsService
			.saveOrder(this.criterias)
			.subscribe({
				next: () => {
					this.toastr.success('Question order saved successfully!');
					this.clearQuestion();
				},
				error: (error: HttpErrorResponse) =>
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					),
			})
			.add(() => (this.processing = false));
	}

	async remove(question: Question) {
		if (
			await Asker.danger('Are you sure you want to delete this question?')
		) {
			this.questionsService
				.delete(question.criteria_id, question.id)
				.subscribe({
					next: () => {
						this.toastr.success('Question deleted successfully!');
					},
					error: () => {
						this.toastr.error('Unable to delete question.');
					},
				})
				.add(() => this.fetchItems());
		}
	}

	getInputName(criteria: Criteria, question: Question) {
		return `criteria[${criteria.id}][question][${question.id}]`;
	}
}
