import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { Roles } from 'src/app/contracts/enums/roles.enum';
import { User } from 'src/app/contracts/models/user';
import { StateService } from 'src/app/state.service';
import { Asker } from 'src/helpers';
import { UsersService } from '../users.service';

@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit, OnDestroy {
	constructor(
		private activatedRoute: ActivatedRoute,
		private service: UsersService,
		private toastr: ToastrService,
		private state: StateService
	) {}

	@ViewChild(DataTableDirective, { static: false })
	dtElement!: DataTableDirective;

	datatableOptions: DataTables.Settings = {
		pagingType: 'full_numbers',
		pageLength: 10,
		responsive: true,
	};

	datatableTrigger = new Subject<DataTables.Settings>();

	me = new User();

	items = new Array<User>();

	loading = false;

	title = '';

	role!: Roles;

	roles = Roles;

	activatedRouteData!: Subscription;

	ngOnInit(): void {
		this.me = this.state.get<User>('user') || new User();
		this.activatedRouteData = this.activatedRoute.data.subscribe((data) => {
			const names = {
				[Roles.ADMIN]: 'Administrators',
				[Roles.FACULTY]: 'Faculty',
				[Roles.STUDENT]: 'Students',
			};
			this.role = data['role'];
			this.title = names[data['role'] as Roles];
			this.fetchItems();
		});
	}

	fetchItems() {
		this.loading = true;
		this.service
			.all(this.role)
			.subscribe((users) => {
				this.items = users;

				if (this.dtElement.dtInstance) {
					this.dtElement.dtInstance
						.then((instance) => {
							instance.destroy();
						})
						.finally(() => {
							this.datatableTrigger.next(this.datatableOptions);
						});
				} else {
					this.datatableTrigger.next(this.datatableOptions);
				}
			})
			.add(() => (this.loading = false));
	}

	async remove(id: any) {
		if (
			await Asker.danger(
				`Are you sure you want to delete this ${this.role}?`
			)
		) {
			this.service
				.delete(id)
				.subscribe({
					next: () => {
						this.toastr.success(
							`${this.role} deleted successfully!`
						);
					},
					error: () => {
						this.toastr.error(`Unable to delete ${this.role}.`);
					},
				})
				.add(() => this.fetchItems());
		}
	}

	ngOnDestroy(): void {
		this.datatableTrigger.unsubscribe();
		this.activatedRouteData.unsubscribe();
	}
}
