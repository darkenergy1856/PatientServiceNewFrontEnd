import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';
import { LoggedInUser } from './Entity/logged-in-user';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private loginService: LoginService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (req.url === 'http://localhost:8777/oauth/token') {
      return next.handle(req)
    } else {
      const modifiedRequest = req.clone({ headers: req.headers.append('Authorization' , 'Bearer ' + this.loginService.getToken())})
      return next.handle(modifiedRequest);
    }
  }
}
