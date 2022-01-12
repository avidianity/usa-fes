import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../state.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
	constructor(private state: StateService, private router: Router) {}

	ngOnInit(): void {
		if (!this.state.has('token')) {
			this.router.navigateByUrl('/login');
		}

		console.log(this.state.getAll());
	}
}
