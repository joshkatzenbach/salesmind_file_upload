import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { MetadataFormComponent } from './components/metadata-form/metadata-form.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QueryComponent } from './pages/query/query.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { ManageUsersComponent } from './pages/manage-users/manage-users.component';
import { PromptHistoryComponent } from './pages/prompt-history/prompt-history.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UploadGuard } from './guards/upload.guard';
import { QueryGuard } from './guards/query.guard';
import { ManageUsersGuard } from './guards/manage-users.guard';
import { PromptHistoryGuard } from './guards/prompt-history.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'upload', component: FileUploadComponent, canActivate: [UploadGuard] },
  { path: 'query', component: QueryComponent, canActivate: [QueryGuard] },
  { path: 'documents', component: DocumentsComponent, canActivate: [AdminGuard] },
  { path: 'manage-users', component: ManageUsersComponent, canActivate: [ManageUsersGuard] },
  { path: 'prompt-history', component: PromptHistoryComponent, canActivate: [PromptHistoryGuard] }
];

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    MetadataFormComponent,
    SideMenuComponent,
    ConfirmationModalComponent,
    LoginComponent,
    RegisterComponent,
    UnauthorizedComponent,
    DashboardComponent,
    QueryComponent,
    DocumentsComponent,
    ManageUsersComponent,
    PromptHistoryComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
