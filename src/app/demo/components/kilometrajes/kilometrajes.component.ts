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

@Component({
  selector: 'app-kilometrajes',
  imports: [SHARED_FORMULARIOS_IMPORTS, ProgressBarModule,CardModule,TagModule ],
  templateUrl: './kilometrajes.component.html',
  styleUrl: './kilometrajes.component.scss'
})
export class KilometrajesComponent extends BaseMetodosCrud<IKilometrajes> {
  
  vehiculos: IVehiculos[] = [];
  perfilDetalles: IPerfilDetalles[] = [];
  asignacionPerfilDetalles: IAsignacionPorPerfil[] = [];

  asginado: IAsignacionPorPerfil[] = [];

  kmFaltantes: number = 0;
  limiteKm: number = 1000; // Puedes cambiar este valor según la lógica de tu sistema

  override lista: IReportekilometrajes[] = []


  override entidad: IKilometrajes = {
    id: 0,
    asignacion_vehiculo: 0, // Inicializamos con 0, que se actualizará luego
    fecha_crea: null,
    kilometraje: 0,
    kilometraje_faltante: 0,
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
  }

  override getData(){
    this.cargando = true;
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioData = JSON.parse(usuario);
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

  // override ngOnInit(): void {
  //   super.ngOnInit();
  //   //this.obtenerDetallesasignado();
  // }



  // override getData(): void {
  //   const usuario = localStorage.getItem('usuario');
  //   if (usuario) {
  //     const usuarioData = JSON.parse(usuario);
  //     const perfilId = usuarioData.id;
  
  //     this.perfilDetalleService.detallesasignacionperfil(perfilId).subscribe(
  //       (data) => {
  //         this.asginado = [data];
  //         this.entidad.asignacion_vehiculo = data.id;
  
  //         this.modeloService.listarPorPerfilId(data.id).subscribe(
  //           (listaFiltrada) => {
  //             this.lista = listaFiltrada;
  //           },
  //           (err) => console.error("Error al cargar kilometrajes filtrados", err)
  //         );
  //       },
  //       (error) => {
  //         console.error('Error al obtener los detalles de asignación', error);
  //       }
  //     );
  //   }
  // }

  obtenerDetallesasignado(): void {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      const usuarioData = JSON.parse(usuario);
      const perfilId = usuarioData.id;

      //Llamamos al servidor con el perfilId
      this.perfilDetalleService.detallesasignacionperfil(perfilId).subscribe(
        (data) => {
          this.asginado = [data];
          console.log('Detalles de la asignación:', this.asginado);

          // Asignamos el ID de la asignación al modelo entidad
          this.entidad.asignacion_vehiculo = data.id; // Asignamos el valor de asignacion_vehiculo
          console.log(this.entidad.asignacion_vehiculo);
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
  onKilometrajeChange(): void {
    this.kmFaltantes = this.calcularKmFaltantes(this.entidad.kilometraje, this.limiteKm);
    this.entidad.kilometraje_faltante = this.kmFaltantes; // Guardamos en la entidad
  }

  getEstadoKilometraje(faltante: number): string {
    if (faltante <= 100) return 'Mantenimiento urgente';
    if (faltante <= 500) return 'Pronto mantenimiento';
    if (faltante <= 800) return 'En observación';
    return 'Sin novedad';
  }

  getColorKilometraje(faltante: number): 'danger' | 'warn' | 'info' | 'success' {
    if (faltante <= 100) return 'danger';
    if (faltante <= 500) return 'warn';
    if (faltante <= 800) return 'info';
    return 'success';
  }

  getProgreso(kilometraje: number, limite: number = this.limiteKm): number {
    if (!kilometraje) return 0; // Devuelve 0 si kilometraje es undefined o nulo
    const progreso = (kilometraje % limite) / limite * 100;
    return Math.min(Math.round(progreso), 100); // redondea y limita a 100%
    
  }

  getProgresoColor(kilometraje: number): string {
    const progreso = this.getProgreso(kilometraje);
    console.log("progreso",progreso);
    if (progreso < 33) {
      return 'green-to-yellow'; // Verde a Amarillo (inicio)
    } else if (progreso >= 33 && progreso < 66) {
      return 'yellow-to-red'; // Amarillo a Rojo (intermedio)
    }
    return 'green-to-yellow-to-red'; // Verde a Amarillo a Rojo (cerca de 100%)
  }

  
}

// getProgressClass(kilometraje: number): string {
//   const progress = this.getProgreso(kilometraje);
//   if (progress >= 90) {
//     return 'icon-progress-approaching';  // Aplica animación si está cerca de 100%
//   }
//   return ''; // Sin animación si el progreso es bajo
// }


  // obtenerVehiculo(): void {
  //   this.vehiculoService.getAll().subscribe(data => {
  //     this.vehiculos = data.map(vehiculo => ({
  //       ...vehiculo,
  //       numero_placa: `N° Moto ${vehiculo.numero }  -  ${ vehiculo.placa}`,
  //       color: vehiculo.color,  // Asegúrate de que 'color' sea una propiedad válida en tu respuesta
  //     }));
  //   });
  // }

  // obtenerPerfilesDetalle(): void {
  //   this.perfilDetalleService.perfilDetalles().subscribe(data => {
  //     this.perfilDetalles = data.map(perfil => ({
  //       ...perfil,
  //       full_name: `${perfil.first_name} ${perfil.last_name}`
  //     }));
  //   });
  // }