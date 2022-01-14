import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Register } from '../Entity/register';
import { environment } from 'src/environments/environment';
import { Doctor } from '../Entity/doctor';
import { LoggedInUser } from '../Entity/logged-in-user';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';



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
  private baseURL: string

  private token: string = ''

  private tokenExpirationTimer: any

  doctorDetail = new Subject<Doctor>()

  currentUser = new Subject<LoggedInUser>();

  constructor(private httpClient: HttpClient, private router: Router) {
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
      this.token = response.access_token
      const expires_in = new Date(new Date().getTime() + + response.expires_in * 1000);
      const user = new LoggedInUser(userName, response.access_token, expires_in);
      this.currentUser.next(user);
      this.autoLogout(+response.expires_in*1000)
      localStorage.setItem('userAuth', JSON.stringify(user))
      this.getDetails(userName).subscribe(newResponse => {
        this.doctorDetail.next(newResponse)
      })
      this.router.navigateByUrl("/home")
    }, error => {
      alert(error.error.error_description)
    })
  }

  autoLogin() {
    if (localStorage.getItem('userAuth') != null) {
      const tempUser: {
        userName: string,
        _token: string,
        _expirationDate: string,
      } = JSON.parse(localStorage.getItem('userAuth')!)
      const LoggedIn = new LoggedInUser(tempUser.userName, tempUser._token, new Date(tempUser._expirationDate))
      if (LoggedIn.token) {
        const remainingDuration = new Date(tempUser._expirationDate).getTime() - new Date().getTime()
        this.autoLogout(remainingDuration)
        this.currentUser.next(LoggedIn)
        this.token = LoggedIn.token
        this.getDetails(tempUser.userName).subscribe(newResponse => {
          this.doctorDetail.next(newResponse)
        })
      }
      this.router.navigateByUrl("/home")
    }
    else
      return;
  }

  autoLogout(expirationTime: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut()
    }, expirationTime)
  }


  getToken(): string {
    return this.token
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

  logOut() {
    this.currentUser.next(new LoggedInUser('', '', new Date()))
    this.token = ''
    localStorage.removeItem('userAuth')
    this.router.navigateByUrl("/")

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }

    this.tokenExpirationTimer = null
  }

}
