import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IIncidencias } from 'src/app/core/models/iincidencias';
import { IncidenciasService } from 'src/app/core/services/entidades/incidencias/incidencias.service';

@Component({
  selector: 'app-incidencias',
  imports: [],
  templateUrl: './incidencias.component.html',
  styleUrl: './incidencias.component.scss'
})
export class IncidenciasComponent extends BaseMetodosCrud<IIncidencias>{
  constructor(protected override modeloService: IncidenciasService){
    super(modeloService);
  }
}
