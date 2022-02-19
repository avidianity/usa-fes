import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Roles } from 'src/app/contracts/enums/roles.enum';
import { StateService } from 'src/app/state.service';
import { errorToStrings } from 'src/helpers';
import { AuthService } from '../auth.service';
import { Login } from './login';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	constructor(
		private auth: AuthService,
		private toastr: ToastrService,
		private state: StateService,
		private router: Router
	) {}

	data = new Login();

	processing = false;

	mailingEnabled = false;

	ngOnInit(): void {
		this.auth.redirectIfAuthenticated();
		this.checkMailing();
	}

	checkMailing() {
		this.auth.checkMailing().subscribe((data) => {
			this.mailingEnabled = data.mailing_enabled;
		});
	}

	submit() {
		this.processing = true;

		this.auth
			.login(this.data)
			.subscribe({
				next: (data) => {
					if (!this.data.remember) {
						this.state.asSession();
					} else {
						this.state.asLocal();
					}

					this.state.set('token', data.token).set('user', data.user);
					this.toastr.success(`Welcome back, ${data.user.name}!`);
					if (data.user.role === Roles.STUDENT) {
						this.router.navigateByUrl('/evaluate');
					} else {
						this.router.navigateByUrl('/dashboard');
					}
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
