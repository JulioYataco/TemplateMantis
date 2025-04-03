import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IAreas } from 'src/app/core/models/iareas';
import { AreasService } from 'src/app/core/services/entidades/areas/areas.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { ISedes } from 'src/app/core/models/isedes';
import { SedesService } from 'src/app/core/services/entidades/sedes/sedes.service';
import { IPerfilDetalles } from 'src/app/core/models/iperfil-detalles';
import { PerfilesDetalleService } from 'src/app/core/services/perfiles/perfiles-detalle.service';

@Component({
  selector: 'app-areas',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss'
})
export class AreasComponent extends BaseMetodosCrud<IAreas>{
  
  sedes: ISedes[] = [];
  perfilDetalles: IPerfilDetalles[] = [];
  
  constructor(
    protected override modeloService: AreasService,
    private sedeService: SedesService,
    private perfilDetalleService: PerfilesDetalleService
    
  ){
    super(modeloService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.obtenerSedes();
    this.obtenerPerfilesDetalle();
  }

  obtenerSedes(): void {
    this.sedeService.getAll().subscribe(data => {
      this.sedes = data;
    });
  }

  obtenerPerfilesDetalle(): void {
    this.perfilDetalleService.perfilDetalles().subscribe(data => {
      this.perfilDetalles = data.map(perfil => ({
        ...perfil,
        full_name: `${perfil.first_name} ${perfil.last_name}`
      }));
    });
  }


}
