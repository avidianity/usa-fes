import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';

import { UsersFormComponent } from './users-form.component';

describe('UsersFormComponent', () => {
	let component: UsersFormComponent;
	let fixture: ComponentFixture<UsersFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UsersFormComponent],
			imports: [
				AppRoutingModule,
				HttpClientModule,
				ToastrModule.forRoot(),
			],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UsersFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
