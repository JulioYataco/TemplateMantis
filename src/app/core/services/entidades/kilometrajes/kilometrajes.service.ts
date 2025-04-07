import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { IKilometrajes } from 'src/app/core/models/ikilometrajes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IReportekilometrajes } from 'src/app/core/models/ireporte-kilometrajes';

@Injectable({
  providedIn: 'root'
})
export class KilometrajesService extends BaseGenericoService<IKilometrajes>{


  private apiUrls = environment.apiUrl;
  private lecturaurl = `${this.apiUrls}/reporte_kilometrajes_perfil`;

  constructor(private http: HttpClient) { 
    super();
    this.init('kilometrajes');
  }

  listarPorPerfilId(perfilId: number): Observable<IReportekilometrajes[]> {
    const params = new HttpParams().set('perfil_id', perfilId.toString());
    return this.http.get<IReportekilometrajes[]>(this.lecturaurl, { params });
  }
}
