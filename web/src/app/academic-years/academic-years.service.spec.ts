import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AcademicYearsService } from './academic-years.service';

describe('AcademicYearsService', () => {
	let service: AcademicYearsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(AcademicYearsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
