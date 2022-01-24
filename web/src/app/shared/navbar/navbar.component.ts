import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/contracts/models/user';
import { StateService } from 'src/app/state.service';
import { Asker } from 'src/helpers';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
	@Input() user!: User;

	@Input() sidebarToggle?: () => void;

	picture = '/assets/logo-rounded.png';

	showMenu = false;

	constructor(
		private state: StateService,
		private router: Router,
		private toastr: ToastrService,
		private auth: AuthService
	) {}

	ngOnInit(): void {
		if (this.user.picture?.url) {
			this.picture = this.user.picture.url;
		}
	}

	toggleSidebar() {
		this.sidebarToggle?.();
	}

	toggleMenu() {
		this.showMenu = !this.showMenu;
	}

	async logout() {
		if (await Asker.notice('Are you sure you want to logout?')) {
			this.auth
				.logout()
				.subscribe()
				.add(() => {
					this.state.remove('token').remove('user');
					this.toastr.success('Logged out successfully!');
					this.router.navigateByUrl('/login');
				});
		}
	}
}
