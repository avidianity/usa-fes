import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { SectionsFormComponent } from './sections-form.component';

describe('SectionsFormComponent', () => {
	let component: SectionsFormComponent;
	let fixture: ComponentFixture<SectionsFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SectionsFormComponent],
			imports: [
				AppRoutingModule,
				HttpClientModule,
				ToastrModule.forRoot(),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SectionsFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
