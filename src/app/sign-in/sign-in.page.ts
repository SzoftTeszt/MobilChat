import { Component, OnInit } from '@angular/core';
import { RecaptchaVerifier, getAuth } from 'firebase/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  phoneNo:any="+36303236954"
  code="111111"
  recaptchaVerifier:any
  user:any
  constructor(private auth:AuthService) {
    this.auth.getUser().subscribe(
      (user)=>{
        this.user=user
        console.log("SignIn Page User:", this.user)
      }
    )
   }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.recaptchaVerifier= new RecaptchaVerifier(
      getAuth(), 'recaptcha-container',
    {
      'size':'invisible',
      'callback': ()=>{
        console.log("Láthatatlan Oks!")
      },
      'expired-callback':()=>{
        console.log("Láthatatlan Hiba!")
      }
    })
  }

  signInWithPhone(){
    this.auth.signInwithPhone(this.phoneNo,this.recaptchaVerifier)
    .then(
      ()=>{
        // kód
        this.codeVerifier()
      }
    ).catch(
      (res)=>console.log("SignIn", res)
    )
  }

  codeVerifier(){
    this.auth.verificationCode(this.code).then(
      (res:any)=>console.log("A kód stimmel!",res)
    ).catch(
      (error:any)=>console.log("A kód HIBA!",error)
    )
  }
}
