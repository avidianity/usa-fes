import { Model } from './model';
import { Roles } from '../enums/roles.enum';
import { File } from './file';
import { FacultySubject } from './faculty-subject';

export class Faculty extends Model {
	public school_id = '';
	public first_name = '';
	public last_name = '';
	public name = '';
	public email = '';
	public password = '';
	public active = false;
	public role: Roles = Roles.FACULTY;
	public picture?: File;
	public subjects?: FacultySubject[];
}
