import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';

import { EvaluationReportsComponent } from './evaluation-reports.component';

describe('EvaluationReportsComponent', () => {
	let component: EvaluationReportsComponent;
	let fixture: ComponentFixture<EvaluationReportsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EvaluationReportsComponent],
			imports: [HttpClientModule, ToastrModule.forRoot()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EvaluationReportsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
