import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilesDetalleService {
  private apiUrl = environment.apiUrl;
  private perfil_detalleUrl = `${this.apiUrl}/perfil_detalle/`;


  constructor(private httpClient: HttpClient) { }

  perfilDetalles(): Observable<any> {
    return this.httpClient.get<any>(this.perfil_detalleUrl)
  }
}
