import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { Register } from '../login/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private registerSuccess: boolean;
  private errorOccured: boolean;

  private registerDoctor = {} as Register;

  constructor(private loginService: LoginService, private router: Router) {
    this.registerSuccess = false
    this.errorOccured = false
  }

  ngOnInit(): void {
  }

  getRegistrationStatus(request: string): boolean {
    if (request === 'registerSuccess') {
      return this.registerSuccess
    } else {
      if (request === 'errorOccured') {
        return this.errorOccured
      }
      return true
    }
  }

  onSubmit(firstName: HTMLInputElement,
    lastName: HTMLInputElement,
    doctorId: HTMLInputElement,
    description: HTMLInputElement,
    userName: HTMLInputElement,
    password: HTMLInputElement,
    phoneNumber: HTMLInputElement) {
    this.registerDoctor.firstName = firstName.value
    this.registerDoctor.lastName = lastName.value
    this.registerDoctor.userName = userName.value
    this.registerDoctor.description = description.value
    this.registerDoctor.phoneNumber = +phoneNumber.value
    this.registerDoctor.doctorId = doctorId.value
    this.registerDoctor.password = password.value

    this.loginService.registerDoctor(this.registerDoctor).subscribe(resData => {}, error => {
      this.errorOccured = true
     }, () => {
      this.registerSuccess = true;
    })

    if (this.registerSuccess === true) {
      this.router.navigateByUrl("/")
    }

  }
}
