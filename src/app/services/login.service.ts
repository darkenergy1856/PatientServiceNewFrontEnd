import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Register } from '../Entity/register';
import { environment } from 'src/environments/environment';
import { Doctor } from '../Entity/doctor';


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

  private authResponse  =  {} as AuthResponseData

  private doctorDetail = {} as Doctor

  constructor(private httpClient: HttpClient) {
    this.baseURL = 'http://localhost:8777/';
  }

  setUserNameAndPassword(userName: string, password: string) {

    const formData = new FormData();

    formData.append('username', userName)
    formData.append('password', password)
    formData.append('grant_type', 'password')

    this.httpClient.post<AuthResponseData>(this.baseURL + 'oauth/token', formData, {
      headers: new HttpHeaders({ Authorization: "Basic " + btoa(environment.clientUsername + ':' + environment.clientPassword) })
    }).subscribe(response => {
      this.authResponse  = response;
      console.log(this.authResponse)
      // this.getDetails(userName).subscribe(response =>{
      //   this.doctorDetail = response
      // })
    } , error =>{
      alert(error.error.error_description)
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

  getDetails(userName : string) {

    const param = new HttpParams()
    param.set('userName' , userName)

    return this.httpClient.get<Doctor>(this.baseURL + 'doctorService/detail' , {
      params : param,
    })
  }
}
