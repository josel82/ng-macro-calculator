import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router){}
    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot): Observable<boolean>| Promise<boolean>|boolean{
        return this.auth.getCredentials().then((credentials)=>{
                    if(credentials){
                        return true;
                    }else{
                        this.router.navigate(['/']);
                    }
                });
    }

}