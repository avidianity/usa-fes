import { Routes } from '@angular/router';
import { AcademicYearsComponent } from './academic-years/academic-years.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { Roles } from './contracts/enums/roles.enum';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPanelComponent } from './dashboard/main-panel/main-panel.component';
import { EvaluationCriteriasComponent } from './evaluation-criterias/evaluation-criterias.component';
import { EvaluationReportsComponent } from './evaluation-reports/evaluation-reports.component';
import { QuestionnairesComponent } from './questionnaires/questionnaires.component';
import { SectionsComponent } from './sections/sections.component';
import { SubjectsFormComponent } from './subjects/subjects-form/subjects-form.component';
import { SubjectsListComponent } from './subjects/subjects-list/subjects-list.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'register',
		component: RegisterComponent,
	},
	{
		path: 'dashboard',
		component: DashboardComponent,
		children: [
			{
				path: '',
				component: MainPanelComponent,
			},
			{
				path: 'subjects',
				component: SubjectsComponent,
				children: [
					{
						path: '',
						component: SubjectsListComponent,
					},
					{
						path: 'add',
						component: SubjectsFormComponent,
					},
					{
						path: ':id/edit',
						component: SubjectsFormComponent,
					},
				],
			},
			{
				path: 'sections',
				component: SectionsComponent,
			},
			{
				path: 'academic-years',
				component: AcademicYearsComponent,
			},
			{
				path: 'questionnaires',
				component: QuestionnairesComponent,
			},
			{
				path: 'evaluation-criterias',
				component: EvaluationCriteriasComponent,
			},
			{
				path: 'evaluation-reports',
				component: EvaluationReportsComponent,
			},
			{
				path: 'administrators',
				component: UsersComponent,
				data: {
					role: Roles.ADMIN,
				},
			},
			{
				path: 'faculties',
				component: UsersComponent,
				data: {
					role: Roles.FACULTY,
				},
			},
			{
				path: 'students',
				component: UsersComponent,
				data: {
					role: Roles.STUDENT,
				},
			},
		],
	},
	{
		path: '**',
		redirectTo: '/login',
	},
];
