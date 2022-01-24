import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { AcademicYearsFormComponent } from './academic-years-form.component';

describe('AcademicYearsFormComponent', () => {
	let component: AcademicYearsFormComponent;
	let fixture: ComponentFixture<AcademicYearsFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AcademicYearsFormComponent],
			imports: [
				AppRoutingModule,
				HttpClientModule,
				ToastrModule.forRoot(),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AcademicYearsFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
