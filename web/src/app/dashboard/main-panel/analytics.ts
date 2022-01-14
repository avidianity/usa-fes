import { AcademicYear } from 'src/app/contracts/models/academic-year';

export class Analytics {
	constructor(
		public administrators = 0,
		public faculties = 0,
		public students = 0,
		public sections = 0,
		public academic_year?: AcademicYear
	) {}
}
