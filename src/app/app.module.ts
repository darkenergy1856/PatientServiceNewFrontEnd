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
import { InterceptorService } from './interceptor.service';

const appRoutes : Routes = [
  {path : '' , component : LoginComponent } ,
  {path : 'register' , component : RegisterComponent },
  {path : 'home' , component : HomeComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatIconModule
  ],
  providers: [{provide : HTTP_INTERCEPTORS , 
              useClass:InterceptorService , 
              multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
