import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IKilometrajes } from 'src/app/core/models/ikilometrajes';
import { KilometrajesService } from 'src/app/core/services/entidades/kilometrajes/kilometrajes.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { IVehiculos } from 'src/app/core/models/ivehiculos';
import { IPerfilDetalles } from 'src/app/core/models/iperfil-detalles';
import { VehiculosService } from 'src/app/core/services/entidades/vehiculos/vehiculos.service';
import { PerfilesDetalleService } from 'src/app/core/services/perfiles/perfiles-detalle.service';
import { IAsignacionPorPerfil } from 'src/app/core/models/iasignacion-por-perfil';
import { AuthService } from 'src/app/core/services/login/auth.service';
import { IReportekilometrajes } from 'src/app/core/models/ireporte-kilometrajes';
import { ProgressBarModule } from 'primeng/progressbar';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { IAsignacionVehiculos } from 'src/app/core/models/iasignacion-vehiculos';
import { RouterModule } from '@angular/router'; // Esto es necesario para routerLink

@Component({
  selector: 'app-kilometrajes',
  imports: [SHARED_FORMULARIOS_IMPORTS, ProgressBarModule,CardModule,TagModule,RouterModule ],
  templateUrl: './kilometrajes.component.html',
  styleUrl: './kilometrajes.component.scss'
})
export class KilometrajesComponent extends BaseMetodosCrud<IKilometrajes> {
  
  //Asignar la lista de asignacion vehiculos
  asignacion_vehiculos: IAsignacionVehiculos[] = [];
  vehiculos: IVehiculos[] = [];
  perfilDetalles: IPerfilDetalles[] = [];
  asignacionPerfilDetalles: IAsignacionPorPerfil[] = [];

  asginado: IAsignacionPorPerfil[] = [];
  vehiculoAsignado: IAsignacionPorPerfil | null = null;

  kilometrajeRestante: number | string = 'cargando...';

  kmFaltantes: number = 0;
  limiteKm: number = 1000; // Puedes cambiar este valor según la lógica de tu sistema

  override lista: IReportekilometrajes[] = [];

  override entidad: IKilometrajes = {
    id: 0,
    asignacion_vehiculo: 0, // Inicializamos con 0, que se actualizará luego
    fecha_crea: null,
    kilometraje: 0,
    kilometraje_faltante: 0,
    observacion: null
  };

  constructor(
    protected override modeloService: KilometrajesService,
    private vehiculoService: VehiculosService,
    private perfilDetalleService: PerfilesDetalleService,
    public authService: AuthService
  ){
    super(modeloService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.getData();
    this.obtenerDetallesasignado();
    //this.setkilometrajeRestante();
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

  obtenernombrevehiculo(asignacion_id: number): string {
    const data = this.asignacionPerfilDetalles.find(r => r.id === asignacion_id)
    return data ? data.placa : 'Desconocido'
  }

  //Calcular cuanto falta para el proximo mantenimiento
  calcularKmFaltantes(k: number, limite: number): number {
    const siguienteKmLimite = Math.ceil(k / limite) * limite;
    return siguienteKmLimite - k;
  }

  //Esto permite calcular en tiempo real
  onKilometrajeChange(kilometro_min: number): void {
    this.kmFaltantes = this.calcularKmFaltantes(this.entidad.kilometraje, kilometro_min);
    this.entidad.kilometraje_faltante = this.kmFaltantes; // Guardamos en la entidad
    //return this.entidad.kilometraje_faltante;
  }

  getColorKilometraje(faltante: number): 'danger' | 'warn' | 'info' | 'success' {
    if (faltante <= 100) return 'danger';
    if (faltante <= 500) return 'warn';
    if (faltante <= 800) return 'info';
    return 'success';
  }

  getProgreso(kilometraje: number, limite: number): number {
    if (!kilometraje) return 0; // Devuelve 0 si kilometraje es undefined o nulo
    const progreso = (kilometraje % limite) / limite * 100;
    return Math.min(Math.round(progreso), 100); // redondea y limita a 100%
  }

  getProgresoColor(kilometraje: number, limite: number): string {
    const progreso = this.getProgreso(kilometraje, limite);
    //("progreso",progreso);
    if (progreso >= 90) return '#dc3545';      // rojo
    if (progreso >= 60) return '#ffc107';      // amarillo
    return '#28a745';                          // verde
  }
  
}
