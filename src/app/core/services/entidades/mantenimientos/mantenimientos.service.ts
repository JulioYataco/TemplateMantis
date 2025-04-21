import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { IMantenimientos } from 'src/app/core/models/imantenimientos';

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService extends BaseGenericoService<IMantenimientos>{

  constructor() {
    super();
    this.init('Mantenimientos');  
  }
}
