import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/helpers';
import { EloquentContract } from '../contracts/eloquent.contract';
import { Section } from '../contracts/models/section';
import { StateService } from '../state.service';

@Injectable({
	providedIn: 'root',
})
export class SectionsService implements EloquentContract<Section> {
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

	save(data: Partial<Section>) {
		if (data.id) {
			return this.update(data.id, data);
		}
		return this.store(data);
	}

	all() {
		return this.http.get<Section[]>(url('/api/sections'), {
			headers: this.headers(),
		});
	}

	find(id: number) {
		return this.http.get<Section>(url(`/api/sections/${id}`), {
			headers: this.headers(),
		});
	}

	store(data?: Record<string, any>) {
		return this.http.post<Section>(url('/api/sections'), data, {
			headers: this.headers(),
		});
	}

	update(id: number, data?: Record<string, any>) {
		return this.http.put<Section>(url(`/api/sections/${id}`), data, {
			headers: this.headers(),
		});
	}

	delete(id: number) {
		return this.http.delete<void>(url(`/api/sections/${id}`), {
			headers: this.headers(),
		});
	}
}
