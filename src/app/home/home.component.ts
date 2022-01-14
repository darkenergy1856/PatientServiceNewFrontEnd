import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit , OnDestroy {

  private doctor = {} as Doctor

  patient : Patient[] = []

  tempPatient = {
    patientId : "1234",
    firstName : "Aryan",
    lastName  : "Chandra",
    address  : "Plot No 736 bari Co-operative",
    doctorId : this.doctor.doctorId,
    phoneNumber : 9835040885,
    dob : "23-09-2002",
    userName : "aryanchandra7360@gmail.com"
  }

  private loginSub !: Subscription

  private homeSub !: Subscription
 

  constructor(private loginService : LoginService , private homeService : HomeService) { }

  ngOnInit(): void {
    this.loginSub = this.loginService.doctorDetail.subscribe(doctorDetail =>{
      this.doctor = doctorDetail
      this.homeService.getAllPatient(this.doctor.doctorId)
    })  

    this.homeSub = this.homeService.patient.subscribe(patientList =>{
      this.patient = patientList
    })
  }

  getDoctor(){
    return this.doctor
  }

  onLogOut(){
    this.loginService.logOut();
  }


  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
    this.homeSub.unsubscribe();
  }


}
