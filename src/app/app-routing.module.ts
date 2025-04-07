// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
//import { GuestLayoutComponent } from './theme/layouts/guest-layout/guest-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';
import { rolGuard } from './core/guards/rol.guard';
//import { AuthGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'sedes',
        loadComponent: () => import('./demo/components/sedes/sedes.component').then((c) => c.SedesComponent),
        canActivate: [authGuard, rolGuard],
        data: {rol: 'Administrador'},
      },
      {
        path: 'roles',
        loadComponent: () => import('./demo/components/roles/roles.component').then((c) => c.RolesComponent),
        canActivate: [authGuard, rolGuard],
        data: {rol: 'Administrador'},
      },
      {
        path: 'vehiculos',
        loadComponent: () => import('./demo/components/vehiculos/vehiculos.component').then((c) => c.VehiculosComponent),
        canActivate: [authGuard, rolGuard],
        data: {rol: 'Administrador'},
      },
      {
        path: 'tipo-vehiculos',
        loadComponent: () => import('./demo/components/tipo-vehiculos/tipo-vehiculos.component').then((c) => c.TiposVehiculosComponent),
        canActivate: [authGuard, rolGuard],
        data: {rol: 'Administrador'},
      },
      {
        path: 'kilometrajes',
        loadComponent: () => import('./demo/components/kilometrajes/kilometrajes.component').then((c) => c.KilometrajesComponent),
        canActivate: [authGuard, rolGuard],
        data: {rol: ['Administrador', 'Conductor']},
      },
      {
        path: 'asignacion-vehiculos',
        loadComponent: () => import('./demo/components/asignacion-vehiculos/asignacion-vehiculos.component').then((c) => c.AsignacionVehiculosComponent),
        canActivate: [authGuard, rolGuard],
        data: {rol: 'Administrador'},
      },
      {
        path: 'areas',
        loadComponent: () => import('./demo/components/areas/areas.component').then((c) => c.AreasComponent),
        canActivate: [authGuard, rolGuard],
        data: {rol: 'Administrador'},
      },
      {
        path: 'reporte-kilometrajes',
        loadComponent: () => import('./demo/components/reporte-kilometrajes/reporte-kilometrajes.component').then((c) => c.ReporteKilometrajesComponent),
        canActivate: [authGuard, rolGuard],
        data: {rol: 'Administrador'},
      },
    ]
  },
  {
    path: 'login',
    loadComponent: ()=> import('./demo/components/auth/login/login.component'),
    canActivate: [authenticatedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}