import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { MainPanelService } from './main-panel.service';

describe('MainPanelService', () => {
	let service: MainPanelService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(MainPanelService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
