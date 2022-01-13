import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Register } from '../Entity/register';
import { environment } from 'src/environments/environment';
import { Doctor } from '../Entity/doctor';
import { LoggedInUser } from '../Entity/logged-in-user';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';



export interface AuthResponseData {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: string;
  scope: string;
  jti: string;
}


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseURL: String

  private authResponse = {} as AuthResponseData

  doctorDetail = new Subject<Doctor>()

  currentUser = new Subject<LoggedInUser>();

  constructor(private httpClient: HttpClient , private router : Router) {
    this.baseURL = environment.baseUrl
  }

  setUserNameAndPassword(userName: string, password: string) {

    const formData = new FormData();

    formData.append('username', userName)
    formData.append('password', password)
    formData.append('grant_type', 'password')

    this.httpClient.post<AuthResponseData>(this.baseURL + 'oauth/token', formData, {
      headers: new HttpHeaders({ Authorization: "Basic " + btoa(environment.clientUsername + ':' + environment.clientPassword) })
    }).subscribe(response => {
      this.authResponse = response;
      const expires_in = new Date(new Date().getTime() + + response.expires_in * 1000);
      const user = new LoggedInUser(userName , response.access_token , expires_in);
      this.currentUser.next(user);
      this.getDetails(userName).subscribe(newResponse => {
        this.doctorDetail.next(newResponse)
      })
      this.router.navigateByUrl("/home")
    }, error => {
      alert(error.error.error_description)
    })
  }

  getToken(): string {
    return  this.authResponse.access_token;
  }

  registerDoctor(newDoctor: Register) {
    const formData = new FormData();

    formData.append('firstName', newDoctor.firstName)
    formData.append('lastName', newDoctor.lastName)
    formData.append('userName', newDoctor.userName)
    formData.append('doctorId', newDoctor.doctorId)
    formData.append('description', newDoctor.description)
    formData.append('phoneNumber', newDoctor.phoneNumber.toString())
    formData.append('password', newDoctor.password)

    return this.httpClient.post(this.baseURL + 'register', formData)
  }

  private getDetails(userName: string) {
    return this.httpClient.get<Doctor>(this.baseURL + 'doctorService/detail?userName=' + userName)
  }
}
