import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { WebNodeService } from '@web-node/web-node.service';
import { from } from 'rxjs';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';

@Injectable({
  providedIn: 'root',
})
export class WebNodePeersService {

  private listener: any;
  private dialer: any;
  private offer: any;
  private peerId: string;

  constructor(private webNodeService: WebNodeService) { }

  getPeers(): Observable<WebNodeLog[]> {
    return this.webNodeService.peers$;
  }

  getDialerOffer(peerId: string): Observable<any> {
    return this.webNodeService.getDialer(peerId).pipe(
      tap((dialer: any) => this.dialer = dialer),
      tap((dialer: any) => this.offer = dialer.offer()),
      map(() => this.offer),
    );
  }

  getPeerId(): Observable<any> {
    return this.webNodeService.getListener().pipe(
      tap((listener: any) => this.listener = listener),
      tap((listener: any) => this.peerId = listener.peer_id()),
      map(() => this.peerId),
    );
  }

  getAnswer(offer: any): Observable<any> {
    return from(this.listener.set_offer_and_generate_answer(offer));
  }

  finishListener(): Observable<any> {
    return of(this.listener.finish());
  }

  finishDialer(peerId: string, answer: any): Observable<any> {
    return of(this.dialer.finish(answer));
  }

  isPeerIdValid(peerId: string): Observable<string | null> {
    return of(this.webNodeService.isPeerIdValid(peerId));
  }
}
