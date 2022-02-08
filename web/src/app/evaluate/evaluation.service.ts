import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/helpers';
import { AnswerContract } from '../contracts/answer.contract';
import { User } from '../contracts/models/user';
import { StateService } from '../state.service';

@Injectable({
	providedIn: 'root',
})
export class EvaluationService {
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

	store(faculty: User, answers: AnswerContract[], comments = '') {
		return this.http.post(
			url('/api/answers/many'),
			{
				faculty_id: faculty.id,
				answers,
				comments,
			},
			{ headers: this.headers() }
		);
	}
}
