import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IIncidencias } from 'src/app/core/models/iincidencias';
import { IncidenciasService } from 'src/app/core/services/entidades/incidencias/incidencias.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { IAsignacionPorPerfil } from 'src/app/core/models/iasignacion-por-perfil';
import { PerfilesDetalleService } from 'src/app/core/services/perfiles/perfiles-detalle.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({  
  selector: 'app-incidencias',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './incidencias.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class IncidenciasComponent extends BaseMetodosCrud<IIncidencias>{
  
  //Aqui asignaremos al id de vehiculo
  asginado: IAsignacionPorPerfil[] = [];
  vehiculoAsignado: IAsignacionPorPerfil | null = null;
  asignacionPerfilDetalles: IAsignacionPorPerfil[] = [];
  
  constructor(
    protected override modeloService: IncidenciasService,
    private perfilDetalleService: PerfilesDetalleService,
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService
  ){
    super(modeloService);
  }

  override entidad: IIncidencias = {
      id: 0,
      asignacion_vehiculo: 0,
      fecha_hora: null,
      incidencia: null,
      costo_reparacion: 0,
      solucion: null,
      observacion: null
    };

  override ngOnInit(): void {
    super.ngOnInit();
    this.obtenerDetallesasignado();
  }

  
  override getData(){
    this.cargando = true;
    const usuario = localStorage.getItem('usuario');
    //console.log("usuario", usuario);
    if (usuario) {
      const usuarioData = JSON.parse(usuario);
      //console.log("usuarioData", usuarioData);
      const perfilId = usuarioData.id;
      this.modeloService.listarDetalleIncidenciaPorPerfilId(perfilId).subscribe(
        (data) => {
          this.lista = data;
          this.cargando = false;
          //console.log("lista detallada", data)
        },
        (error) => {
          console.error('Error al cargar los datos', error);
          this.cargando = false;
        }
      )
    }
  }

  obtenerDetallesasignado(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioData = JSON.parse(usuario);
      const perfilId = usuarioData.id;

      //Llamamos al servidor con el perfilId
      this.perfilDetalleService.detallesasignacionperfil(perfilId).subscribe(
        (data) => {
          //console.log("data", data);
          this.vehiculoAsignado = data;
          this.asginado = [data];
          //console.log('Detalles de la asignación:', this.asginado);

          // Asignamos el ID de la asignación al modelo entidad
          this.entidad.asignacion_vehiculo = data.id; // Asignamos el valor de asignacion_vehiculo
          //console.log(this.entidad.asignacion_vehiculo);
        },
        (error) => {
          console.error('Error al obtener los detalles de asignación', error);
        }
      );
    }
  }
}
