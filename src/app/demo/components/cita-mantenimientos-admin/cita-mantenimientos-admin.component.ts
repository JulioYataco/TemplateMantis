import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { ICitaMantenimientos } from 'src/app/core/models/icita-mantenimientos';
import { CitaMantenimientosService } from 'src/app/core/services/entidades/cita-mantenimientos/cita-mantenimientos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { TagModule } from 'primeng/tag';
import { IAsignacionPorPerfil } from 'src/app/core/models/iasignacion-por-perfil';
import { PerfilesDetalleService } from 'src/app/core/services/perfiles/perfiles-detalle.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-cita-mantenimientos-admin',
  imports: [SHARED_FORMULARIOS_IMPORTS, TagModule],
  templateUrl: './cita-mantenimientos-admin.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class CitaMantenimientosAdminComponent extends BaseMetodosCrud<ICitaMantenimientos>{
  
  asginado: IAsignacionPorPerfil[] = [];
  vehiculoAsignado: IAsignacionPorPerfil | null = null;

  constructor(
    protected override modeloService: CitaMantenimientosService,
    private perfilDetalleService: PerfilesDetalleService,
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService
  ){
    super(modeloService);
  }

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
      this.modeloService.listarPorPerfilId(perfilId).subscribe(
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


  marcarComoAsistio(entidad: ICitaMantenimientos) {
    const entidadActualizada: Partial<ICitaMantenimientos> = {
      ...entidad,
      situacion_actual: 'asistio'
    };

    this.confirmationService.confirm({
      message: '¿Estas seguro de confirmar asistencia?',
      header: 'Confirmación de estado',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.modeloService.update((this.entidad as any).id, this.entidad).subscribe({
          next: () => {
            this.modeloService.update(entidad.id, entidadActualizada).subscribe({
              next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Situación actual actualizada a "asistió"' });
                this.getData(); // refresca la tabla
              },
              error: err => {
                console.error('Error al actualizar:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la situación actual.' });
              }
            });
          },
          error: err => console.error('Error al actualizar:', err)
        });
      }
    });
    
  }

  getColorEstado(situacion: string): 'success' | 'danger' | 'warn' | 'info' {
    switch (situacion) {
      case 'asistio':
        return 'success';
      case 'cancelado':
        return 'danger';
      case 'pendiente':
        return 'warn';
      default:
        return 'info';
    }
  }
}
