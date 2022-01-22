import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/helpers';
import { EloquentContract } from '../contracts/eloquent.contract';
import { Criteria } from '../contracts/models/criteria';
import { Question } from '../contracts/models/question';
import { StateService } from '../state.service';

@Injectable({
	providedIn: 'root',
})
export class QuestionsService implements EloquentContract<Question> {
	constructor(private http: HttpClient, private state: StateService) {}

	protected headers() {
		const headers = new HttpHeaders({
			Accept: 'application/json',
		});

		if (this.state.has('token')) {
			const token = this.state.get('token');

			return headers.set('Authorization', `Bearer ${token}`);
		}

		return headers;
	}

	save(data: Partial<Question>) {
		if (data.id) {
			return this.update(data.id, data);
		}
		return this.store(data);
	}

	all(criteria_id?: number) {
		return this.http.get<Question[]>(
			url(`/api/criterias/${criteria_id}/questions`),
			{
				headers: this.headers(),
			}
		);
	}

	find(criteria_id: number, question_id?: number) {
		return this.http.get<Question>(
			url(`/api/criterias/${criteria_id}/questions/${question_id}`),
			{
				headers: this.headers(),
			}
		);
	}

	store(data?: Record<string, any>) {
		return this.http.post<Question>(
			url(`/api/criterias/${data?.['criteria_id']}/questions`),
			data,
			{
				headers: this.headers(),
			}
		);
	}

	update(id: number, data?: Record<string, any>) {
		return this.http.put<Question>(
			url(`/api/criterias/${data?.['criteria_id']}/questions/${id}`),
			data,
			{
				headers: this.headers(),
			}
		);
	}

	delete(criteria_id: number, question_id?: number) {
		return this.http.delete<void>(
			url(`/api/criterias/${criteria_id}/questions/${question_id}`),
			{
				headers: this.headers(),
			}
		);
	}

	saveOrder(criterias: Criteria[]) {
		return this.http.put<Question[]>(
			url('/api/criterias/questions/reorder'),
			{
				criterias: criterias
					.filter((criteria) => criteria.questions!.length > 0)
					.map((criteria) => ({
						id: criteria.id,
						questions: criteria.questions?.map(
							(question, index) => ({
								id: question.id,
								order: index + 1,
							})
						),
					})),
			},
			{ headers: this.headers() }
		);
	}
}
