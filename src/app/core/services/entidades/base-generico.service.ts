import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../login/auth.service';

@Injectable({
  providedIn: 'root'
})
//Clase generica = Trabaja con cualquier tipo de datos

//Esto es una clase generica que podremos reutilizar en los servicios que manejan las mismas peticiones
export class BaseGenericoService<T> { //con T inidicamos que la clase es generica
  private httpClient = inject(HttpClient);
  private apiUrl: string; //para guardar la url
  private authService = inject(AuthService);

  init(rutaEntidad: string){
    this.apiUrl = `${environment.apiUrl}/${rutaEntidad}`;
    //console.log('API URL inicializada:', this.apiUrl);
  }

  private headers = new HttpHeaders({ //la clase httpHeaders permite definir encabezados
    'Content-Type': 'application/json' //Cuerpo de la solicitud en formato json
  });

  //Los observables son para manejar programación reactiva
  getAll(): Observable<T[]>{ //Este metodo retorna datos que emitira un arreglo de elementos de tipo T(al ser generico, cualquier tipo de dato que se define en los demas servicos)
    return this.httpClient.get<T[]>(this.apiUrl, {headers: this.headers});
  }

  getById(id: number): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}/${id}`);
  }

  create(data: Partial<T>): Observable<T> {
    //Obten el usuario autenticado
    const usuario = this.authService.getUserDetalle();
    if (usuario) {
      //Agregamos el id del usuario al objeto que se envia al backend
      data = { ...data, usuario_crea: usuario.id};
      //console.log('Data de create:',data);
    }
    return this.httpClient.post<T>(`${this.apiUrl}/`, data);
  }

  update(id: number, data: Partial<T>): Observable<T> {
    //Obten el usuario autenticado
    const usuario = this.authService.getUserDetalle();
    if (usuario) {
      //Agregamos el id del usuario al objeto que se envia al backend
      data = {...data, usuario_mod: usuario.id};
    }
    return this.httpClient.put<T>(`${this.apiUrl}/${id}/`, data);
  }

  delete(id: number): Observable<void> {
    const usuario = this.authService.getUserDetalle();
    if (usuario) {
      const data = {
        fecha_baja: new Date().toISOString(),
        usuario_baja: usuario.id
      };
      //console.log('datos eliminados:',data);
      return this.httpClient.patch<void>(`${this.apiUrl}/${id}/`, data); //Usamos el PATCH para actualizar solo 'usuario_baja'
    }
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}/`);
  }

}
