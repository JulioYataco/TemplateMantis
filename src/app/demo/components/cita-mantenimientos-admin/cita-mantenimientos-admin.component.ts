import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { ICitaMantenimientos } from 'src/app/core/models/icita-mantenimientos';
import { CitaMantenimientosService } from 'src/app/core/services/entidades/cita-mantenimientos/cita-mantenimientos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { TagModule } from 'primeng/tag';
import { IAsignacionPorPerfil } from 'src/app/core/models/iasignacion-por-perfil';
import { PerfilesDetalleService } from 'src/app/core/services/perfiles/perfiles-detalle.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';


// Librerías para exportación
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-cita-mantenimientos-admin',
  imports: [SHARED_FORMULARIOS_IMPORTS, TagModule, TooltipModule],
  templateUrl: './cita-mantenimientos-admin.component.html',
  styleUrl: '../BaseCrudComponent.component.scss',
})
export class CitaMantenimientosAdminComponent extends BaseMetodosCrud<ICitaMantenimientos>{
  
  asginado: IAsignacionPorPerfil[] = [];
  vehiculoAsignado: IAsignacionPorPerfil | null = null;

  override entidad: ICitaMantenimientos = {
    id: 0,
    asignacion_vehiculo: 0,
    fecha: null,
    hora: null,
    situacion_actual: 'pendiente',
    observacion: null
  };

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
    //this.obtenerDetallesasignado();
  }

  override getData(){
    this.cargando = true;

      this.modeloService.listarDetalleAll().subscribe(
        (data) => {
          this.lista = data;
          this.cargando = false;
          console.log("lista detallada", data);
          this.entidad.asignacion_vehiculo = data[1]; // Asignamos el valor de asignacion_vehiculo

        },
        (error) => {
          console.error('Error al cargar los datos', error);
          this.cargando = false;
        }
      )
  }

  // override getData(){
  //   this.cargando = true;
  //   const usuario = localStorage.getItem('usuario');
  //   //console.log("usuario", usuario);
  //   if (usuario) {
  //     const usuarioData = JSON.parse(usuario);
  //     //console.log("usuarioData", usuarioData);
  //     const perfilId = usuarioData.id;
  //     this.modeloService.listarPorPerfilId(perfilId).subscribe(
  //       (data) => {
  //         this.lista = data;
  //         this.cargando = false;
  //         console.log("lista detallada", data)
  //       },
  //       (error) => {
  //         console.error('Error al cargar los datos', error);
  //         this.cargando = false;
  //       }
  //     )
  //   }
  // }

  // obtenerDetallesasignado(): void {
  //     //Llamamos al servidor con el perfilId
  //     this.perfilDetalleService.detallesasignacionall().subscribe(
  //       (data) => {
  //         console.log("data", data);
  //         this.vehiculoAsignado = data;
  //         this.asginado = [data];
  //         console.log('Detalles de la asignación:', this.asginado);

  //         // Asignamos el ID de la asignación al modelo entidad
  //         this.entidad.asignacion_vehiculo = 2; // Asignamos el valor de asignacion_vehiculo
  //         //console.log(this.entidad.asignacion_vehiculo);
  //       },
  //       (error) => {
  //         console.error('Error al obtener los detalles de asignación', error);
  //       }
  //     );
  // }

  obtenerDetallePorIdCita(id: number){
    this.modeloService.listarDetallePorIdCita(id).subscribe(
      (data) => {
        console.log('Detalle por IdCita:', data[0].asignacion_vehiculo);
        // Asignamos el ID de la asignación al modelo entidad
        this.entidad.asignacion_vehiculo = data[0].asignacion_vehiculo;
      });
  }

  cambiarSituacion(entidad: ICitaMantenimientos, nuevoEstado: string, mensajeConfirmacion: string, mensajeExito: string): void {
    if (!entidad.id) {
      console.error('El ID de la entidad no esta definido');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El ID de la entidad no está definido.'});
      return;
    }

    const entidadActualizada: Partial<ICitaMantenimientos> = {
      ...entidad,
      situacion_actual: nuevoEstado
    };

    this.confirmationService.confirm({
      message: mensajeConfirmacion,
      header: 'Confirmación de estado',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.modeloService.update(entidad.id, entidadActualizada).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensajeExito});
            this.getData();
          },
          error: err => {
            console.error('Error al actualizar:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo actualizar la situaciòn actual.'});
          }
        });
      }
    });
  }

  marcarComoAsistio(entidad: ICitaMantenimientos, id:number) {
    this.obtenerDetallePorIdCita(id);
    this.cambiarSituacion(
      entidad,
      'asistio',
      '¿Estás seguro de confirmar asistencia?',
      'Estado actualizada a "Asistió"'
    );
  }

  marcarComoCancelado(entidad: ICitaMantenimientos, id:number) {
    this.obtenerDetallePorIdCita(id);
    this.cambiarSituacion(
      entidad,
      'cancelada',
      '¿Estás seguro de confirmar la cancelación?',
      'Estado actualizada a "Cancelada"'
    );
  }

  marcarComoNoAsistio(entidad: ICitaMantenimientos, id:number) {
    this.obtenerDetallePorIdCita(id);
    this.cambiarSituacion(
      entidad,
      'no_asistio',
      '¿Estás seguro de confirmar que el conductor no asistió?',
      'Estado actualizada a "No Asistio"'
    );
  }

  estadoLegible: { [key: string]: string } = {
    asistio: 'Examinado',
    cancelada: 'Cancelado',
    pendiente: 'Pendiente',
    no_asistio: 'No asistió',
  };

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

  exportExcel() {
  
      // Crear una instancia de DatePipe para formatear las fechas
      const datePipe = new DatePipe('es'); 
  
      // Crear la hoja de trabajo (worksheet)
      const data = this.dt.value.map(entidad => [
        entidad.id, datePipe.transform(entidad.fecha, 'dd MMM yy'), 
        entidad.situacion_actual, entidad.kilometraje, entidad.nombre_tipo_vehiculo, 
        entidad.placa, entidad.first_name, entidad.nombre_area, entidad.observacion
      ]);
  
      // Definir los encabezados
      const headers = [
        'Id', 'Fecha', 'Estado', 'Kilometraje', 'Movilidad', 'Placa',
        'Conductor', 'Área', 'Observación'
      ];
  
      // Crear una hoja de trabajo con los datos y encabezados
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
  
      // Crear un libro de trabajo (workbook)
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, worksheet, 'Reporte Kilometrajes');
  
      // Exportar el archivo Excel
      XLSX.writeFile(wb, 'ReporteKilometrajes.xlsx');
  }

}
