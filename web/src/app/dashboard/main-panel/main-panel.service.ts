import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StateService } from 'src/app/state.service';
import { url } from 'src/helpers';
import { Analytics } from './analytics';

@Injectable({
	providedIn: 'root',
})
export class MainPanelService {
	constructor(private http: HttpClient, private state: StateService) {}

	analytics = new Subject<Analytics>();

	fetchAnalytics() {
		this.http
			.get<Analytics>(url('/api/analytics'), {
				headers: new HttpHeaders({
					Accept: 'application/json',
					Authorization: `Bearer ${this.state.get('token')}`,
				}),
			})
			.subscribe((data) => {
				this.analytics.next(data);
			});
	}
}
