export class ForgotPassword {
	constructor(
		public email = '',
		public password = '',
		public passwordConfirmation = '',
		public otp = ''
	) {}
}
