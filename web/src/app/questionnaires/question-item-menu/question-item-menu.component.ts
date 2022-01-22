import { Component, Input } from '@angular/core';
import { Question } from 'src/app/contracts/models/question';

@Component({
	selector: 'app-question-item-menu',
	templateUrl: './question-item-menu.component.html',
	styleUrls: ['./question-item-menu.component.css'],
})
export class QuestionItemMenuComponent {
	@Input() question!: Question;

	menuOpen = false;

	toggleMenu() {
		this.menuOpen = !this.menuOpen;
	}

	@Input() onMoveUp!: (question: Question) => void;
	@Input() onMoveDown!: (question: Question) => void;
	@Input() onEdit!: (question: Question) => void;
	@Input() onDelete!: (question: Question) => void;

	moveUp() {
		this.menuOpen = false;
		this.onMoveUp(this.question);
	}

	moveDown() {
		this.menuOpen = false;
		this.onMoveDown(this.question);
	}

	edit() {
		this.menuOpen = false;
		this.onEdit(this.question);
	}

	delete() {
		this.menuOpen = false;
		this.onDelete(this.question);
	}
}
