import { TestBed } from '@angular/core/testing';

import { CriteriasService } from './criterias.service';

describe('CriteriasService', () => {
  let service: CriteriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CriteriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
