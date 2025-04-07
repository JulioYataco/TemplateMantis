import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../entidades/base-generico.service';
import { IReportekilometrajes } from '../../models/ireporte-kilometrajes';

@Injectable({
  providedIn: 'root'
})
export class ReporteKilometrajesService extends BaseGenericoService<IReportekilometrajes>{

  constructor() { 
    super();
    this.init('reporte_kilometrajes')
  }
}
