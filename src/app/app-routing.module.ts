import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LandingComponent } from "./landing/landing.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./services/auth-guard.service";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EntryComponent } from "./entry/entry.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";




//************************  Routes  ***************************
const appRoutes: Routes = [
    {path: '', component: LandingComponent, pathMatch:'full'},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'dashboard', canActivate: [AuthGuard] , component: DashboardComponent},
    {path: 'calculator', component: EntryComponent},
    {path: 'calculator/:index',  canActivate: [AuthGuard] , component: EntryComponent},
    {path: 'not-found', component: PageNotFoundComponent},
    {path: '**', redirectTo: '/not-found'}
  ]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports:[RouterModule]
})
export class AppRoutingModule{}