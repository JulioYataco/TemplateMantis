import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/login/auth.service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Router } from '@angular/router';


let refreshInProgress = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);

  // Excluir la petición de login y token refresh
  const excluirUrls = ['/api/Login/', 'api/token/refresh/'];
  if (excluirUrls.some(url => req.url.includes(url))) {
    return next(req); //No tocamos ni el login ni el refresh
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
        //Si ya estamos en proceso de refersh, esperamos al resultado
        if (!refreshInProgress) {
          refreshInProgress = true;
          refreshTokenSubject.next(null); //Reiniciamos el subject
        
          return authService.refreshToken().pipe(
            switchMap((newToken) => {
              refreshInProgress = false;
              if (!newToken?.access) {
                throw new Error("No se recibió un nuevo token");
              }
              //console.log("nuevo token:", newToken);
              // Guardamos el nuevo token
              authService.saveToken(newToken.access);
              refreshTokenSubject.next(newToken.access); //Avisamos a los demás
              
              // Reintentamos la petición original con el nuevo token
              const newAuthReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken.access}` },
              });
              return next(newAuthReq);
            }),
              catchError((refreshError) => {
                //Si da error en el refrescar token, cerramos la sesion
              //console.error("Error en refresh token", refreshError);
              refreshInProgress = false;
              authService.logout(); 
              router.navigate(['/login']);
              // Si el refresh también falla, redirigimos al login
              //authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          // Si ya se está intentando refrescar el token, esperamos hasta que se complete
          return refreshTokenSubject.pipe(
            filter(token => token !== null), // Esperamos un token no nulo
            take(1), // Tomamos solo el primer valor
            switchMap((newToken) => {
              // Con el nuevo token, reintentamos la solicitud
              const newAuthReq = req.clone ({
                setHeaders: { Authorization: `Bearer ${newToken}`},
              });
              return next(newAuthReq);
            })
          );
        }
      }
      return throwError(() => error);  // Si el error no es 401, simplemente lo propagamos
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

