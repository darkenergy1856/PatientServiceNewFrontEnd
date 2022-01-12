import { Component,OnInit,} from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private user! : {

    email : '',
    password : ''

  }

    
  constructor(private loginService : LoginService) { 
  }

  ngOnInit(): void {
  }

  login(form : NgForm){
    this.user = form.value
    this.loginService.setUserNameAndPassword(this.user.email, this.user.password).subscribe(Response => {
      alert(Response)
    } , error => {
      console.log(error)
    })
    form.reset()
   }

}
