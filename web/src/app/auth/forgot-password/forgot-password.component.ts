import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { errorToStrings, url } from 'src/helpers';
import { ForgotPassword } from './forgot-password';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
	processing = false;

	phase: 'send' | 'verify' | 'complete' = 'send';

	data = new ForgotPassword();

	verification = '';
	uuid = '';

	message = 'Enter your credentials';

	constructor(
		protected http: HttpClient,
		protected toastr: ToastrService,
		protected router: Router
	) {}

	submit() {
		this[this.phase]();
	}

	send() {
		this.processing = true;
		this.http
			.post<{ verification: string }>(
				url('/api/auth/forgot-password/send'),
				{
					email: this.data.email,
				},
				{ headers: new HttpHeaders({ Accept: 'application/json' }) }
			)
			.subscribe({
				next: ({ verification }) => {
					this.verification = verification;
					this.phase = 'verify';
					this.message = 'Enter your One-Time Password';
				},
				error: (error: HttpErrorResponse) =>
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					),
			})
			.add(() => {
				this.processing = false;
			});
	}

	verify() {
		this.processing = true;
		this.http
			.post<{ uuid: string }>(
				url('/api/otps/verify'),
				{ verification: this.verification, otp: this.data.otp },
				{
					headers: new HttpHeaders({ Accept: 'application/json' }),
				}
			)
			.subscribe({
				next: ({ uuid }) => {
					this.uuid = uuid;
					this.phase = 'complete';
					this.message = 'Enter your new Password';
				},
				error: (error: HttpErrorResponse) =>
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					),
			})
			.add(() => {
				this.processing = false;
			});
	}

	complete() {
		const data = {
			uuid: this.uuid,
			verification: this.verification,
			password: this.data.password,
			password_confirmation: this.data.passwordConfirmation,
		};
		this.processing = true;

		this.http
			.post(url('/api/auth/forgot-password/complete'), data, {
				headers: new HttpHeaders({ Accept: 'application/json' }),
			})
			.subscribe({
				next: () => {
					this.toastr.success(
						'Password has been reset successfully!'
					);
					this.router.navigateByUrl('/login');
				},
				error: (error: HttpErrorResponse) =>
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					),
			})
			.add(() => {
				this.processing = false;
			});
	}
}
