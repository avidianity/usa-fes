import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsAssignComponent } from './subjects-assign.component';

describe('SubjectsAssignComponent', () => {
	let component: SubjectsAssignComponent;
	let fixture: ComponentFixture<SubjectsAssignComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SubjectsAssignComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SubjectsAssignComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
