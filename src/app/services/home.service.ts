import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Patient } from '../Entity/patient';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  patient = new BehaviorSubject<Patient[]>(null!)

  patientSent = new BehaviorSubject<Patient>(null!)

  constructor(private httpClient : HttpClient , private router :Router) { }

  getAllPatient(doctorId : string){
    this.httpClient.get<Patient[]>(environment.baseUrl + 'patientService/findByDoctorId?doctorId=' + doctorId).subscribe(response =>{
      this.patient.next(response)
    })
  }

  addPatient(patient : Patient){
    const formData = new FormData

    formData.append('firstName',patient.firstName)
    formData.append('lastName',patient.lastName)
    formData.append('address',patient.address)
    formData.append('doctorId',patient.doctorId)
    formData.append('dob',patient.dob)
    formData.append('phoneNumber', patient.phoneNumber.toString())
    formData.append('userName',patient.userName)

    return this.httpClient.post<boolean>(environment.baseUrl + 'doctorService/addPatient' , formData)
  }

  recordRedirect(patient : Patient){
    this.router.navigateByUrl('/record')
    this.patientSent.next(patient)
  }


}
