import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/helpers';
import { EloquentContract } from '../contracts/eloquent.contract';
import { Subject } from '../contracts/models/subject';
import { StateService } from '../state.service';

@Injectable({
	providedIn: 'root',
})
export class SubjectsService implements EloquentContract<Subject> {
	constructor(private http: HttpClient, private state: StateService) {}

	protected headers() {
		const headers = new HttpHeaders({
			Accept: 'application/json',
		});

		const token = this.state.get('token');

		if (token) {
			return headers.set('Authorization', `Bearer ${token}`);
		}

		return headers;
	}

	save(data: Partial<Subject>) {
		if (data.id) {
			return this.update(data.id, data);
		}
		return this.store(data);
	}

	all() {
		return this.http.get<Subject[]>(url('/api/subjects'), {
			headers: this.headers(),
		});
	}

	find(id: number) {
		return this.http.get<Subject>(url(`/api/subjects/${id}`), {
			headers: this.headers(),
		});
	}

	store(data?: Partial<Subject>) {
		return this.http.post<Subject>(url('/api/subjects'), data, {
			headers: this.headers(),
		});
	}

	update(id: number, data?: Partial<Subject>) {
		return this.http.put<Subject>(url(`/api/subjects/${id}`), data, {
			headers: this.headers(),
		});
	}

	delete(id: number) {
		return this.http.delete<void>(url(`/api/subjects/${id}`), {
			headers: this.headers(),
		});
	}
}
