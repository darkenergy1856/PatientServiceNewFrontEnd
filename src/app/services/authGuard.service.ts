import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, take } from "rxjs";
import { LoggedInUser } from "../Entity/logged-in-user";
import { LoginService } from "./login.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate{

    constructor(private loginService : LoginService , private router : Router ){
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        if(this.loginService.getToken() &&  (this.loginService.getAuthority() === 'DOCTOR')){
            return true
        }else{
            console.log("Redirected")
            return this.router.createUrlTree(['/'])
        }
     }
    
}