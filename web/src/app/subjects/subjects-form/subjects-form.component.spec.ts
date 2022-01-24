import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { SubjectsFormComponent } from './subjects-form.component';

describe('SubjectsFormComponent', () => {
	let component: SubjectsFormComponent;
	let fixture: ComponentFixture<SubjectsFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SubjectsFormComponent],
			imports: [
				HttpClientModule,
				ToastrModule.forRoot(),
				AppRoutingModule,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SubjectsFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
