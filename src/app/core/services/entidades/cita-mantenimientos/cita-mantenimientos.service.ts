import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { ICitaMantenimientos } from 'src/app/core/models/icita-mantenimientos';

@Injectable({
  providedIn: 'root'
})
export class CitaMantenimientosService extends BaseGenericoService<ICitaMantenimientos>{

  constructor() {
    super();
    this.init('cita_mantenimientos')
  }
}
