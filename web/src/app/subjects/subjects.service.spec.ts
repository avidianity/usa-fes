import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { SubjectsService } from './subjects.service';

describe('SubjectsService', () => {
	let service: SubjectsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(SubjectsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
