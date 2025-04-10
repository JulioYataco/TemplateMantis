import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/login/auth.service';
import { of } from 'rxjs';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token){
    router.navigate(['/kilometrajes']);
    return of(false); //Bloquea el acceso al login si ya hay token
  }else {
    return of(true); //Permite el acceso al login
  }
};
