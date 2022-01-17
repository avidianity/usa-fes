import { TestBed } from '@angular/core/testing';

import { AcademicYearsService } from './academic-years.service';

describe('AcademicYearsService', () => {
  let service: AcademicYearsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicYearsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
