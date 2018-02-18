//************************  Modules  ***************************
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleModalModule } from 'ngx-simple-modal';
//************************  Components  ***************************
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardItemComponent } from './dashboard/dashboard-item/dashboard-item.component';
import { EntryComponent } from './entry/entry.component';
import { PromptModalComponent } from './modals/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { LandingComponent } from './landing/landing.component';
//************************  Services  ***************************
import { StorageService } from './services/storage.service';
import { CalculatorService } from './services/calculator.service';
import { ModalService } from './services/modal.service';
import { ListenerService } from './services/listener.service';
//************************  Directives  ***************************
import { DropdownDirective } from './directives/dropdown.directive';
import { HintDropdownDirective } from './directives/hint-dropdown.directive';
import { DinamicHeightDirective } from './directives/dinamic-height.directive';

//************************  Routes  ***************************
const appRoutes: Routes = [
  {path: '', component: LandingComponent},
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
    DinamicHeightDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    SimpleModalModule
  ],
  entryComponents:[
    PromptModalComponent,
    ConfirmModalComponent
  ],
  providers: [
    StorageService,
    CalculatorService,
    ModalService,
    ListenerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
