import { Component, Input, OnInit } from '@angular/core';
import { Roles } from 'src/app/contracts/enums/roles.enum';
import { User } from 'src/app/contracts/models/user';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
	@Input() user!: User;

	title = '';

	@Input() toggle!: boolean;

	@Input() onSidebarToggle?: () => void;

	constructor() {}

	toggleSidebar() {
		this.onSidebarToggle?.();
	}

	ngOnInit(): void {
		switch (this.user.role) {
			case Roles.ADMIN:
				this.title = 'USA Admin Panel';
				break;
			case Roles.FACULTY:
				this.title = 'USA Faculty Panel';
				break;
			case Roles.STUDENT:
				this.title = 'USA Student Panel';
				break;
		}
	}
}
