import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/contracts/models/user';
import { StateService } from 'src/app/state.service';
import { Analytics } from './analytics';
import { MainPanelService } from './main-panel.service';

@Component({
	selector: 'app-main-panel',
	templateUrl: './main-panel.component.html',
	styleUrls: ['./main-panel.component.css'],
})
export class MainPanelComponent implements OnInit {
	user = new User();

	analytics = new Analytics();

	constructor(
		private state: StateService,
		private mainPanel: MainPanelService
	) {}

	ngOnInit(): void {
		if (this.state.has('user')) {
			this.user = this.state.get('user')!;
		}

		this.mainPanel.analytics.subscribe((analytics) => {
			this.analytics = analytics;
		});
		this.mainPanel.fetchAnalytics();
	}
}
