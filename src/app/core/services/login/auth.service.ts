import { HttpClient } from '@angular/common/http'; //Permite hacer peticiones http al backend
import { Injectable } from '@angular/core'; //Convierte la clase en un servicio inyectable
import { Router } from '@angular/router'; //Permite redireccionar a otras rutas dentro de angular
import { CookieService } from 'ngx-cookie-service'; //Se usa para manejar cookies en el navegador 
import { Observable, tap } from 'rxjs'; //Define operaciones asíncronas, como llamadas HTTP y tap: Permite ejecutar codigo adicional cuando se recibe la respuesta HTTP
import { environment } from 'src/environments/environment'; //Importamos para obtener la variable de entorno apiURL
import { jwtDecode } from "jwt-decode";
//import { json } from 'node:stream/consumers';
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private url = environment.apiUrl; //Guardamos la url base

  //Agregamos el endpoint a la url base y lo almacenamos en una constante
  private LOGIN_URL = `${this.url}/Login/`;           //Para login
  private REFRESH_URL = `${this.url}/token/refresh/`; //Para referscar token
  private LOGOUT_URL = `${this.url}/cerrarSesion/`;   //Para cerrar sesion

  usuario: {id: number, username: string, first_name: string, last_name: string, rol: string} | null = null;

  constructor(private httpClient: HttpClient, private router: Router, private cookieService: CookieService ) {
    this.cargarDatosUsuarioLocalStorage();
  }

  private cargarDatosUsuarioLocalStorage(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado); //Recupera los datos
    }
  }

  //Metodo para obtener el token desde la cookies
  getToken(): string | null {
    return this.cookieService.get("access_token");
  }

  getRefreshToken(): string | null {
    return this.cookieService.get("refresh_token");
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if(token){
      const decodedToken: any = jwtDecode(token);
      return decodedToken.rol;
    }
    return null;
  }

  //Guardamos el access token
  saveToken(token: string): void {
    const expiresminutes = new Date(new Date().getTime() + 15 * 60 * 1000);
    this.cookieService.set('access_token', token, expiresminutes);
  }

  //Metodo login
  login(username: string, password: string): Observable<any>{
    return this.httpClient.post<any>(this.LOGIN_URL, {username, password}).pipe(
      tap(response =>{
        console.log(response);
        if (response.access_token && response.refresh){
          //Agregamos los token a la cokies
          const expiresminute = new Date(new Date().getTime() + 15 * 60 * 1000);
          this.cookieService.set("access_token", response.access_token, expiresminute);
          this.cookieService.set("refresh_token", response.refresh, 7);
          
          //Guardar los datos del usuario
          this.usuario = {
            id: response.id,
            username: response.username,
            first_name: response.first_name,
            last_name: response.last_name,
            rol: response.rol
          };

          localStorage.setItem('usuario', JSON.stringify(this.usuario)); // Guardar en localStorage


          console.log("usuario autenticado");
        }else{
          console.log("error en login");
        }
      })
    );
  }

  getUserDetalle(): { id: number, username: string, first_name: string, last_name: string, rol: string } | null {
    return this.usuario;
  }

  //Metodo para refrescar token
  refreshToken(): Observable<any> {
    const refresh = this.getRefreshToken();
    return this.httpClient.post<any>(this.REFRESH_URL, { refresh: refresh }).pipe(
      tap(response => {
        console.log("Respuesta de refresh", response);
        if (response.access_token){
          this.saveToken(response.access_token);

          //Guardar los datos del usuario
          this.usuario = {
            id: response.id,
            username: response.username,
            first_name: response.first_name,
            last_name: response.last_name,
            rol: response.rol
          };

          localStorage.setItem('usuario', JSON.stringify(this.usuario)); // Actualizar localStorage

          console.log("Token actualizado en cookies", response);
        }
      })
    );
  }

  //Metodo para eliminar jwt tokens de la cookies
  private eliminarCookies(): void {
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
    window.location.href = '/login';
  }

  //Metodo para cerrar sesión
  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken){
      this.httpClient.post(this.LOGOUT_URL, { refresh_token: refreshToken}).subscribe(
        () => this.eliminarCookies(),
        () => this.eliminarCookies(), //Si hay un error, igual eliminamos cookies
        () => {
          this.usuario = null;
          localStorage.removeItem('usuario'); // Eliminar datos del usuario de localStorage
        }
      );
    } else {
      this.eliminarCookies();
      localStorage.removeItem('usuario'); // Eliminar datos del usuario de localStorage

    }
  }
}
