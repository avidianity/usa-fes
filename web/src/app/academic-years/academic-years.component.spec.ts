import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcademicYearsFormComponent } from './academic-years-form/academic-years-form.component';
import { AcademicYearsListComponent } from './academic-years-list/academic-years-list.component';

import { AcademicYearsComponent } from './academic-years.component';

describe('AcademicYearsComponent', () => {
	let component: AcademicYearsComponent;
	let fixture: ComponentFixture<AcademicYearsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [
				AcademicYearsComponent,
				AcademicYearsListComponent,
				AcademicYearsFormComponent,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AcademicYearsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
