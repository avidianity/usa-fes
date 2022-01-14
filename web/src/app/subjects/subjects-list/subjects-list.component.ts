import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'src/app/contracts/models/subject';
import { SubjectsService } from '../subjects.service';
import { Subject as Trigger } from 'rxjs';

@Component({
	selector: 'app-subjects-list',
	templateUrl: './subjects-list.component.html',
	styleUrls: ['./subjects-list.component.css'],
})
export class SubjectsListComponent implements OnInit, OnDestroy {
	constructor(private service: SubjectsService) {}

	datatableOptions: DataTables.Settings = {
		pagingType: 'full_numbers',
		pageLength: 10,
	};

	datatableTrigger = new Trigger<DataTables.Settings>();

	subjects = new Array<Subject>();

	loading = false;

	ngOnInit(): void {
		this.fetchSubjects();
	}

	fetchSubjects() {
		this.loading = true;
		this.service
			.all()
			.subscribe((subjects) => {
				this.subjects = subjects;
				this.datatableTrigger.next(this.datatableOptions);
			})
			.add(() => (this.loading = false));
	}

	ngOnDestroy(): void {
		this.datatableTrigger.unsubscribe();
	}
}
