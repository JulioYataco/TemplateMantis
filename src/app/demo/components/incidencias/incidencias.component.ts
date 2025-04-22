import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IIncidencias } from 'src/app/core/models/iincidencias';
import { IncidenciasService } from 'src/app/core/services/entidades/incidencias/incidencias.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';

@Component({
  selector: 'app-incidencias',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './incidencias.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class IncidenciasComponent extends BaseMetodosCrud<IIncidencias>{
  constructor(protected override modeloService: IncidenciasService){
    super(modeloService);
  }
}
