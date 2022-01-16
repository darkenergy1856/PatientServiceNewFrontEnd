import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Doctor } from '../Entity/doctor';
import { Patient } from '../Entity/patient';
import { HomeService } from '../services/home.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private doctor = {} as Doctor

  patient: Patient[] = []

  private loginSub !: Subscription

  private homeSub !: Subscription

  Check: boolean = true


  constructor(private loginService: LoginService, private homeService: HomeService) { }

  ngOnInit(): void {
    this.loginSub = this.loginService.doctorDetail.subscribe(doctorDetail => {
      this.doctor = doctorDetail
      this.homeService.getAllPatient(this.doctor.doctorId)
    })

    this.homeSub = this.homeService.patient.subscribe(patientList => {
      this.patient = patientList
    })
  }

  getDoctor() {
    return this.doctor
  }

  onLogOut() {
    this.loginService.logOut();
  }

  onAddPatient(addForm: NgForm) {

    const newPatient: Patient = {
      firstName: addForm.value.firstName,
      lastName: addForm.value.lastName,
      address: addForm.value.address,
      doctorId: this.doctor.doctorId,
      phoneNumber: addForm.value.phoneNumber,
      dob: addForm.value.dateOfBirth,
      userName: addForm.value.userName
    }

    this.homeService.addPatient(newPatient).subscribe(response => {
      this.homeService.getAllPatient(this.doctor.doctorId)
      this.Check = response
    },()=>{
      this.Check = false
    })
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
    this.homeSub.unsubscribe();
  }


}
