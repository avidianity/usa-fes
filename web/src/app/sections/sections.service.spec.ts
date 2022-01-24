import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { SectionsService } from './sections.service';

describe('SectionsService', () => {
	let service: SectionsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(SectionsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
