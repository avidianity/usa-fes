import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

// 3rd Party Modules
import { ToastrModule } from 'ngx-toastr';

// App Modules
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SectionsComponent } from './sections/sections.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { MainPanelComponent } from './dashboard/main-panel/main-panel.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AcademicYearsComponent } from './academic-years/academic-years.component';
import { QuestionnairesComponent } from './questionnaires/questionnaires.component';
import { EvaluationCriteriasComponent } from './evaluation-criterias/evaluation-criterias.component';
import { UsersComponent } from './users/users.component';
import { EvaluationReportsComponent } from './evaluation-reports/evaluation-reports.component';
import { SubjectsListComponent } from './subjects/subjects-list/subjects-list.component';
import { TitleComponent } from './shared/title/title.component';
import { DataTablesModule } from 'angular-datatables';
import { SubjectsFormComponent } from './subjects/subjects-form/subjects-form.component';
import { SectionsListComponent } from './sections/sections-list/sections-list.component';
import { SectionsFormComponent } from './sections/sections-form/sections-form.component';
import { AcademicYearsListComponent } from './academic-years/academic-years-list/academic-years-list.component';
import { AcademicYearsFormComponent } from './academic-years/academic-years-form/academic-years-form.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersFormComponent } from './users/users-form/users-form.component';
import { CardComponent } from './shared/card/card.component';
import { ItemComponent } from './evaluation-criterias/item/item.component';
import { QuestionItemMenuComponent } from './questionnaires/question-item-menu/question-item-menu.component';
import { EvaluateComponent } from './evaluate/evaluate.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { SubjectsAssignComponent } from './subjects/subjects-assign/subjects-assign.component';
import { TableComponent } from './shared/table/table.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		DashboardComponent,
		SectionsComponent,
		SidebarComponent,
		SubjectsComponent,
		MainPanelComponent,
		NavbarComponent,
		AcademicYearsComponent,
		QuestionnairesComponent,
		EvaluationCriteriasComponent,
		UsersComponent,
		EvaluationReportsComponent,
		SubjectsListComponent,
		TitleComponent,
		SubjectsFormComponent,
		SectionsListComponent,
		SectionsFormComponent,
		AcademicYearsListComponent,
		AcademicYearsFormComponent,
		UsersListComponent,
		UsersFormComponent,
		CardComponent,
		ItemComponent,
		QuestionItemMenuComponent,
		EvaluateComponent,
		ForgotPasswordComponent,
		SubjectsAssignComponent,
  TableComponent,
	],
	imports: [
		FormsModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot(),
		DataTablesModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
