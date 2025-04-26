import { CalendarModule } from 'primeng/calendar';
import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { ICitaMantenimientos } from 'src/app/core/models/icita-mantenimientos';
import { CitaMantenimientosService } from 'src/app/core/services/entidades/cita-mantenimientos/cita-mantenimientos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
// import { DividerModule } from 'primeng/divider';
import { PerfilesDetalleService } from 'src/app/core/services/perfiles/perfiles-detalle.service';
import { IAsignacionPorPerfil } from 'src/app/core/models/iasignacion-por-perfil';
// import { formatDate } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-cita-mantenimientos',
  imports: [SHARED_FORMULARIOS_IMPORTS, CalendarModule, TagModule, TooltipModule],
  templateUrl: './cita-mantenimientos.component.html',
  styleUrl: './cita-mantenimientos.component.scss'
})
export class CitaMantenimientosComponent extends BaseMetodosCrud<ICitaMantenimientos>{
  
  fechaSeleccionada: Date | null = null;
  dialogoVisible: boolean = false;
  cuposDisponibles: number= 0;
  cantidadCitas: number;
  fechasOcupadas: Date[] = []; 

  //Aqui asignaremos al id de vehiculo
  asginado: IAsignacionPorPerfil[] = [];
  vehiculoAsignado: IAsignacionPorPerfil | null = null;
  asignacionPerfilDetalles: IAsignacionPorPerfil[] = [];
  

  override entidad: ICitaMantenimientos = {
    id: 0,
    asignacion_vehiculo: 0,
    fecha: null,
    hora: null,
    situacion_actual: 'pendiente',
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
    this.cargarFechasLlenas();
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
          console.log("lista detallada", data)
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

  obtenernombrevehiculo(asignacion_id: number): string {
    const data = this.asignacionPerfilDetalles.find(r => r.id === asignacion_id)
    return data ? data.placa : 'Desconocido'
  }

  cargarFechasLlenas() {
    this.modeloService.getFechasBloqueadas().subscribe(res => {
      this.fechasOcupadas = res.fechas.map(f => {
        const [year, month, day] = f.split('-').map(Number);
        return new Date(year, month -1, day)
      });
    });
  }

  // getToolTipPorDia(date: any): string {
  //   const dia_fecha = new Date(date.year, date.month, date.day);
  //   if (this.isDateLimitReached(dia_fecha)){
  //     return 'Citas programadas abarrotadas';
  //   }
  //   return '';
  // }

  getDateClass(date: Date): string {
    return this.isDateLimitReached(date) ? 'día reservado' : ''; 
  }

  isDateLimitReached(date: Date): boolean {
    return this.fechasOcupadas.some(d =>
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    );
  }

  minDate: Date = new Date(); // Bloquea días anteriores desde el inicio

  abrirDialog(fecha: Date) {
    //A fechaSeleccionada le pasamos la mimsa por el parametro que pide la función
    this.fechaSeleccionada = fecha;

    const fechaFormateada = fecha.toISOString().split('T')[0];
    //Asignamos la fecha para poder guardar en la base de datos
    this.entidad.fecha = fechaFormateada;
    console.log(this.entidad.fecha);
    
    this.dialogoVisible = true;
    this.modeloService.obtenerCantidadCitas(this.entidad.fecha).subscribe(res => {
      this.cantidadCitas = res.cantidad;
      console.log('Cantidad de citas',this.cantidadCitas);
    });
    // this.citasService.getCuposDisponibles(fecha).subscribe(cupos => {
    //   this.cuposDisponibles = cupos;
    //   if (cupos < 6) this.dialogVisible = true;
    //   else this.messageService.add({ severity: 'warn', summary: 'Día lleno', detail: 'Ya se alcanzó el límite de 6 citas para esta fecha.' });
    // });
  }

  cerrarDialog(){
    this.fechaSeleccionada = null;
    this.entidad.fecha = null;
    this.dialogoVisible = false;
  }

  override guardar(): void {
    const esEdicion = (this.entidad as any).id;

    // Si es una nueva cita, asignamos un valor predeterminado a situacion_actual
    if (!this.entidad.situacion_actual) {
      this.entidad.situacion_actual = 'pendiente'; // Valor predeterminado
    }

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
            this.dialogoVisible = false;
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
        this.cantidadCitas = res.cantidad;

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

  //Asignamos un nombre mas legible que el original que nos trae situacion actual
  estadoLegible: { [key: string]: string } = {
    asistio:    'Examinado',
    cancelada:  'Cancelado',
    pendiente:  'Pendiente',
    no_asistio: 'No asistió',
  };

  //Asignamos color dependiendo a la situacion actual
  getColorEstado(situacion: string): 'success' | 'danger' |'secondary' | 'warn' | 'info' | 'contrast' {
    switch (situacion) {
      case 'asistio':
        return 'success';
      case 'cancelada':
        return 'danger';
      case 'pendiente':
        return 'warn';
      case 'no_asistio':
        return 'contrast';
      default:
        return 'info';
    }
  }

  //Asignamos icono dependiendo a la situacion actual
  getIconEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'asistio':
        return 'pi pi-check-circle';
      case 'cancelada':
        return 'pi pi-times-circle';
      case 'pendiente':
        return 'pi pi-clock';
      case 'no_asistio':
        return 'pi pi-calendar-times';
      default:
        return 'pi pi-info-circle';
    }
  }

  getTooltipEstado(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'asistio':
        return 'El vehiculo fue revisado';
      case 'cancelada':
        return 'La cita fue cancelada';
      case 'pendiente':
        return 'Cita pendiente de atención';
      case 'no_asistio':
        return 'No asistió a la cita';
      default:
        return 'Estado desconocido';
    }
  }

}
