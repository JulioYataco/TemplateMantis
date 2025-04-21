import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { ITipoMantenimientos } from 'src/app/core/models/itipo-mantenimientos';

@Injectable({
  providedIn: 'root'
})
export class TipoMantenimientosService extends BaseGenericoService<ITipoMantenimientos>{

  constructor() { 
    super();
  this.init('tipo_mantenimientos')
    
  }
}
