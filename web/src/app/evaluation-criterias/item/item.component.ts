import { Component, Input } from '@angular/core';
import { Criteria } from 'src/app/contracts/models/criteria';

@Component({
	selector: 'app-evaluation-criteria-item',
	templateUrl: './item.component.html',
	styleUrls: ['./item.component.css'],
})
export class ItemComponent {
	@Input() criteria!: Criteria;

	menuOpen = false;

	toggleMenu() {
		this.menuOpen = !this.menuOpen;
	}

	@Input() onMoveUp!: (criteria: Criteria) => void;
	@Input() onMoveDown!: (criteria: Criteria) => void;
	@Input() onEdit!: (criteria: Criteria) => void;
	@Input() onDelete!: (criteria: Criteria) => void;

	moveUp() {
		this.menuOpen = false;
		this.onMoveUp(this.criteria);
	}

	moveDown() {
		this.menuOpen = false;
		this.onMoveDown(this.criteria);
	}

	edit() {
		this.menuOpen = false;
		this.onEdit(this.criteria);
	}

	delete() {
		this.menuOpen = false;
		this.onDelete(this.criteria);
	}
}
