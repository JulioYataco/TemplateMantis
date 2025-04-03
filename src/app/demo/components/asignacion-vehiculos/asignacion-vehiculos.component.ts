import { Component, OnInit } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IAsignacionVehiculos } from 'src/app/core/models/iasignacion-vehiculos';
import { AsignacionVehiculosService } from 'src/app/core/services/entidades/asignacion-vehiculos/asignacion-vehiculos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { IVehiculos } from 'src/app/core/models/ivehiculos';
import { VehiculosService } from 'src/app/core/services/entidades/vehiculos/vehiculos.service';
import { PerfilesDetalleService } from 'src/app/core/services/perfiles/perfiles-detalle.service';
import { IPerfilDetalles } from 'src/app/core/models/iperfil-detalles';

@Component({
  selector: 'app-asignacion-vehiculos',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './asignacion-vehiculos.component.html',
  styleUrl: './asignacion-vehiculos.component.scss'
})
export class AsignacionVehiculosComponent extends BaseMetodosCrud<IAsignacionVehiculos>{
  
  vehiculos: IVehiculos[] = [];
  perfilDetalles: IPerfilDetalles[] = [];
  
  constructor(
    protected override modeloService: AsignacionVehiculosService,
    private vehiculoService: VehiculosService,
    private perfilDetalleService: PerfilesDetalleService
  ){
    super(modeloService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.obtenerVehiculo();
    this.obtenerPerfilesDetalle();
  }

  obtenerVehiculo(): void {
    this.vehiculoService.getAll().subscribe(data => {
      this.vehiculos = data.map(vehiculo => ({
        ...vehiculo,
        numero_placa: `N° Moto ${vehiculo.codigo }  -  ${ vehiculo.placa}`
      }));
    });
  }

  obtenerPlacaVehiculo(id_vehiculo: number): string {
    const data = this.vehiculos.find(r => r.id === id_vehiculo);
    return data ? `N° ${data.codigo} - ${data.placa}` : 'Desconocido';
  }

  obtenerPerfilesDetalle(): void {
    this.perfilDetalleService.perfilDetalles().subscribe(data => {
      this.perfilDetalles = data.map(perfil => ({
        ...perfil,
        full_name: `${perfil.first_name} ${perfil.last_name}`
      }));
    });
  }

  obtenerNombrePerfil(usuario_id: number): string {
    const data = this.perfilDetalles.find(r => r.usuario_id === usuario_id)
    return data ? `${data.first_name} ${data.last_name}` : 'Desconocido'
  }

}
