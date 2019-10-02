import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn:"root"
})
export class MessageService {
  subject = new Subject<Array<string>>();
  error_messages: Array<string> = new Array;

  add(message: string): void {
    //debug here
    // console.log("MessageService add", JSON.stringify(message));

    this.error_messages.push(message);
    this.subject.next(this.error_messages);
  }

  get messages(): Observable<string[]> {
    return this.subject.asObservable();
  }

  clear(): void {
    this.error_messages = new Array;
  }
}
