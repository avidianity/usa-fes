import { Model } from './model';
import { Roles } from '../enums/roles.enum';
import { Section } from './section';
import { File } from './file';
import { Subject } from './subject';

export class User extends Model {
	public school_id?: string;
	public first_name = '';
	public last_name = '';
	public name = '';
	public email = '';
	public password = '';
	public active = false;
	public role: Roles = Roles.STUDENT;
	public section_id?: number;
	public section?: Section;
	public picture?: File;
	public subjects?: Subject[];
}
