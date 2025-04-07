import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilesDetalleService {
  private apiUrl = environment.apiUrl;
  private perfil_detalleUrl = `${this.apiUrl}/perfil_detalle/`;
  private asignacion_perfil_detalleUrl = `${this.apiUrl}/obtener_asignacion_vehiculo_por_perfil/`;


  constructor(private httpClient: HttpClient) { }

  perfilDetalles(): Observable<any> {
    return this.httpClient.get<any>(this.perfil_detalleUrl)
  }

  detallesasignacionperfil(perfilId: number): Observable<any> {
    const params = new HttpParams().set('perfil_id', perfilId.toString());
    return this.httpClient.get<any>(this.asignacion_perfil_detalleUrl, { params });
  }

}
