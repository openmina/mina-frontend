import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient) { }

  getResources(): Observable<any> {
    return this.http.get('https://master.dev.tezedge.com:8754/resources/tezedge');
  }
}
