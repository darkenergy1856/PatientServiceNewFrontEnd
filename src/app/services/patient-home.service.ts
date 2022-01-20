import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { DocumentDetail } from '../Entity/document';
import { Patient } from '../Entity/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientHomeService {

  constructor(private httpClient : HttpClient) { }

  fetchAll(patientId : string){
    return this.httpClient.get<DocumentDetail[]>(environment.baseUrl + "fileService/listAll?patientId=" + patientId )
  }

  viewFile(fileId : string):Observable<Blob>{
    return this.httpClient.get(environment.baseUrl + "fileService/downloadFile?fileId=" + fileId , { responseType: 'blob'} )
  }

}
