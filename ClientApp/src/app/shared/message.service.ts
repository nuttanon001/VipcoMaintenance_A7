import { Injectable } from "@angular/core";

@Injectable()
export class MessageService {
  messages: Array<string> = new Array;

  add(message: string): void {
    this.messages.push(message);
  }

  clear(): void {
    this.messages = new Array;
  }
}
