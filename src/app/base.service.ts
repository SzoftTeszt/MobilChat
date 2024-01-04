import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  messages:AngularFireList<any>

  constructor(private db:AngularFireDatabase) {
    this.messages=this.db.list('/messages')
   }

   getMessages(){
    return this.messages
   }

   addMessage(body:any){
    console.log("messages:", body)
    this.messages.push(body)
   }

   updateMessage(body:any){
    this.messages.update(body.key,body)
   }

   deleteMessage(body:any){
    this.messages.remove(body.key)
   }
}
