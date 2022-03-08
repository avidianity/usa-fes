import { Model } from './model';
import { Section } from './section';
import { Subject } from './subject';

export class FacultySubject extends Model {
	public subject?: Subject;
	public section?: Section;
}
