import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SucursalDetailComponent } from './sucursal-detail/sucursal-detail.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'sucursales/:id', component: SucursalDetailComponent },
  { path: '**', redirectTo: '' },
];
