import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Patient } from '../Entity/patient';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  patient = new Subject<Patient[]>()

  constructor(private httpClient : HttpClient) { }

  getAllPatient(doctorId : string){
    this.httpClient.get<Patient[]>(environment.baseUrl + 'patientService/findByDoctorId?doctorId=9835040885').subscribe(response =>{
      this.patient.next(response)
    })
  }


}
