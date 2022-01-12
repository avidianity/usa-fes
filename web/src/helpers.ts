import { HttpErrorResponse } from '@angular/common/http';
import { flatten, isObject } from 'lodash';
import { environment } from './environments/environment';

export function url(path: string) {
	return `${environment.serverUrl}${path}`;
}

export function errorToStrings(error: any) {
	if (error instanceof HttpErrorResponse) {
		const messages: string[] = [];

		if (error.status === 422 && isObject(error.error.errors)) {
			flatten(Object.values(error.error.errors)).forEach((error) =>
				messages.push(error as any)
			);
		} else if (error.error.message) {
			messages.push(error.error.message);
		}

		return messages.reverse();
	}

	return [error.message];
}
