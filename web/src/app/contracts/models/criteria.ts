import { Model } from './model';
import { Question } from './question';

export class Criteria extends Model {
	public title = '';
	public order = 0;
	public questions?: Question[];
}
