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
  recaptchaVerifierInisible:any
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
    if (this.recaptchaVerifierVisible) this.recaptchaVerifierVisible.clear();
    this.recaptchaVerifierVisible=null
  }

  ionViewDidEnter(){ 
    this.codeWrite=false
    this.recaptcha=true
    if (!this.recaptchaVerifierInisible) this.recaptchaVerifierInisible= new RecaptchaVerifier(
      getAuth(), 'recaptcha-container',
    {
      'size':'invisible',
      'callback': (response:any)=>{
        console.log("Láthatatlan Oks!")
        response(true)
      },
      'expired-callback':(res:any)=>{
        console.log("Láthatatlan Hiba!",res)
        this.recaptcha=false
      }
    })
   
    this.recaptchaVerifier=this.recaptchaVerifierInisible

    if (!this.recaptchaVerifierVisible) this.recaptchaVerifierVisible= new RecaptchaVerifier(
      getAuth(), 'recaptcha-container-visible',
    {
      'size':'normal',
      'callback': (response:any)=>{
        console.log("Látható Oks!")
        this.recaptcha=true
        this.recaptchaVerifier=this.recaptchaVerifierVisible
        response(response)
      },
      'expired-callback':(res:any)=>{
        console.log("Látható Hiba!",res)
        this.recaptcha=false
      }
    })   
   
  }

  signInWithPhone(){   
    if (this.recaptcha) this.auth.signInwithPhone(this.phoneNo,this.recaptchaVerifier)
    .then(
      (res:any)=>{
        // this.codeWrite=true
        this.codeVerifier()
      }
    ).catch(
      (res)=>console.log("SignIn(Hiba)", res)
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
        .then(()=>{console.log("OKÉ!")})
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
