import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { LoggedInUser } from '../Entity/logged-in-user';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (req.url === 'http://localhost:8777/oauth/token' ||
      req.url === 'http://localhost:8777/register' ||
      req.url === 'http://localhost:8777/doctorService/checkDoctor') {
      return next.handle(req)
    } else {
      const modifiedRequest = req.clone({ headers: req.headers.append('Authorization', 'Bearer ' + this.loginService.getToken()) })
      return next.handle(modifiedRequest);
    }
  }
}
