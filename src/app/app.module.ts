//************************  Modules  ***************************
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { SimpleModalModule } from 'ngx-simple-modal';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
<<<<<<< HEAD
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
=======
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
//************************  Components  ***************************
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardItemComponent } from './dashboard/dashboard-item/dashboard-item.component';
import { PromptModalComponent } from './modals/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { LandingComponent } from './landing/landing.component';
import { EntryComponent } from './entry/entry.component';
import { EntryInputComponent } from './entry/entry-input/entry-input.component';
import { EntryOutputComponent } from './entry/entry-output/entry-output.component';
//************************  Services  ***************************
import { StorageService } from './services/storage.service';
import { CalculatorService } from './services/calculator.service';
import { ModalService } from './services/modal.service';
import { ListenerService } from './services/listener.service';
import { UnitConverterService } from './services/unit-converter.service';
import { ControlService } from './services/control.service';
import { BackendService } from './services/backend.service';
import { AuthService } from './auth/auth.service';
import { DataService } from './services/data.service';
//************************  Directives  ***************************
import { DropdownDirective } from './directives/dropdown.directive';
import { HintDropdownDirective } from './directives/hint-dropdown.directive';
import { DinamicHeightDirective } from './directives/dinamic-height.directive';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
<<<<<<< HEAD
import { MsgModalComponent } from './modals/msg-modal/msg-modal.component';
=======
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1

//************************  Routes  ***************************
const appRoutes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'calculator', component: EntryComponent},
  {path: 'calculator/:index', component: EntryComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    DashboardItemComponent,
    EntryComponent,
    DropdownDirective,
    HintDropdownDirective,
    PromptModalComponent,
    ConfirmModalComponent,
    LandingComponent,
    DinamicHeightDirective,
    EntryInputComponent,
    EntryOutputComponent,
    LoginComponent,
<<<<<<< HEAD
    SignupComponent,
    MsgModalComponent
=======
    SignupComponent
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    SimpleModalModule,
    HttpClientModule,
<<<<<<< HEAD
    AsyncLocalStorageModule,
    Ng4LoadingSpinnerModule
  ],
  entryComponents:[
    PromptModalComponent,
    ConfirmModalComponent,
    MsgModalComponent
=======
    AsyncLocalStorageModule
  ],
  entryComponents:[
    PromptModalComponent,
    ConfirmModalComponent
>>>>>>> 425c7abae2775646c8562beb52de8e41b56001c1
  ],
  providers: [
    StorageService,
    CalculatorService,
    ModalService,
    ListenerService,
    UnitConverterService,
    ControlService,
    BackendService,
    AuthService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
