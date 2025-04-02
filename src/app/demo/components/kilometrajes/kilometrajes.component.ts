import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IKilometrajes } from 'src/app/core/models/ikilometrajes';
import { KilometrajesService } from 'src/app/core/services/entidades/kilometrajes/kilometrajes.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';

@Component({
  selector: 'app-kilometrajes',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './kilometrajes.component.html',
  styleUrl: './kilometrajes.component.scss'
})
export class KilometrajesComponent extends BaseMetodosCrud<IKilometrajes> {
  constructor(protected override modeloService: KilometrajesService){
    super(modeloService);
  }
}
