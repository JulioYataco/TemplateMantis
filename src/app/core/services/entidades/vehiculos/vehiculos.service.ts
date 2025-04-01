import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { IVehiculos } from 'src/app/core/models/ivehiculos';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService extends BaseGenericoService<IVehiculos>{

  constructor() {
    super();
    this.init('vehiculos')
  }
}
