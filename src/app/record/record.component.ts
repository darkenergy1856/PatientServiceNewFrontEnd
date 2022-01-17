import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentDetail } from '../Entity/document';
import { Patient } from '../Entity/patient';
import { HomeService } from '../services/home.service';
import { RecordService } from '../services/record.service';

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
    userName: '',
    patientId: ''
  }

  document = [] as DocumentDetail[]

  doctorId : string = ''

  private redirectSub !: Subscription

  private doctorDetail !: Subscription

  constructor(private homeService: HomeService , private recordService : RecordService) { }

  ngOnInit(): void {
    this.redirectSub = this.homeService.patientSent.subscribe(res=>{
      this.patient = res
    });

    this.recordService.fetchAll(this.patient.patientId!).subscribe(res=>{
      this.document = res
    })

    this.doctorDetail = this.homeService.doctorSent.subscribe(res=>{
      this.doctorId = res
    })
    

  }

  upload() {  }

  ngOnDestroy(): void {
    this.redirectSub.unsubscribe()
    this.doctorDetail.unsubscribe()
  }

}
