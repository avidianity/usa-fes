import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionItemMenuComponent } from './question-item-menu.component';

describe('QuestionItemMenuComponent', () => {
  let component: QuestionItemMenuComponent;
  let fixture: ComponentFixture<QuestionItemMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionItemMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionItemMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
