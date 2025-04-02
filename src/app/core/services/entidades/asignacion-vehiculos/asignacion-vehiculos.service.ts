import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { IAsignacionVehiculos } from 'src/app/core/models/iasignacion-vehiculos';

@Injectable({
  providedIn: 'root'
})
export class AsignacionVehiculosService extends BaseGenericoService<IAsignacionVehiculos>{

  constructor() { 
    super();
    this.init('asignacion_vehiculos')
  }
}
