import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IVehiculos } from 'src/app/core/models/ivehiculos';
import { VehiculosService } from 'src/app/core/services/entidades/vehiculos/vehiculos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';

@Component({
  selector: 'app-vehiculos',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './vehiculos.component.html',
  styleUrl: '../../shared/base-crud/base-crud.component.scss'
})
export class VehiculosComponent extends BaseMetodosCrud<IVehiculos> {
  constructor(protected override modeloService: VehiculosService) {
    super(modeloService);
  }

}
