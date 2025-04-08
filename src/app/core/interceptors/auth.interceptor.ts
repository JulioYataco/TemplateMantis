import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/login/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);
  //console.log("antes de ifinterceptor:", token);
  // Excluir la petición de login
  if (req.url.includes('/api/Login/') || req.url.includes('/api/token/refresh')) {
    return next(req);
  }
  
  let authReq = req;
  if (token) {
    //console.log("token en interceptor:", token);
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}`},
    });
  }
  
  return next(authReq).pipe(
    catchError((error) => {
      //console.log("error en interceptor", error);
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            if (!newToken?.access) {
              throw new Error("No se recibió un nuevo token");
            }
            //console.log("nuevo token:", newToken);
            // Guardamos el nuevo token
            authService.saveToken(newToken.access);
            // Reintentamos la petición original con el nuevo token
            const newAuthReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken.access}` },
            });
            return next(newAuthReq);
          }),
          catchError((refreshError) => {
            //console.error("Error en refresh token", refreshError);
            authService.logout(); 
            router.navigate(['/login']);
            // Si el refresh también falla, redirigimos al login
            //authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
  //       return authService.refreshToken().pipe(
  //         switchMap((newToken) => {
  //           authService.setCookie(newToken);
  //           const newAuthReq = req.clone({
  //             setHeaders: { Authorization: `Bearer ${newToken}`},
  //           });
  //           return next(newAuthReq);
  //         }),
  //         catchError((refreshError) => {
  //           authService.deleteCookies();
  //           return throwError(() => refreshError);
  //         })
  //       );
  //     }
  //     return throwError(() => error)
  //   })

  // );
  // return next(req);


  // if (token) {
  //   console.log("token en interceptor", token);
  //   const requests = req.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  //   return next(requests).pipe(
  //     catchError(err =>{
  //       if (err.status === 401) {
  //         return authService.refreshToken().pipe(
  //           switchMap(() => next(request))
  //         );
  //       }
  //       return throwError(() => err);
  //     })
  //   );
  // }

  // return next(requests);

