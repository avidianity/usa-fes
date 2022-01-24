import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { QuestionsService } from './questions.service';

describe('QuestionsService', () => {
	let service: QuestionsService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
		});
		service = TestBed.inject(QuestionsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
