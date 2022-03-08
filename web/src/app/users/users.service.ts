import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import FormData from '@avidian/form-data';
import { isEmpty, isString } from 'lodash-es';
import { url } from 'src/helpers';
import { AssignFacultySubjectContract } from '../contracts/assign-faculty-subject.contract';
import { AssignStudentSubjectContract } from '../contracts/assign-student-subject.contract';
import { EloquentContract } from '../contracts/eloquent.contract';
import { Roles } from '../contracts/enums/roles.enum';
import { User } from '../contracts/models/user';
import { StateService } from '../state.service';

@Injectable({
	providedIn: 'root',
})
export class UsersService implements EloquentContract<User> {
	constructor(private http: HttpClient, private state: StateService) {}

	protected headers() {
		const headers = new HttpHeaders({
			Accept: 'application/json',
		});

		if (this.state.has('token')) {
			const token = this.state.get('token');

			return headers.set('Authorization', `Bearer ${token}`);
		}

		return headers;
	}

	save(data: Partial<User>) {
		if (data.id) {
			return this.update(data.id, data);
		}
		return this.store(data);
	}

	all(role?: Roles) {
		return this.http.get<User[]>(
			url('/api/users', role ? { role } : undefined),
			{
				headers: this.headers(),
			}
		);
	}

	find(id: number) {
		return this.http.get<User>(url(`/api/users/${id}`), {
			headers: this.headers(),
		});
	}

	store(data?: Record<string, any>) {
		const filtered: any = {};

		for (const [key, value] of Object.entries(data!)) {
			if (isString(value)) {
				if (!isEmpty(value)) {
					filtered[key] = value;
				}
			} else {
				filtered[key] = value;
			}
		}

		const payload = new FormData(filtered, { nullsAsUndefineds: true });

		return this.http.post<User>(url('/api/users'), payload, {
			headers: this.headers(),
		});
	}

	update(id: number, data?: Record<string, any>) {
		const filtered: any = {};

		for (const [key, value] of Object.entries(data!)) {
			if (isString(value)) {
				if (!isEmpty(value)) {
					filtered[key] = value;
				}
			} else {
				filtered[key] = value;
			}
		}

		const payload = new FormData(filtered, { nullsAsUndefineds: true });

		payload.set('_method', 'PUT');

		return this.http.post<User>(url(`/api/users/${id}`), payload, {
			headers: this.headers(),
		});
	}

	delete(id: number) {
		return this.http.delete<void>(url(`/api/users/${id}`), {
			headers: this.headers(),
		});
	}

	faculties() {
		return this.http.get<User[]>(url(`/api/users/faculties`), {
			headers: this.headers(),
		});
	}

	assignStudentSubjects(student_id: number, subjects: number[]) {
		return this.http.post(
			url('/api/student-subjects/assign'),
			{
				entries: [
					{
						student_id,
						subject_ids: subjects,
					},
				],
			},
			{
				headers: this.headers(),
			}
		);
	}

	assignStudentsToSubjects(entries: AssignStudentSubjectContract[]) {
		return this.http.post(
			url('api/student-subjects/assign'),
			{
				entries,
			},
			{
				headers: this.headers(),
			}
		);
	}

	assignFacultyToSubjects(id: number, data: AssignFacultySubjectContract) {
		return this.http.post(url(`/api/faculty-subjects/${id}`), data, {
			headers: this.headers(),
		});
	}

	removeFacultySubject(id: number) {
		return this.http.delete(url(`/api/faculty-subjects/${id}`), {
			headers: this.headers(),
		});
	}
}
