

import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";

@Injectable()
export class SseService {
  private readonly sse$ = new Subject<any>();

  get sse() {
    return this.sse$.asObservable();
  }

  next(value: any) {
    this.sse$.next(value);
  }

}
