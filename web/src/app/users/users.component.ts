import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Roles } from '../contracts/enums/roles.enum';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
	constructor(private activatedRoute: ActivatedRoute) {}

	role!: Roles;

	ngOnInit(): void {
		this.activatedRoute.data.subscribe((data) => {
			this.role = data['role'];
		});
	}
}
