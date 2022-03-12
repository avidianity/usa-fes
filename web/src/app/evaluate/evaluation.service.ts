import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/helpers';
import { AnswerContract } from '../contracts/answer.contract';
import { Faculty } from '../contracts/models/faculty';
import { Subject } from '../contracts/models/subject';
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

	store(
		faculty: Faculty,
		subject: Subject,
		answers: AnswerContract[],
		comments = ''
	) {
		return this.http.post(
			url('/api/answers/many'),
			{
				faculty_id: faculty.id,
				answers,
				comments,
				subject_id: subject.id,
			},
			{ headers: this.headers() }
		);
	}
}
