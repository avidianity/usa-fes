import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../contracts/models/user';
import { StateService } from '../state.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
	user!: User;

	constructor(private state: StateService, private router: Router) {}

	ngOnInit(): void {
		if (!this.state.has('token')) {
			this.router.navigateByUrl('/login');
		}

		const user = this.state.get<User>('user');
		if (user) {
			this.user = user;
		}
	}
}
