import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/login/auth.service';
import { inject } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();

  if(token){
    console.log("guards token activo:", token);
    return of(true); // Devuelve un Observable<boolean>
  }

  return authService.refreshToken().pipe(
    switchMap(newToken => {
      if (newToken?.access) {
        authService.saveToken(newToken.access);
        return of(true);
      } else {
        router.navigate(['/login']);
        return of(false);
      }
    }),
    catchError(()=>{
      router.navigate(['/login']);
      return of(false);
    })
  )
};
