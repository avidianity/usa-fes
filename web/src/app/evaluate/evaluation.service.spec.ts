import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { EvaluationService } from './evaluation.service';

describe('EvaluationService', () => {
	let service: EvaluationService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(EvaluationService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
