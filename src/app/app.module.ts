import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleModalModule } from 'ngx-simple-modal';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardItemComponent } from './dashboard/dashboard-item/dashboard-item.component';
import { EntryComponent } from './entry/entry.component';
import { StorageService } from './services/storage.service';
import { CalculatorService } from './services/calculator.service';
import { DropdownDirective } from './directives/dropdown.directive';
import { ModalService } from './services/modal.service';
import { HintDropdownDirective } from './directives/hint-dropdown.directive';
import { ModalDirective } from './directives/modal.directive';
import { PromptModalComponent } from './modals/prompt-modal/prompt-modal.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { LandingComponent } from './landing/landing.component';

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
    ModalDirective,
    PromptModalComponent,
    ConfirmModalComponent,
    LandingComponent
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
    ModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
