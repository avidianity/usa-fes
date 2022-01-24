import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from '../app-routing.module';

import { EvaluateComponent } from './evaluate.component';

describe('EvaluateComponent', () => {
	let component: EvaluateComponent;
	let fixture: ComponentFixture<EvaluateComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EvaluateComponent],
			imports: [
				HttpClientModule,
				ToastrModule.forRoot(),
				AppRoutingModule,
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EvaluateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
