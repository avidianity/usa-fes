import { Observable } from 'rxjs';
import { Model } from './models/model';

export interface EloquentContract<T extends Model> {
	all(): Observable<T[]>;

	find(id: number): Observable<T>;

	store(data?: Partial<T>): Observable<T>;

	update(id: number, data?: Partial<T>): Observable<T>;

	delete(id: number): Observable<void>;

	save(data: Partial<T>): Observable<T>;
}
