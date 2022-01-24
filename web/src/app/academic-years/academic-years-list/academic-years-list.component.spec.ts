import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';

import { AcademicYearsListComponent } from './academic-years-list.component';

describe('AcademicYearsListComponent', () => {
	let component: AcademicYearsListComponent;
	let fixture: ComponentFixture<AcademicYearsListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AcademicYearsListComponent],
			imports: [HttpClientModule, ToastrModule.forRoot()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AcademicYearsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
