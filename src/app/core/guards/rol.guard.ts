import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/login/auth.service';
import { of } from 'rxjs';

export const rolGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole: string[] = route.data['rol']; // Obtén el rol requerido de la ruta
  const userRole = authService.getUserRole();
  const token = authService.getToken();

  //console.log(`rol requerido: ${requiredRole}, Rol usuario: ${userRole}`);
  if (!token) {
    router.navigate(['/login']);
    return of(false);
  }


  if (userRole && requiredRole.includes(userRole)) {
    return of(true);  // Devuelve un Observable<boolean> // Permite el acceso si el rol coincide
  } else {
    const redirect = authService.getRedirectRouteByRole();
    if (state.url !== redirect) {
      router.navigate([redirect]);
    }
    return of(false);
  }
  
  // router.navigate(['/unauthorized']); // Redirige si el usuario no tiene el rol correcto
  // return of(false);
};
