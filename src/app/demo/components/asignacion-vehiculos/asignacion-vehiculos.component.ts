import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IAsignacionVehiculos } from 'src/app/core/models/iasignacion-vehiculos';
import { AsignacionVehiculosService } from 'src/app/core/services/entidades/asignacion-vehiculos/asignacion-vehiculos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';

@Component({
  selector: 'app-asignacion-vehiculos',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './asignacion-vehiculos.component.html',
  styleUrl: './asignacion-vehiculos.component.scss'
})
export class AsignacionVehiculosComponent extends BaseMetodosCrud<IAsignacionVehiculos>{
  constructor(protected override modeloService: AsignacionVehiculosService){
    super(modeloService);
  }
}
