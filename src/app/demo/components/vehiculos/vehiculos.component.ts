import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IVehiculos } from 'src/app/core/models/ivehiculos';
import { VehiculosService } from 'src/app/core/services/entidades/vehiculos/vehiculos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { TipoVehiculosService } from 'src/app/core/services/entidades/tipo-vehiculos/tipo-vehiculos.service';
import { ITipoVehiculos } from 'src/app/core/models/itipo-vehiculos';

@Component({
  selector: 'app-vehiculos',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './vehiculos.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class VehiculosComponent extends BaseMetodosCrud<IVehiculos> {
  
  tipovehiculos: ITipoVehiculos[] = []
  listaTipos = [
    { observacion: 'Alquilada', nombre: 'Alquilada' },
    { observacion: 'Beta', nombre: 'Beta' }
  ];

  constructor(
    protected override modeloService: VehiculosService,
    private tipoVehiculoService: TipoVehiculosService
  ) {
    super(modeloService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.obtenerTipoVehiculos();
  }

  obtenerTipoVehiculos(): void {
    this.tipoVehiculoService.getAll().subscribe(tipovehiculo => {
      this.tipovehiculos = tipovehiculo;
    });
  }

  obtenerNombreTipoVehiculo(idtipo_vehiculo: number): string {
    const tipovehiculo = this.tipovehiculos.find(l => l.id === idtipo_vehiculo);
    return tipovehiculo ? tipovehiculo.nombre_tipo_vehiculo : 'Desconocido';
  }

}
