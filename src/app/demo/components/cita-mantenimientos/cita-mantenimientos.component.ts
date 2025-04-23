import { CalendarModule } from 'primeng/calendar';
import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { ICitaMantenimientos } from 'src/app/core/models/icita-mantenimientos';
import { CitaMantenimientosService } from 'src/app/core/services/entidades/cita-mantenimientos/cita-mantenimientos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { DividerModule } from 'primeng/divider';
import { PerfilesDetalleService } from 'src/app/core/services/perfiles/perfiles-detalle.service';
import { IAsignacionPorPerfil } from 'src/app/core/models/iasignacion-por-perfil';
import { formatDate } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-cita-mantenimientos',
  imports: [SHARED_FORMULARIOS_IMPORTS, CalendarModule, DividerModule, TagModule],
  templateUrl: './cita-mantenimientos.component.html',
  styleUrl: './cita-mantenimientos.component.scss'
})
export class CitaMantenimientosComponent extends BaseMetodosCrud<ICitaMantenimientos>{
  
  fechaSeleccionada: Date | null = null;
  dialogoVisible: boolean = false;
  cuposDisponibles: number= 0;
  fechasOcupadas: Date[] = []; 

  //Aqui asignaremos al id de vehiculo
  asginado: IAsignacionPorPerfil[] = [];
  vehiculoAsignado: IAsignacionPorPerfil | null = null;

  override entidad: ICitaMantenimientos = {
    id: 0,
    asignacion_vehiculo: 0,
    fecha: null,
    hora: null,
    completado: false,
    observacion: null
  };

  constructor(
    protected override  modeloService: CitaMantenimientosService,
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

  // cargarFechasLlenas() {
  //   this.modeloService.getFechasLlenas().subscribe(fechas => {
  //     this.fechasLlenas = fechas.map((f: string) => new Date(f));
  //   });
  // }

  abrirDialog(fecha: Date) {
    this.fechaSeleccionada = fecha;

    const fechaFormateada = fecha.toISOString().split('T')[0];
    this.entidad.fecha = fechaFormateada;
    console.log(this.entidad.fecha);
    
    this.dialogoVisible = true;
    // this.citasService.getCuposDisponibles(fecha).subscribe(cupos => {
    //   this.cuposDisponibles = cupos;
    //   if (cupos < 6) this.dialogVisible = true;
    //   else this.messageService.add({ severity: 'warn', summary: 'Día lleno', detail: 'Ya se alcanzó el límite de 6 citas para esta fecha.' });
    // });
  }

  override guardar(): void {
    const esEdicion = (this.entidad as any).id;

    this.confirmationService.confirm({
      message: esEdicion ? '¿Estas seguro de actualizar este registro?' : '¿Estas seguro de agregar este nuevo registro?',
      header: esEdicion ? 'Confirmación de Actualización' : 'Confirmación de Nuevo Registro',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const peticion = esEdicion
          ? this.modeloService.update((this.entidad as any).id, this.entidad)
          : this.modeloService.create(this.entidad);

        peticion.subscribe({
          next: () => {
            this.getData();
            this.messageService.add({
              severity: 'success',
              summary: esEdicion ? 'Editado' : 'Registrado',
              detail: esEdicion ? 'Registro actualizado correctamente' : 'Registro agregado correctamente'
            });
            this.displayModal = false;
          },
          error: (error) => this.ProcesarErroresPersonalizados(error)
        });
      }
    });
  }

  //Validacion de errores
  ProcesarErroresPersonalizados(error: any): void {
    const errores = error?.error;
    if (errores?.non_field_errors?.length){
      const mensaje = errores.non_field_errors[0];
      if (mensaje.includes('asignacion_vehiculo') && mensaje.includes('fecha')) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Conflicto de Reserva',
          detail: 'Ya tienes una reserva para ese día. Elige otra fecha.'
        });
        return;
      }
    }

    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail:'Ha ocurrido un error al guardar. Intenta nuevamente'
    });

  }

  verificarCantidadCitas() {
    if (!this.entidad.fecha) return;
    this.modeloService.obtenerCantidadCitas(this.entidad.fecha).subscribe(res => {
      if (res.cantidad >= 6) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Límite alcanzado',
          detail: 'Ya se alcanzó el límite de 6 citas para esta fecha. Elige otra.'
        });
      } else {
        this.guardar();
      }
    })
  }
  

  // reservarCita() {
  //   if (!this.fechaSeleccionada) return;

  //   this.citasService.reservarCita(this.fechaSeleccionada).subscribe(() => {
  //     this.messageService.add({ severity: 'success', summary: 'Reserva exitosa', detail: 'Tu cita fue registrada correctamente.' });
  //     this.dialogVisible = false;
  //     this.cargarFechasLlenas();
  //   });
  // }
}
