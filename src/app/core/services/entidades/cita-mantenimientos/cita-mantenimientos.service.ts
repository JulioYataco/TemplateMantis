import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { ICitaMantenimientos } from 'src/app/core/models/icita-mantenimientos';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CitaMantenimientosService extends BaseGenericoService<ICitaMantenimientos>{

  private apiURl= environment.apiUrl;
  private citacantidad = `${this.apiURl}/cantidad_citas_por_fecha`;

  constructor(private http: HttpClient) {
    super();
    this.init('cita_mantenimientos')
  }

  obtenerCantidadCitas(fecha: string): Observable<any> {
    const params = new HttpParams().set('fecha', fecha.toString());
    return this.http.get<any>(this.citacantidad, { params }); 
  }

}
