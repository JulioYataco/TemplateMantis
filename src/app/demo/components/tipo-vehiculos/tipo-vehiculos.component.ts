import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { ITipoVehiculos } from 'src/app/core/models/itipo-vehiculos';
import { TipoVehiculosService } from 'src/app/core/services/entidades/tipo-vehiculos/tipo-vehiculos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-tipos-vehiculos',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './tipo-vehiculos.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class TiposVehiculosComponent extends BaseMetodosCrud<ITipoVehiculos> implements AfterViewInit{
  @ViewChild('dt') override dt!: Table;
  
  constructor(protected override modeloService: TipoVehiculosService){
    super(modeloService);
  }

  ngAfterViewInit() {
    //('ViewChild dt:', this.dt);
    if (!this.dt) {
      console.error("Error: No se encontró la referencia 'dt'");
    }
  }

  exxportCSV() {
    if (this.dt && this.dt.exportCSV) {
      this.dt.exportCSV();
    } else {
      console.error('dt no está disponible o exportCSV no está definido');
    }
  }
  
}
