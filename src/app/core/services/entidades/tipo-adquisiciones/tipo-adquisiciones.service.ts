import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { ITipoAdquisiciones } from 'src/app/core/models/itipo-adquisiciones';

@Injectable({
  providedIn: 'root'
})
export class TipoAdquisicionesService extends BaseGenericoService<ITipoAdquisiciones> {

  constructor() {
    super();
    this.init('Tipo_adquisiciones')
  }
}
