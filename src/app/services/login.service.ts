import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Register } from '../Entity/register';
import { environment } from 'src/environments/environment.prod';
import { Doctor } from '../Entity/doctor';
import { LoggedInUser } from '../Entity/logged-in-user';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Patient } from '../Entity/patient';

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

  private token: string = ''

  private authority: string = ''

  private tokenExpirationTimer: any

  emptyDoctor: Doctor = {
    id: '',
    firstName: '',
    lastName: '',
    userName: '',
    doctorId: '',
    description: '',
    phoneNumber: +'',
  }

  emptyPatient: Patient = {
    patientId: '',
    firstName: '',
    lastName: '',
    address: '',
    doctorId: '',
    phoneNumber: +'',
    dob: '',
    userName: '',
  }

  doctorDetail = new BehaviorSubject<Doctor>(this.emptyDoctor)

  patientDetail = new Subject<Patient>()

  sentDoctorDetail !: Doctor

  currentUser = new Subject<LoggedInUser>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  setUserNameAndPassword(userName: string, password: string) {

    const formData = new FormData();

    formData.append('username', userName)
    formData.append('password', password)
    formData.append('grant_type', 'password')

    this.httpClient.post<AuthResponseData>(environment.baseUrl + 'oauth/token', formData, {
      headers: new HttpHeaders({ Authorization: "Basic " + btoa(environment.clientUsername + ':' + environment.clientPassword) })
    }).subscribe(response => {
      this.token = response.access_token
      this.getLoginAuthority(userName).subscribe(authority => {
        this.authority = authority
        const expires_in = new Date(new Date().getTime() + + response.expires_in * 1000);
        const user = new LoggedInUser(userName, response.access_token, expires_in, authority);
        this.currentUser.next(user);
        this.autoLogout(+response.expires_in * 1000)
        localStorage.setItem('userAuth', JSON.stringify(user))
        if (authority === 'DOCTOR') {
          this.getDetailsDoctor(userName).subscribe(newResponse => {
            this.doctorDetail.next(newResponse)
          })
          this.router.navigateByUrl("/home")
        }
        if (authority === 'PATIENT') {
          this.getDetailsPatient(userName).subscribe(newResponse => {
            this.patientDetail.next(newResponse)
          })
          this.router.navigateByUrl("/patient")
        }

      })
    }, error => {
      alert(error.error.error_description)
    })
  }

  getLoginAuthority(userName: string) {
    return this.httpClient.get(environment.baseUrl + "loginAuthority?userName=" + userName, { responseType: 'text' })
  }

  getToken(): string {
    return this.token
  }

  getAuthority(): string {
    return this.authority
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

    return this.httpClient.post(environment.baseUrl + 'register', formData)
  }

  checkDetail(userName: string, doctorId: string) {
    return this.httpClient.get<boolean>(environment.baseUrl + 'doctorService/checkDoctor', { headers: { 'userName': userName, 'doctorId': doctorId } })
  }

  private getDetailsDoctor(userName: string) {
    return this.httpClient.get<Doctor>(environment.baseUrl + 'doctorService/detail?userName=' + userName)
  }

  private getDetailsPatient(userName: string) {
    return this.httpClient.get<Patient>(environment.baseUrl + 'patientService/patientDetail?userName=' + userName)
  }

  autoLogin() {
    if (localStorage.getItem('userAuth') != null) {
      const tempUser: {
        userName: string,
        _token: string,
        _expirationDate: string,
        _authorizationType: string,
      } = JSON.parse(localStorage.getItem('userAuth')!)
      const LoggedIn = new LoggedInUser(tempUser.userName, tempUser._token, new Date(tempUser._expirationDate), tempUser._authorizationType)
      if (LoggedIn.token) {
        this.authority = LoggedIn.authorizationType
        const remainingDuration = new Date(tempUser._expirationDate).getTime() - new Date().getTime()
        this.autoLogout(remainingDuration)
        this.currentUser.next(LoggedIn)
        this.token = LoggedIn.token
        if (LoggedIn.authorizationType === 'DOCTOR') {
          this.getDetailsDoctor(tempUser.userName).subscribe(newResponse => {
            this.doctorDetail.next(newResponse)
          })
          this.router.navigateByUrl("/home")
        }
        if (LoggedIn.authorizationType === 'PATIENT') {
          this.getDetailsPatient(tempUser.userName).subscribe(newResponse => {
            this.patientDetail.next(newResponse)
          })
          this.router.navigateByUrl("/patient")
        }
      }
      else
        return;
    }
  }

  autoLogout(expirationTime: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut()
    }, expirationTime)
  }

  logOut() {
    this.currentUser.next(new LoggedInUser('', '', new Date(), ''))
    this.token = ''
    localStorage.removeItem('userAuth')
    this.router.navigateByUrl("/")

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }

    this.tokenExpirationTimer = null
  }

}
