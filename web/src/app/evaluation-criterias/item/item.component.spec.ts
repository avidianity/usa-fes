import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Criteria } from 'src/app/contracts/models/criteria';

import { ItemComponent } from './item.component';

describe('ItemComponent', () => {
	let component: ItemComponent;
	let fixture: ComponentFixture<ItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ItemComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ItemComponent);
		component = fixture.componentInstance;
		component.criteria = new Criteria();
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
