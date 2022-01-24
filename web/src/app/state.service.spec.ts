import { TestBed } from '@angular/core/testing';
import { MemoryStorage } from '@avidian/state';

import { StateService } from './state.service';

describe('StateService', () => {
	let service: StateService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StateService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should be an instance of @avidian/state', () => {
		expect(service).toBeInstanceOf(StateService);
	});
});
