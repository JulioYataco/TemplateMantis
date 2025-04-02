import { Component } from '@angular/core';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { SedesService } from 'src/app/core/services/entidades/sedes/sedes.service';
// import { BaseCrudComponent } from '../../shared/base-crud/base-crud.component';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { ISedes } from 'src/app/core/models/isedes';
import { UbigeosService } from 'src/app/core/services/entidades/ubigeos/ubigeos.service';
import { IUbigeos } from 'src/app/core/models/iubigeos';
//import { ISedes } from 'src/app/core/models/isedes';
//import { MessageService } from 'primeng/api';
//import { Table } from 'primeng/table';
//import { BaseCrudComponent } from '../../shared/base-crud/base-crud.component';
//import { BaseMetodosCrud } from '../baseMetodosCrud.component';
//import { BaseMetodosCrud } from '../baseMetodosCrud.component';
@Component({
  selector: 'app-sedes',
  //standalone: true,
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './sedes.component.html',
 styleUrl: '../../shared/base-crud/base-crud.component.scss'
})
export class SedesComponent extends BaseMetodosCrud<ISedes>{
  
  ubigeos: IUbigeos[] = []

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
    this.ubigeoService.getAll().subscribe(ubigeos => {
      this.ubigeos = ubigeos.map(ubigeo => ({
        ...ubigeo,
        ubigeocompleto: `${ubigeo.dpto} - ${ubigeo.prov} - ${ubigeo.distrito}`
      }));
      //console.log('Ubigeos completo:', this.ubigeos);

    });
  }

  obtenerNombreUbigeo(id: number): string {
    const ubigeo = this.ubigeos.find(l => l.ubigeo === id);
    return ubigeo ? `${ubigeo.dpto} - ${ubigeo.prov} - ${ubigeo.distrito}`  : 'Desconocido';
  }

}
