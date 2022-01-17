import { NgModule } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { InterceptorService } from './services/interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './services/authGuard.service';
import { RecordComponent } from './record/record.component';

const appRoutes : Routes = [
  {path : '' , component : LoginComponent } ,
  {path : 'register' , component : RegisterComponent },
  {path : 'home' , component : HomeComponent,canActivate:[AuthGuard],},
  {path : 'record' , component : RecordComponent , canActivate:[AuthGuard]},
];

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    RecordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatIconModule,
    BrowserAnimationsModule
  ],
  providers: [{provide : HTTP_INTERCEPTORS , 
              useClass:InterceptorService , 
              multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
