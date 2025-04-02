import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { IAreas } from 'src/app/core/models/iareas';

@Injectable({
  providedIn: 'root'
})
export class AreasService extends BaseGenericoService<IAreas>{

  constructor() { 
    super();
    this.init('areas')
  }
}
