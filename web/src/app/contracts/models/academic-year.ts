import { EvaluationStatuses } from '../enums/evaluation-statuses.enum';
import { Semesters } from '../enums/semesters.enum';
import { Model } from './model';

export class AcademicYear extends Model {
	public year = '';
	public semester: Semesters = Semesters.FIRST_SEMESTER;
	public active = false;
	public status: EvaluationStatuses = EvaluationStatuses.EVALUATION_CLOSED;
}
