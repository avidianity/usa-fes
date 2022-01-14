import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationCriteriasComponent } from './evaluation-criterias.component';

describe('EvaluationCriteriasComponent', () => {
  let component: EvaluationCriteriasComponent;
  let fixture: ComponentFixture<EvaluationCriteriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationCriteriasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationCriteriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
