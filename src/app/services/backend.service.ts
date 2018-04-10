import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { default as config } from './.backend.config';

@Injectable()
export class BackendService {

  private isProd: boolean = true;
  private apiUrl: string = this.isProd ? config['prod']: config['local'];

  constructor(private http: HttpClient) { }

  getUrl():string{
    return this.apiUrl;
  }

  
  loginUser(url, user):Observable<HttpResponse<any>>{
    const headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(url, user, {headers: headers, observe: 'response'});
  }

  signUpUser(url, user):Observable<HttpResponse<any>>{
    const headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(url, user, {headers: headers, observe: 'response'});
  }

  logoutUser(url, token, resType):Observable<any>{
    const headers = new HttpHeaders().set('x-auth',token);
    return this.http.delete(url, {headers: headers, observe: 'response', responseType:resType});
  }

  isAuthenticated(url, token:string): Observable<any>{
    const headers = new HttpHeaders().set('x-auth',token);
    return this.http.get(url, {headers:headers});
  }

  saveEntry(url, entry, token:string):Observable<HttpResponse<any>>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    if(token){
      headers = headers.append('x-auth',token);
    }
    return this.http.post(url, entry, {headers: headers, observe: 'response'});
  }

  editEntry(url, entry, token:string):Observable<HttpResponse<any>>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    if(token){
      headers = headers.append('x-auth',token);
    }
    return this.http.patch(url, entry, {headers: headers, observe: 'response'});
  }

  deleteEntry(url, token:string, resType):Observable<HttpResponse<any>>{
    const headers = new HttpHeaders().set('x-auth',token);
    return this.http.delete(url, {headers: headers, observe: 'response', responseType:resType});
  }

  getEntries(url, token):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    if(token){
       headers = headers.append('x-auth', token);
    }
    return this.http.get(url, {headers:headers});
  }



}



 

