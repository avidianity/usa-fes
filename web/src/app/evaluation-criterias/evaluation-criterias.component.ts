import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Asker, errorToStrings } from 'src/helpers';
import { Criteria } from '../contracts/models/criteria';
import { CriteriasService } from './criterias.service';

@Component({
	selector: 'app-evaluation-criterias',
	templateUrl: './evaluation-criterias.component.html',
	styleUrls: ['./evaluation-criterias.component.css'],
})
export class EvaluationCriteriasComponent implements OnInit {
	data = new Criteria();

	criterias: Criteria[] = [];

	processing = false;

	constructor(
		private service: CriteriasService,
		private toastr: ToastrService
	) {}

	ngOnInit(): void {
		this.fetchItems();
	}

	fetchItems() {
		this.service.all().subscribe((criterias) => {
			this.criterias = criterias;
		});
	}

	setCriteria(criteria: Criteria) {
		this.data = { ...criteria };
	}

	clearCriteria() {
		this.setCriteria(new Criteria());
	}

	moveUp = (criteria: Criteria) => {
		const index = this.criterias.findIndex(
			(item) => item.id === criteria.id
		);

		if (index !== 0) {
			this.criterias.splice(index, 1);
			this.criterias.splice(index - 1, 0, criteria);
		}
	};

	moveDown = (criteria: Criteria) => {
		const index = this.criterias.findIndex(
			(item) => item.id === criteria.id
		);

		if (index !== this.criterias.length - 1) {
			this.criterias.splice(index, 1);
			this.criterias.splice(index + 1, 0, criteria);
		}
	};

	edit = (criteria: Criteria) => {
		this.setCriteria(criteria);
	};

	delete = async (criteria: Criteria) => {
		await this.remove(criteria.id);
	};

	submit() {
		this.processing = true;
		this.service
			.save(this.data)
			.subscribe({
				next: () => {
					this.toastr.success('Criteria saved successfully!');
					this.fetchItems();
					this.clearCriteria();
				},
				error: (error: HttpErrorResponse) =>
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					),
			})
			.add(() => (this.processing = false));
	}

	saveOrder() {
		this.processing = true;

		this.service
			.saveOrder(this.criterias)
			.subscribe({
				next: () => {
					this.toastr.success('Criteria order saved successfully!');
					this.clearCriteria();
				},
				error: (error: HttpErrorResponse) =>
					errorToStrings(error).forEach((error) =>
						this.toastr.error(error)
					),
			})
			.add(() => (this.processing = false));
	}

	async remove(id: any) {
		if (
			await Asker.danger('Are you sure you want to delete this criteria?')
		) {
			this.service
				.delete(id)
				.subscribe({
					next: () => {
						this.toastr.success('Criteria deleted successfully!');
					},
					error: () => {
						this.toastr.error('Unable to delete criteria.');
					},
				})
				.add(() => this.fetchItems());
		}
	}
}
