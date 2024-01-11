import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSub= new Subject()
  confirmationRes :any
  constructor(private fireAuth:AngularFireAuth, private router:Router) {
    this.fireAuth.onAuthStateChanged(
      (user)=>{
        this.userSub.next(user)
        console.log("User:", user)
      }
    )
   }
  getUser(){
    return this.userSub;
  }
  logout(){
    this.fireAuth.signOut().then(
      ()=> this.router.navigate(['/sign-in'])
    )
  }

  signInwithPhone(phoneNo:any, verifier:any){
    return new Promise<any>(
      (resolve, reject)=>{
    this.fireAuth.signInWithPhoneNumber(phoneNo,verifier).then(
      (confirmationRes)=>{
        this.confirmationRes=confirmationRes
        resolve(confirmationRes)
      }
    ).catch(
      ()=> {
        console.log("SMS not send!")
        reject("SMS not send!")
      }
    )

  })
  }

  verificationCode(code:any){

    return this.confirmationRes.confirm(code)

  }


}
