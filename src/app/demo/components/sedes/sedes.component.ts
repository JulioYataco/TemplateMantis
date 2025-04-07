import { Component } from '@angular/core';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { SedesService } from 'src/app/core/services/entidades/sedes/sedes.service';
// import { BaseCrudComponent } from '../../shared/base-crud/base-crud.component';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { ISedes } from 'src/app/core/models/isedes';
import { UbigeosService } from 'src/app/core/services/entidades/ubigeos/ubigeos.service';
import { IUbigeos } from 'src/app/core/models/iubigeos';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-sedes',
  //standalone: true,
  imports: [SHARED_FORMULARIOS_IMPORTS, ProgressSpinnerModule],
  templateUrl: './sedes.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class SedesComponent extends BaseMetodosCrud<ISedes>{
  
  ubigeos: IUbigeos[] = [];
  loadingUbigeo: boolean = false;

  constructor(
    protected override modeloService: SedesService,
    private ubigeoService: UbigeosService
  ){
    super(modeloService);
    this.obtenerUbigeos();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.obtenerUbigeos();
  }

  obtenerUbigeos(): void {
    this.loadingUbigeo = true;

    this.ubigeoService.getAll().subscribe({
      next: (ubigeos) => {
        this.ubigeos = ubigeos.map(ubigeo => ({
          ...ubigeo,
          ubigeocompleto: `${ubigeo.dpto} - ${ubigeo.prov} - ${ubigeo.distrito}`
        }));
        this.loadingUbigeo = false;
      },
      error: (err) => {
        console.error('Error cargando ubigeos', err);
        this.loadingUbigeo = false;
      }
    });
  }

  obtenerNombreUbigeo(id: number): string {
    const ubigeo = this.ubigeos.find(l => l.ubigeo === id);
    return ubigeo ? `${ubigeo.dpto} - ${ubigeo.prov} - ${ubigeo.distrito}`  : 'Desconocido';
  }

}
