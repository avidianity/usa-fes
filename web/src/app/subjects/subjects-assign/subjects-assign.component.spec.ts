import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';

import { SubjectsAssignComponent } from './subjects-assign.component';

describe('SubjectsAssignComponent', () => {
	let component: SubjectsAssignComponent;
	let fixture: ComponentFixture<SubjectsAssignComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SubjectsAssignComponent],
			imports: [HttpClientModule, ToastrModule.forRoot()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SubjectsAssignComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
