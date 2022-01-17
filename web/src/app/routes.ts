import { Routes } from '@angular/router';
import { AcademicYearsFormComponent } from './academic-years/academic-years-form/academic-years-form.component';
import { AcademicYearsListComponent } from './academic-years/academic-years-list/academic-years-list.component';
import { AcademicYearsComponent } from './academic-years/academic-years.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { Roles } from './contracts/enums/roles.enum';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPanelComponent } from './dashboard/main-panel/main-panel.component';
import { EvaluationCriteriasComponent } from './evaluation-criterias/evaluation-criterias.component';
import { EvaluationReportsComponent } from './evaluation-reports/evaluation-reports.component';
import { QuestionnairesComponent } from './questionnaires/questionnaires.component';
import { SectionsFormComponent } from './sections/sections-form/sections-form.component';
import { SectionsListComponent } from './sections/sections-list/sections-list.component';
import { SectionsComponent } from './sections/sections.component';
import { SubjectsFormComponent } from './subjects/subjects-form/subjects-form.component';
import { SubjectsListComponent } from './subjects/subjects-list/subjects-list.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { UsersFormComponent } from './users/users-form/users-form.component';
import { UsersListComponent } from './users/users-list/users-list.component';
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
				children: [
					{
						path: '',
						component: SectionsListComponent,
					},
					{
						path: 'add',
						component: SectionsFormComponent,
					},
					{
						path: ':id/edit',
						component: SectionsFormComponent,
					},
				],
			},
			{
				path: 'academic-years',
				component: AcademicYearsComponent,
				children: [
					{
						path: '',
						component: AcademicYearsListComponent,
					},
					{
						path: 'add',
						component: AcademicYearsFormComponent,
					},
					{
						path: ':id/edit',
						component: AcademicYearsFormComponent,
					},
				],
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
				path: 'admins',
				component: UsersComponent,
				children: [
					{
						path: '',
						component: UsersListComponent,
						data: {
							role: Roles.ADMIN,
						},
					},
					{
						path: 'add',
						component: UsersFormComponent,
						data: {
							role: Roles.ADMIN,
						},
					},
					{
						path: ':id/edit',
						component: UsersFormComponent,
						data: {
							role: Roles.ADMIN,
						},
					},
				],
			},
			{
				path: 'faculties',
				component: UsersComponent,
				children: [
					{
						path: '',
						component: UsersListComponent,
						data: {
							role: Roles.FACULTY,
						},
					},
					{
						path: 'add',
						component: UsersFormComponent,
						data: {
							role: Roles.FACULTY,
						},
					},
					{
						path: ':id/edit',
						component: UsersFormComponent,
						data: {
							role: Roles.FACULTY,
						},
					},
				],
			},
			{
				path: 'students',
				component: UsersComponent,
				children: [
					{
						path: '',
						component: UsersListComponent,
						data: {
							role: Roles.STUDENT,
						},
					},
					{
						path: 'add',
						component: UsersFormComponent,
						data: {
							role: Roles.STUDENT,
						},
					},
					{
						path: ':id/edit',
						component: UsersFormComponent,
						data: {
							role: Roles.STUDENT,
						},
					},
				],
			},
		],
	},
	{
		path: '**',
		redirectTo: '/login',
	},
];
