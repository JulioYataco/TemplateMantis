import { Component } from '@angular/core';
//import { IRoles } from 'src/app/core/models/iroles';
import { RolesService } from 'src/app/core/services/entidades/roles/roles.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
//import { MessageService } from 'primeng/api';
//import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { BaseCrudComponent } from '../../shared/base-crud/base-crud.component';
//import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-roles',
  imports: [SHARED_FORMULARIOS_IMPORTS, BaseCrudComponent],
  //providers: [ConfirmationService],
  templateUrl: './roles.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class RolesComponent {
  columns = [
    { field: 'id', header: 'Id' },
    { field: 'nombre_rol', header: 'Nombre rol' },
    { field: 'descripcion', header: 'Descripción' }
  ];

  formFields = [
    { field: 'nombre_rol', label: 'Nombre de Rol' },
    { field: 'descripcion', label: 'Descripción' }
  ];

  constructor(public rolesService: RolesService){
  }
}
