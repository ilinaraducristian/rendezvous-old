

import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import MessageEvent from "./message-event";

@Injectable()
export class SseService {
  private readonly sse$ = new Subject<MessageEvent>();

  get sse() {
    return this.sse$.asObservable();
  }

  next(value: MessageEvent) {
    this.sse$.next(value);
  }

}
