import { Component, OnInit } from '@angular/core';
import { RecaptchaVerifier, getAuth } from 'firebase/auth';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  phoneNo:any=""
  code=""
  recaptchaVerifier:any
  recaptchaVerifierVisible:any
  user:any
  codeWrite=false
  recaptcha=true

  constructor(private auth:AuthService, private router:Router, private alertController:AlertController) {
    this.auth.getUser().subscribe(
      (user)=>{
        this.user=user
        console.log("SignIn Page User:", this.user)
        if(user) this.router.navigate(['/home'])
      }
    )
   }

  ngOnInit() {
  }
  ionViewWillLeave(){
    this.recaptchaVerifierVisible.clear()
    this.recaptchaVerifierVisible=null
    // this.recaptchaVerifier.clear()
    this.recaptchaVerifier=null
  }

  ionViewDidEnter(){
    console.log("this.recaptchaVerifier: ",this.recaptchaVerifier)
    console.log("this.recaptchaVerifierVisible: ",this.recaptchaVerifierVisible)
    this.codeWrite=false
    this.recaptcha=true
    if (!this.recaptchaVerifier) this.recaptchaVerifier= new RecaptchaVerifier(
      getAuth(), 'recaptcha-container',
    {
      'size':'invisible',
      'callback': ()=>{
        console.log("Láthatatlan Oks!")
      },
      'expired-callback':()=>{
        console.log("Láthatatlan Hiba!")
        this.recaptcha=false
      }
    })

    this.recaptchaVerifierVisible= new RecaptchaVerifier(
      getAuth(), 'recaptcha-container-visible',
    {
      'size':'normal',
      'callback': ()=>{
        console.log("Látható Oks!")
        this.recaptcha=true
        this.recaptchaVerifier=this.recaptchaVerifierVisible
      },
      'expired-callback':()=>{
        console.log("Látható Hiba!")
        this.recaptcha=false
      }
    })
    console.log("this.recaptchaVerifier: ",this.recaptchaVerifier)
    console.log("this.recaptchaVerifierVisible: ",this.recaptchaVerifierVisible)
  }

  signInWithPhone(){
    console.log("this.recaptchaVerifier: ",this.recaptchaVerifier)
    if (this.recaptcha) this.auth.signInwithPhone(this.phoneNo,this.recaptchaVerifier)
    .then(
      ()=>{
        // this.codeWrite=true
        // kód
        this.codeVerifier()
      }
    ).catch(
      (res)=>console.log("SignIn", res)
    )
  }

  // codeVerifier(){
  //   this.auth.verificationCode(this.code).then(
  //     (res:any)=>{
  //       console.log("A kód stimmel!",res)
  //       this.code=""
  //     }
  //   ).catch(
  //     (error:any)=>{
  //       console.log("A kód HIBA!",error)
  //       this.recaptcha=false
  //       this.recaptchaVerifierVisible.render()
  //       this.code=""
  //     }
  //   )
  // }
  async codeVerifier(){
   const alert= await this.alertController.create({
    header: 'Enter Code',
    inputs:[
      {
        name:"code",
        type:"text",
        placeholder:"Enter your code "
      }
    ],
    buttons: [
      {text:'Enter',
      handler:(res) =>{
        this.auth.verificationCode(res.code)
        .then(()=>{console.log("OK!")})
        .catch(
          ()=>{
            this.recaptcha=false
            this.recaptchaVerifierVisible.render()
          }
        )
      }
    }
    ]
   })
    await alert.present()
  }



}
