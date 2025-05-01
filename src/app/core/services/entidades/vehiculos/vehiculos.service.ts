import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { IVehiculos } from 'src/app/core/models/ivehiculos';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService extends BaseGenericoService<IVehiculos>{

  private apiUrls = environment.apiUrl;
  private masivourl = `${this.apiUrls}/vehiculos_masivo/`;

  constructor(private http: HttpClient) {
    super();
    this.init('vehiculos')
  }

  registroMasivo(entidad: any[]) {
    return this.http.post<any[]>(`${this.masivourl}`, entidad);
  }

}
