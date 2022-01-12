import { Injectable } from '@angular/core';
import State from '@avidian/state';
import Cookies from 'js-cookie';

@Injectable({
	providedIn: 'root',
})
export class StateService extends State {
	constructor() {
		const storage = Cookies.get('storage') || 'local';

		Cookies.set('storage', storage, { expires: 7 });

		super();

		this.storage =
			storage === 'session' ? window.sessionStorage : window.localStorage;
		this.key = 'usa-fes';
	}

	asSession() {
		this.setStorage(window.sessionStorage);

		Cookies.set('storage', 'session', { expires: 7 });

		return this;
	}

	asLocal() {
		const data = this.getAll();

		this.setStorage(window.localStorage);

		this.setAll(data);

		Cookies.set('storage', 'local', { expires: 7 });

		return this;
	}
}
