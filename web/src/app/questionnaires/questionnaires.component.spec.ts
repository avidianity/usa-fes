import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';

import { QuestionnairesComponent } from './questionnaires.component';

describe('QuestionnairesComponent', () => {
	let component: QuestionnairesComponent;
	let fixture: ComponentFixture<QuestionnairesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [QuestionnairesComponent],
			imports: [HttpClientModule, ToastrModule.forRoot()],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(QuestionnairesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
