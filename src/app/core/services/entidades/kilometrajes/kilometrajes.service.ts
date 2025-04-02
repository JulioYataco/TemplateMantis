import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { IKilometrajes } from 'src/app/core/models/ikilometrajes';

@Injectable({
  providedIn: 'root'
})
export class KilometrajesService extends BaseGenericoService<IKilometrajes>{

  constructor() { 
    super();
    this.init('kilometrajes')
  }
}
