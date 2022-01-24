import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from '../app-routing.module';

import { EvaluationCriteriasComponent } from './evaluation-criterias.component';

describe('EvaluationCriteriasComponent', () => {
	let component: EvaluationCriteriasComponent;
	let fixture: ComponentFixture<EvaluationCriteriasComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EvaluationCriteriasComponent],
			imports: [
				AppRoutingModule,
				HttpClientModule,
				ToastrModule.forRoot(),
			],
		}).compileComponents();
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
