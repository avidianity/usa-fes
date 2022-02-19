import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import FormData from '@avidian/form-data';
import { EMPTY } from 'rxjs';
import { url } from 'src/helpers';
import { Roles } from '../contracts/enums/roles.enum';
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

	getUser() {
		const token = this.state.get<string>('token');

		return this.http.get<User>(url('/api/auth/check'), {
			headers: new HttpHeaders({
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			}),
		});
	}

	redirectIfAuthenticated() {
		if (this.state.has('token')) {
			const user = this.state.get<User>('user');
			if (user?.role === Roles.STUDENT) {
				this.router.navigateByUrl('/evaluate');
			} else {
				this.router.navigateByUrl('/dashboard');
			}
		}
	}

	checkMailing() {
		return this.http.get<{ mailing_enabled: boolean }>(
			url('/api/settings'),
			{
				headers: new HttpHeaders({
					Accept: 'application/json',
				}),
			}
		);
	}
}
