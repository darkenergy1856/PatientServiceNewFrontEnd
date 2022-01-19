import { Component,OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentDetail } from '../Entity/document';
import { Patient } from '../Entity/patient';
import { HomeService } from '../services/home.service';
import { RecordService } from '../services/record.service';

import {saveAs} from 'file-saver';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit, OnDestroy {

  patient: Patient = {
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

  doctorId: string = ''

  private redirectSub !: Subscription

  private doctorDetail !: Subscription

  File !: File

  constructor(private homeService: HomeService, private recordService: RecordService) { }

  ngOnInit(): void {
    this.redirectSub = this.homeService.patientSent.subscribe(res => {
      this.patient = res
    });

    this.recordService.fetchAll(this.patient.patientId!).subscribe(res => {
      this.document = res
    })

    this.doctorDetail = this.homeService.doctorSent.subscribe(res => {
      this.doctorId = res
    })


  }

  selectedFile(event: { target: any; }) {
    this.File = <File>event.target!.files[0];
  }

  viewFile(fileId : Number , patientId : string){
    this.recordService.viewFile(fileId.toString()).subscribe(res=>{
      saveAs(new Blob([res] , {type : res.type}),"record "+patientId)
    })
  }

  upload(description: HTMLTextAreaElement) {

    const formData: FormData = new FormData()
    formData.append('doctorId', this.doctorId)
    formData.append('patientId', this.patient.patientId!)
    formData.append('description', description.value)
    formData.append('files', this.File)

    this.recordService.uploadFile(formData).subscribe(res=>{
      alert(res)
      this.recordService.fetchAll(this.patient.patientId!).subscribe(res => {
        this.document = res
      })
    })
  }

  ngOnDestroy(): void {
    this.redirectSub.unsubscribe()
    this.doctorDetail.unsubscribe()
  }

}
