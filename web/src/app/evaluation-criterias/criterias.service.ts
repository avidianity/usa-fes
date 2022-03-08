import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/helpers';
import { EloquentContract } from '../contracts/eloquent.contract';
import { Criteria } from '../contracts/models/criteria';
import { StateService } from '../state.service';

@Injectable({
	providedIn: 'root',
})
export class CriteriasService implements EloquentContract<Criteria> {
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

	save(data: Partial<Criteria>) {
		if (data.id) {
			return this.update(data.id, data);
		}
		return this.store(data);
	}

	all() {
		return this.http.get<Criteria[]>(url('/api/criterias'), {
			headers: this.headers(),
		});
	}

	find(id: number) {
		return this.http.get<Criteria>(url(`/api/criterias/${id}`), {
			headers: this.headers(),
		});
	}

	store(data?: Record<string, any>) {
		return this.http.post<Criteria>(url('/api/criterias'), data, {
			headers: this.headers(),
		});
	}

	update(id: number, data?: Record<string, any>) {
		return this.http.put<Criteria>(url(`/api/criterias/${id}`), data, {
			headers: this.headers(),
		});
	}

	delete(id: number) {
		return this.http.delete<void>(url(`/api/criterias/${id}`), {
			headers: this.headers(),
		});
	}

	saveOrder(criterias: Criteria[]) {
		return this.http.put<Criteria[]>(
			url('/api/criterias/reorder'),
			{
				criterias: criterias.map((criteria, index) => ({
					id: criteria.id,
					order: index + 1,
				})),
			},
			{ headers: this.headers() }
		);
	}

	fetchForFaculty(faculty_id: any) {
		return this.http.get<Criteria[]>(
			url(`/api/criterias/for-faculty/${faculty_id}`),
			{ headers: this.headers() }
		);
	}

	fetchCommentsForFaculty(faculty_id: any) {
		return this.http.get<string[]>(
			url(`/api/users/${faculty_id}/comments`),
			{
				headers: this.headers(),
			}
		);
	}
}
