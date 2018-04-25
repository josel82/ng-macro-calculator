//************************  Modules  ***************************
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SimpleModalModule } from 'ngx-simple-modal';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { ChartsModule } from 'ng2-charts';
//************************  Components  ***************************
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardItemComponent } from './dashboard/dashboard-item/dashboard-item.component';
import { PromptModalComponent } from './modals/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { LandingComponent } from './landing/landing.component';
import { EntryComponent } from './entry/entry.component';
import { SpinnerComponent } from './spinner/spinner.component';
//************************  Services  ***************************
import { StorageService } from './services/storage.service';
import { CalculatorService } from './services/calculator.service';
import { ModalService } from './services/modal.service';
import { ListenerService } from './services/listener.service';
import { UnitConverterService } from './services/unit-converter.service';
import { BackendService } from './services/backend.service';
import { AuthService } from './auth/auth.service';
import { DataService } from './services/data.service';
//************************  Directives  ***************************
import { DropdownDirective } from './directives/dropdown.directive';
import { HintDropdownDirective } from './directives/hint-dropdown.directive';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MsgModalComponent } from './modals/msg-modal/msg-modal.component';
import { AuthGuard } from './services/auth-guard.service';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SpinnerService } from './services/spinner.service';
import { ChartComponent } from './entry/chart/chart.component';



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
    LoginComponent,
    SignupComponent,
    MsgModalComponent,
    SignupComponent,
    PageNotFoundComponent,
    SpinnerComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    SimpleModalModule,
    HttpClientModule,
    AsyncLocalStorageModule,
    AppRoutingModule,
    ChartsModule
  ],
  entryComponents:[
    PromptModalComponent,
    ConfirmModalComponent,
    MsgModalComponent
  ],
  providers: [
    StorageService,
    CalculatorService,
    ModalService,
    ListenerService,
    UnitConverterService,
    BackendService,
    AuthService,
    DataService,
    AuthGuard,
    SpinnerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
