import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonLoaderService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  public getJsonFromUrl(url: string): Observable<any> {
    return this.httpClient.get(url);
  }


}
