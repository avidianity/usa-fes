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
