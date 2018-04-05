import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BackendService {

  //private endPoint: string = "http://localhost:3000";
  private endPoint: string = "https://young-spire-16181.herokuapp.com";

  constructor(private http: HttpClient) { }


  postRequest(path, input, token:{key:string, value:string}|null):Observable<HttpResponse<any>> {
    const url = `${this.endPoint}${path}`;
    let headers = this.setHeader('Content-Type', 'application/json');
    if(token){
      headers = headers.append(token.key,token.value);
    }
    return this.http.post(url, input, {headers: headers, observe: 'response'});
  }

  patchRequest(path, input, token:{key:string, value:string}|null):Observable<any> {
    const url = `${this.endPoint}${path}`;
    let headers = this.setHeader('Content-Type', 'application/json');
    if(token){
      headers = headers.append(token.key,token.value);
    }
    return this.http.patch(url, input, {headers: headers, observe: 'response'});
  }

  deleteRequest(path, token:{key:string, value:string}|null, resType): Observable<any> {
    const url = `${this.endPoint}${path}`;
    let headers = this.setHeader('Content-Type', 'application/json');
    if(token){
       headers = headers.append(token.key, token.value);
    }
    return this.http.delete(url, {headers: headers, observe: 'response', responseType:resType});
  }

  getRequest(path,token:{key:string, value:string}|null): Observable<any>{
    const url = `${this.endPoint}${path}`;
    let headers = this.setHeader('Content-Type', 'application/json');
    if(token){
       headers = headers.append(token.key, token.value);
    }
    return this.http.get(url, {headers:headers});
  }

  setHeader(key: string, value:string){
    return new HttpHeaders().set(key,value);
  }

}
