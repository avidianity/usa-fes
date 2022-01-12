export class Register {
	constructor(
		public school_id = '',
		public first_name = '',
		public last_name = '',
		public email = '',
		public password = '',
		public password_confirmation = '',
		public section_id = '',
		public picture?: File
	) {}
}
