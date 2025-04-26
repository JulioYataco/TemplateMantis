import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { IIncidencias } from 'src/app/core/models/iincidencias';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService extends BaseGenericoService<IIncidencias>{

  private apiURl= environment.apiUrl;
  private urlIncidenciaPorPerfil = `${this.apiURl}/incidencia_detallado_perfil`;

  constructor(private http: HttpClient) {
    super();
    this.init('incidencias')
  }

  listarDetalleIncidenciaPorPerfilId(perfilId: number): Observable<any[]> {
    const params = new HttpParams().set('perfil_id', perfilId.toString());
    return this.http.get<any[]>(this.urlIncidenciaPorPerfil, { params });
  }
}
