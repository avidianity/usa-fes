import { Observable } from 'rxjs';
import { Model } from './models/model';

export interface EloquentContract<T extends Model> {
	all(): Observable<T[]>;

	find(id: number): Observable<T>;

	store(data?: Record<string, any>): Observable<T>;

	update(id: number, data?: Record<string, any>): Observable<T>;

	delete(id: number): Observable<void>;
}
