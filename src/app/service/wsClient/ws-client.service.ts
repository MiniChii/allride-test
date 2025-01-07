import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WsClientService {
  private socket: Socket;

  constructor() {
    const url = 'https://stage.allrideapp.com/tech_interview';

    const opt = {
      //path: '/tech_interview',
      query: { room: 'MiniChii' },
      //addTrailingSlash: false,
      forceNew: true,
    };

    this.socket = io(url, opt);
  }

  sendCoordenates(payload: any): void {
    const event = 'newLocation';
    console.log(
      'sendCoordenates',
      payload,
      this.socket.hasListeners('newLocation')
    );
    this.socket.emit(event, payload);
  }

  getCoordenates(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('newLocation', (data) => {
        console.log('getCoordenates', data);
        observer.next(data);
      });

      return () => {
        this.socket.off('message');
      };
    });
  }
}
