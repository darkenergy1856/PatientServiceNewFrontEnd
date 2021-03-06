import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Register } from '../../Entity/register';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private registerSuccess: boolean;
  private errorOccured: boolean;

  private preCheck: boolean;

  private registerDoctor = {} as Register;

  constructor(private loginService: LoginService) {
    this.registerSuccess = false
    this.errorOccured = false
    this.preCheck = true
  }

  ngOnInit(): void {
  }

  getRegistrationStatus(request: string): boolean {
    switch (request) {
      case 'registerSuccess': {
        return this.registerSuccess
      }

      case 'errorOccured': {
        return this.errorOccured
      }

      case 'preCheck': {
        return this.preCheck
      }
    }
    return false
  }

  onSubmit(form: NgForm) {

    this.errorOccured = false
    this.registerSuccess = false
    this.preCheck = true

    this.registerDoctor.firstName = form.value.firstName
    this.registerDoctor.lastName = form.value.lastName
    this.registerDoctor.userName = form.value.userName
    this.registerDoctor.description = form.value.description
    this.registerDoctor.phoneNumber = +form.value.phoneNumber
    this.registerDoctor.doctorId = form.value.doctorId
    this.registerDoctor.password = form.value.password

    this.loginService.checkDetail(form.value.userName ,  form.value.doctorId).subscribe(response=>{
      if(response){
        this.loginService.registerDoctor(this.registerDoctor).subscribe(() => { }, () => {
          this.errorOccured = true
        }, () => {
          this.registerSuccess = true;
        })
      }
      else{
        this.preCheck = false
      }
    })
  }
}
