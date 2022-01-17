import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'src/helpers';
import { EloquentContract } from '../contracts/eloquent.contract';
import { Roles } from '../contracts/enums/roles.enum';
import { User } from '../contracts/models/user';
import { StateService } from '../state.service';

@Injectable({
	providedIn: 'root',
})
export class UsersService implements EloquentContract<User> {
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

	save(data: Partial<User>) {
		if (data.id) {
			return this.update(data.id, data);
		}
		return this.store(data);
	}

	all(role?: Roles) {
		return this.http.get<User[]>(
			url('/api/users', role ? { role } : undefined),
			{
				headers: this.headers(),
			}
		);
	}

	find(id: number) {
		return this.http.get<User>(url(`/api/users/${id}`), {
			headers: this.headers(),
		});
	}

	store(data?: Record<string, any>) {
		return this.http.post<User>(url('/api/users'), data, {
			headers: this.headers(),
		});
	}

	update(id: number, data?: Record<string, any>) {
		return this.http.put<User>(url(`/api/users/${id}`), data, {
			headers: this.headers(),
		});
	}

	delete(id: number) {
		return this.http.delete<void>(url(`/api/users/${id}`), {
			headers: this.headers(),
		});
	}
}
