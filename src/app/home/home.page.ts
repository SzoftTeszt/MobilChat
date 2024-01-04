import { Component } from '@angular/core';
import { BaseService } from '../base.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  newMessage:any
  messages:any
  constructor(private base:BaseService) {
    this.base.getMessages().snapshotChanges().pipe(
      map(
        (ch)=>ch.map(
          (c)=>({key:c.payload.key, ...c.payload.val()})
        )
      )
    )
    .subscribe(
      (res)=>this.messages=res
    )
  }

  addMessage(){
    if (this.newMessage){
      let time= new Date().toLocaleTimeString()
      let body={name:"Attila", time:time, message:this.newMessage}
      this.base.addMessage(body)
      this.newMessage=""
    }
  }

  deleteMessage(message:any){
    this.base.deleteMessage(message)
  }
  saveMessage(message:any){
    this.base.updateMessage(message)
  }
}
