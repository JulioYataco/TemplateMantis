import { CalendarModule } from 'primeng/calendar';
import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { ICitaMantenimientos } from 'src/app/core/models/icita-mantenimientos';
import { CitaMantenimientosService } from 'src/app/core/services/entidades/cita-mantenimientos/cita-mantenimientos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';

@Component({
  selector: 'app-cita-mantenimientos',
  imports: [SHARED_FORMULARIOS_IMPORTS, CalendarModule],
  templateUrl: './cita-mantenimientos.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class CitaMantenimientosComponent extends BaseMetodosCrud<ICitaMantenimientos>{
  
  fechaseleccinada: Date | null = null;
  dialogoVisible: boolean = false;
  cuposDisponibles: number= 0;
  fechasOcupadas: Date[] = []; 

  constructor(protected override  modeloService: CitaMantenimientosService){
    super(modeloService);
  }
}
