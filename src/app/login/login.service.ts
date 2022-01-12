import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Register } from './register';
import { environment } from 'src/environments/environment';


export interface  AuthResponseData{
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

  constructor(private httpClient: HttpClient) {
    this.baseURL = 'http://localhost:8777/';
  }

  setUserNameAndPassword(userName: string, password: string) {
    console.log('UserName : ' + userName)
    console.log('Password : ' + password)

    const formData = new FormData();

    formData.append('username', userName)
    formData.append('password', password)
    formData.append('grant_type', 'password')

    return this.httpClient.post<AuthResponseData>(this.baseURL + 'oauth/token', formData, {
      headers: new HttpHeaders({ Authorization: "Basic " + btoa(environment.clientUsername + ':' + environment.clientPassword) })
    })
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
}
