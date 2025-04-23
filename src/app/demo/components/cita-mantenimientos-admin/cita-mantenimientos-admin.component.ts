import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { ICitaMantenimientos } from 'src/app/core/models/icita-mantenimientos';
import { CitaMantenimientosService } from 'src/app/core/services/entidades/cita-mantenimientos/cita-mantenimientos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';

@Component({
  selector: 'app-cita-mantenimientos-admin',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './cita-mantenimientos-admin.component.html',
  styleUrl: './cita-mantenimientos-admin.component.scss'
})
export class CitaMantenimientosAdminComponent extends BaseMetodosCrud<ICitaMantenimientos>{
  constructor(protected override modeloService: CitaMantenimientosService){
    super(modeloService);
  }
}
