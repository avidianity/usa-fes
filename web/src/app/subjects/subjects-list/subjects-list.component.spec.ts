import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';

import { SubjectsListComponent } from './subjects-list.component';

describe('SubjectsListComponent', () => {
	let component: SubjectsListComponent;
	let fixture: ComponentFixture<SubjectsListComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SubjectsListComponent],
			imports: [HttpClientModule, ToastrModule.forRoot()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SubjectsListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
