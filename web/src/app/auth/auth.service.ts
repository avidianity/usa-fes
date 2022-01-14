import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import FormData from '@avidian/form-data';
import { EMPTY } from 'rxjs';
import { url } from 'src/helpers';
import { User } from '../contracts/models/user';
import { StateService } from '../state.service';
import { Login } from './login/login';
import { Register } from './register/register';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(
		private http: HttpClient,
		private state: StateService,
		private router: Router
	) {}

	login(data: Login) {
		return this.http.post<{ user: User; token: string }>(
			url('/api/auth/login'),
			data,
			{
				headers: new HttpHeaders({
					Accept: 'application/json',
				}),
			}
		);
	}

	register(data: Register) {
		return this.http.post<User>(
			url('/api/auth/register'),
			new FormData(data),
			{
				headers: new HttpHeaders({
					Accept: 'application/json',
				}),
			}
		);
	}

	logout() {
		const token = this.state.get('token');

		if (token) {
			return this.http.delete<void>(url('/api/auth/logout'), {
				headers: new HttpHeaders({
					Accept: 'application/json',
					Authorization: `Bearer ${token}`,
				}),
			});
		}

		return EMPTY;
	}

	redirectIfAuthenticated() {
		if (this.state.has('token')) {
			this.router.navigateByUrl('/dashboard');
		}
	}
}
