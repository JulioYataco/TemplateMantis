import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/login/auth.service';

export const rolGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['rol']; // Obtén el rol requerido de la ruta
  const userRole = authService.getUserRole();

  console.log(`rol requerido: ${requiredRole}, Rol usuario: ${userRole}`);
  
  if (userRole === requiredRole) {
    return true; // Permite el acceso si el rol coincide
  }
  
  router.navigate(['/sedes']); // Redirige si el usuario no tiene el rol correcto
  return false;
};
