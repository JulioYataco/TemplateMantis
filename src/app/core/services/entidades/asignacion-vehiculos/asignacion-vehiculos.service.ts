import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { IAsignacionVehiculos } from 'src/app/core/models/iasignacion-vehiculos';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsignacionVehiculosService extends BaseGenericoService<IAsignacionVehiculos>{

  private apiUrls = environment.apiUrl;
  private masivourl = `${this.apiUrls}/asignacion_vehiculos_masivo/`;

  constructor(private http: HttpClient) { 
    super();
    this.init('asignacion_vehiculos')
  }

  registroMasivo(entidad: any[]) {
    return this.http.post<any[]>(`${this.masivourl}`, entidad);
  }
}
