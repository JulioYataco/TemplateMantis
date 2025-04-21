import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { IIncidencias } from 'src/app/core/models/iincidencias';

@Injectable({
  providedIn: 'root'
})
export class IncidenciasService extends BaseGenericoService<IIncidencias>{

  constructor() {
    super();
    this.init('Incidencias')
  }
}
