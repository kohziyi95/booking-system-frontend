import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from './services/admin.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import {
//   NgxMatDatetimePickerModule,
//   NgxMatNativeDateModule,
//   NgxMatTimepickerModule
// } from '@angular-material-components/datetime-picker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatListModule } from '@angular/material/list';
import { MatCard, MatCardModule } from '@angular/material/card';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';

import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { AdminAddEventComponent } from './components/admin/admin-add-event/admin-add-event.component';
import { AdminViewEventComponent, BookingDialog } from './components/admin/admin-view-event/admin-view-event.component';
import { AdminEditEventComponent } from './components/admin/admin-edit-event/admin-edit-event.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { ViewBookingsComponent, RefundDialog } from './components/user/view-bookings/view-bookings.component';
import { CreditsComponent } from './components/user/credits/credits.component';
import { SuccessComponent } from './components/user/credits/success/success.component';
import { FailureComponent } from './components/user/credits/failure/failure.component';

const appRoutes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'admin/dashboard', component: AdminHomeComponent },
  { path: 'admin/event/add', component: AdminAddEventComponent },
  { path: 'admin/event/edit/:id', component: AdminEditEventComponent },
  { path: 'event/list', component: AdminViewEventComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'bookings', component: ViewBookingsComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'credits/success/:amount', component: SuccessComponent },
  { path: 'credits/failure', component: FailureComponent },
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' },
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminHomeComponent,
    AdminAddEventComponent,
    AdminViewEventComponent,
    AdminEditEventComponent,
    DashboardComponent,
    ViewBookingsComponent,
    CreditsComponent,
    SuccessComponent,
    FailureComponent,
    BookingDialog,
    RefundDialog,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    // NgxMatDatetimePickerModule,
    // NgxMatTimepickerModule,
    // NgxMatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatListModule,
    MatCardModule,
    MatDialogModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
