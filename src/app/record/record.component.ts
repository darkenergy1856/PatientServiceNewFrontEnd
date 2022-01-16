import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Patient } from '../Entity/patient';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit, OnDestroy {

  patient : Patient = {
    firstName: '',
    lastName: '',
    address: '',
    doctorId: '',
    phoneNumber: +'',
    dob: '',
    userName: ''
  }

  private redirectSub !: Subscription

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.redirectSub = this.homeService.patientSent.subscribe(res=>{
      this.patient = res
    });

  }

  ngOnDestroy(): void {
    this.redirectSub.unsubscribe()
  }

}
