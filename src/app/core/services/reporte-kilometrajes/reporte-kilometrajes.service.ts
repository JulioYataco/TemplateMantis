import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../entidades/base-generico.service';
import { IReportekilometrajes } from '../../models/ireporte-kilometrajes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteKilometrajesService extends BaseGenericoService<IReportekilometrajes>{

  private apiUrls = environment.apiUrl;
  private reportefiltradourl = `${this.apiUrls}/reporte_kilometrajes_filtros`;
  

  constructor(private http: HttpClient) { 
    super();
    this.init('reporte_kilometrajes')
  }

  listarReporteKilometrajeFiltrado(observacion?: string, fecha_inicio?: string, fecha_fin?: string): Observable<IReportekilometrajes[]> {
    
    let params = new HttpParams();

    // Añadir filtros de fecha si existen
    if (fecha_inicio) {
      params = params.set('fecha_inicio', fecha_inicio);
    }
    if (fecha_fin) {
      params = params.set('fecha_fin', fecha_fin);
    }
    // Añadir el filtro de observación (es obligatorio)
    if (observacion) {
      params = params.set('observacion', observacion);
    }

    return this.http.get<IReportekilometrajes[]>(this.reportefiltradourl, { params })
  }
}
