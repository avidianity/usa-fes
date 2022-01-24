import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { url } from 'src/helpers';
import { AuthService } from './auth/auth.service';
import { StateService } from './state.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	constructor(
		private http: HttpClient,
		private state: StateService,
		private auth: AuthService
	) {}

	loading = true;

	ngOnInit(): void {
		this.getSanctumCookie().subscribe(() => this.checkToken());
	}

	getSanctumCookie() {
		return this.http.get<void>(url('/sanctum/csrf-cookie'), {
			withCredentials: true,
			headers: new HttpHeaders({
				Accept: 'application/json',
			}),
		});
	}

	checkToken() {
		const token = this.state.get('token');

		if (token) {
			this.auth
				.getUser()
				.subscribe({
					next: (user) => {
						this.state.set('user', user);
					},
					error: (error: HttpErrorResponse) => {
						if (error.status === 401) {
							this.state.remove('token').remove('user');
						}
					},
				})
				.add(() => (this.loading = false));
		} else {
			this.loading = false;
		}
	}
}
