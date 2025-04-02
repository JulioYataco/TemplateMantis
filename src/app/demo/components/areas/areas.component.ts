import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IAreas } from 'src/app/core/models/iareas';
import { AreasService } from 'src/app/core/services/entidades/areas/areas.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';

@Component({
  selector: 'app-areas',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './areas.component.html',
  styleUrl: './areas.component.scss'
})
export class AreasComponent extends BaseMetodosCrud<IAreas>{
  constructor(protected override modeloService: AreasService){
    super(modeloService);
  }
}
