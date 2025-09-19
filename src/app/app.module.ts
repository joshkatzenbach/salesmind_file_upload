import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { MetadataFormComponent } from './components/metadata-form/metadata-form.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { QueryComponent } from './pages/query/query.component';
import { DocumentsComponent } from './pages/documents/documents.component';

const routes: Routes = [
  { path: '', redirectTo: '/upload', pathMatch: 'full' },
  { path: 'upload', component: FileUploadComponent },
  { path: 'query', component: QueryComponent },
  { path: 'documents', component: DocumentsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    MetadataFormComponent,
    SideMenuComponent,
    QueryComponent,
    DocumentsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
