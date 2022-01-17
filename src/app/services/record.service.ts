import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentDetail } from '../Entity/document';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(private httpClient : HttpClient) { }

  fetchAll(patientId : string){
    return this.httpClient.get<DocumentDetail[]>(environment.baseUrl + "fileService/listAll?patientId=" + patientId )
  }

}
