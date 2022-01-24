import { Component, OnInit } from '@angular/core';
import { User } from '../contracts/models/user';
import { StateService } from '../state.service';
import { UsersService } from '../users/users.service';

@Component({
	selector: 'app-evaluate',
	templateUrl: './evaluate.component.html',
	styleUrls: ['./evaluate.component.css'],
})
export class EvaluateComponent implements OnInit {
	loaded = false;
	user = new User();

	faculties: User[] = [];

	faculty_id = '';

	faculty: User | null = null;

	constructor(
		private state: StateService,
		private usersService: UsersService
	) {}

	ngOnInit(): void {
		const user = this.state.get<User>('user');

		if (user) {
			this.user = user;
		}

		this.fetchFaculties();
	}

	fetchFaculties() {
		this.usersService
			.faculties()
			.subscribe((faculties) => (this.faculties = faculties))
			.add(() => (this.loaded = true));
	}

	onChange(value: string) {
		const id = Number(value);

		const faculty = this.faculties.find((faculty) => faculty.id === id);

		if (faculty) {
			this.faculty = faculty;
		} else {
			this.faculty = null;
		}
	}
}
