import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';
import { NetworkMessage } from '@shared/types/network/network-message.type';
import { NetworkConnection } from '@shared/types/network/network-connection.type';
import { NetworkFilter } from '@shared/types/network/network-filter.type';
import { NetworkFilterTypes } from '@shared/types/network/network-filter-types.enum';
import { NetworkMessagesDirection } from '@shared/types/network/network-messages-direction.enum';
import { environment } from '@environment/environment';


@Injectable({
  providedIn: 'root',
})
export class NetworkService {

  private readonly API: string = environment.debugger;

  constructor(private http: HttpClient) {}

  getNetworkMessages(limit: number, id: number | undefined, direction: NetworkMessagesDirection, activeFilters: NetworkFilter[], from: number | undefined, to: number | undefined): Observable<NetworkMessage[]> {
    let url = `${this.API}/messages?limit=${limit}&direction=${direction}`;

    if (id) {
      url += `&id=${id}`;
    }
    if (from) {
      url += `&timestamp=${from}`;
    }
    if (to) {
      url += `&limit_timestamp=${to}`;
    }
    Object.values(NetworkFilterTypes).forEach((filterType: string) => {
      if (activeFilters.some(f => f.type === filterType)) {
        url += `&${filterType}=` + activeFilters.filter(f => f.type === filterType).map(f => f.value).join(',');
      }
    })

    return this.http.get<any[]>(url)
      .pipe(map((messages: any[]) => this.mapNetworkMessageResponse(messages, direction)));
  }

  getNetworkFullMessage(messageId: number): Observable<any> {
    return this.http.request<any>(new HttpRequest<any>('GET', `${this.API}/message/` + messageId, { reportProgress: true, observe: 'events' }))
      .pipe(
        map((event: any) => {
          if (event.type === HttpEventType.DownloadProgress && event.total > 10485760) {
            throw new Error(event.total);
          } else if (event.type === HttpEventType.Response) {
            return event.body.message;
          }
        }),
        catchError((err: Error) => of(err.message)),
      );
  }

  getNetworkConnection(connectionId: number): Observable<NetworkConnection> {
    return this.http.get<any>(`${this.API}/connection/` + connectionId)
      .pipe(map(this.mapNetworkConnectionResponse));
  }

  getNetworkMessageHex(messageId: number): Observable<string> {
    return this.http.get<string>(`${this.API}/message_hex/` + messageId);
  }

  private mapNetworkMessageResponse(messages: any[], direction: NetworkMessagesDirection): NetworkMessage[] {
    if (direction === NetworkMessagesDirection.REVERSE) {
      messages = messages.reverse();
    }

    return messages.map(message => ({
      id: message[0],
      timestamp: toReadableDate((message[1].timestamp.secs_since_epoch * 1000) + message[1].timestamp.nanos_since_epoch / 1000000),
      incoming: message[1].incoming ? 'Incoming' : 'Outgoing',
      connectionId: message[1].connection_id,
      address: message[1].remote_addr,
      size: message[1].size,
      // streamId: {
      //   type: typeof message[1].stream_id === 'string'
      //     ? NetworkMessageStreamIdTypes.STRING
      //     : (message[1].stream_id.forward ? NetworkMessageStreamIdTypes.FORWARD : NetworkMessageStreamIdTypes.BACKWARD),
      //   value: typeof message[1].stream_id === 'string'
      //     ? message[1].stream_id
      //     : (message[1].stream_id.forward ?? message[1].stream_id.backward),
      // },
      streamKind: message[1].stream_kind,
      // streamType: typeof message[1].stream_id === 'string'
      //   ? NetworkMessageStreamType.NONE
      //   : (message[1].stream_id.forward !== undefined ? NetworkMessageStreamType.FORWARD : NetworkMessageStreamType.BACKWARD),
      messageKind: message[1].message[0]?.message?.type
        ?? message[1].message[0]?.type
        ?? message[1].message.type
        ?? message[1].message.action
        ?? message[1].message,
    } as NetworkMessage));
  }

  private mapNetworkConnectionResponse(connection: any): NetworkConnection {
    return {
      address: connection.info.addr,
      pid: connection.info.pid,
      fd: connection.info.fd,
      incoming: connection.incoming,
      timestamp: toReadableDate(connection.timestamp.secs_since_epoch * 1000),
    } as NetworkConnection;
  }
}
