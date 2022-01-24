import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { SectionsListComponent } from './sections-list.component';

describe('SectionsListComponent', () => {
	let component: SectionsListComponent;
	let fixture: ComponentFixture<SectionsListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SectionsListComponent],
			imports: [
				AppRoutingModule,
				HttpClientModule,
				ToastrModule.forRoot(),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SectionsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
