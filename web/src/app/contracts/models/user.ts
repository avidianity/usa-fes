import { Model } from './model';
import { Roles } from '../enums/roles.enum';

export class User extends Model {
	public school_id?: string;
	public first_name = '';
	public last_name = '';
	public name = '';
	public email = '';
	public password = '';
	public active = false;
	public role: Roles = Roles.STUDENT;
}
