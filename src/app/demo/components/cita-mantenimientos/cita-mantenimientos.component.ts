import { CalendarModule } from 'primeng/calendar';
import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { ICitaMantenimientos } from 'src/app/core/models/icita-mantenimientos';
import { CitaMantenimientosService } from 'src/app/core/services/entidades/cita-mantenimientos/cita-mantenimientos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { DividerModule } from 'primeng/divider';
import { PerfilesDetalleService } from 'src/app/core/services/perfiles/perfiles-detalle.service';
import { IAsignacionPorPerfil } from 'src/app/core/models/iasignacion-por-perfil';

@Component({
  selector: 'app-cita-mantenimientos',
  imports: [SHARED_FORMULARIOS_IMPORTS, CalendarModule, DividerModule],
  templateUrl: './cita-mantenimientos.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class CitaMantenimientosComponent extends BaseMetodosCrud<ICitaMantenimientos>{
  
  fechaSeleccionada: Date | null = null;
  dialogoVisible: boolean = false;
  cuposDisponibles: number= 0;
  fechasOcupadas: Date[] = []; 

  //Aqui asignaremos al id de vehiculo
  asginado: IAsignacionPorPerfil[] = [];
  vehiculoAsignado: IAsignacionPorPerfil | null = null;

  constructor(
    protected override  modeloService: CitaMantenimientosService,
    private perfilDetalleService: PerfilesDetalleService
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
    this.dialogoVisible = true;
    // this.citasService.getCuposDisponibles(fecha).subscribe(cupos => {
    //   this.cuposDisponibles = cupos;
    //   if (cupos < 6) this.dialogVisible = true;
    //   else this.messageService.add({ severity: 'warn', summary: 'Día lleno', detail: 'Ya se alcanzó el límite de 6 citas para esta fecha.' });
    // });
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
