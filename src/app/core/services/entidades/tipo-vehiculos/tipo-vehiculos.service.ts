import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { ITipoVehiculos } from 'src/app/core/models/itipo-vehiculos';

@Injectable({
  providedIn: 'root'
})
export class TipoVehiculosService extends BaseGenericoService<ITipoVehiculos> {

  constructor() { 
    super();
    this.init('tipo_vehiculos')
  }
}
