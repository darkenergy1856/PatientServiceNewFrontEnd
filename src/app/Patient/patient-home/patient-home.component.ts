import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentDetail } from 'src/app/Entity/document';
import { Patient } from 'src/app/Entity/patient';
import { PatientHomeService } from 'src/app/services/patient-home.service';

import {saveAs} from 'file-saver';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-patient-home',
  templateUrl: './patient-home.component.html',
  styleUrls: ['./patient-home.component.css']
})
export class PatientHomeComponent implements OnInit {

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

  File !: File

  constructor(private patientHomeService : PatientHomeService , private loginService : LoginService) { }

  ngOnInit(): void {
    this.loginService.patientDetail.subscribe(res=>{
      this.patient = res
      console.log("Called from here")
      this.patientHomeService.fetchAll(res.patientId!).subscribe(res => {
        this.document = res
      })
    })
  }

  viewFile(fileId : Number , patientId : string){
    this.patientHomeService.viewFile(fileId.toString()).subscribe(res=>{
      saveAs(new Blob([res] , {type : res.type}),"record "+ patientId)
    })
  }

  onLogOut() {
    this.loginService.logOut();
  }

}
