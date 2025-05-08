import { Injectable } from '@angular/core';
import { BaseGenericoService } from '../base-generico.service';
import { ICitaMantenimientos } from 'src/app/core/models/icita-mantenimientos';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CitaMantenimientosService extends BaseGenericoService<ICitaMantenimientos>{

  private apiURl= environment.apiUrl;
  private citacantidad = `${this.apiURl}/cantidad_citas_por_fecha`;
  private apiFechaBloqueada = `${this.apiURl}/fechas_llenas_de_citas`;
  private urlCitaPorPerfil = `${this.apiURl}/cita_mantenimiento_detallado_perfil`;
  private urlCitaAll = `${this.apiURl}/cita_mantenimiento_detallado_all`;
  private urlCitaPorIdCita = `${this.apiURl}/cita_mantenimiento_detallado_all_por_id_cita`;
  private apiFechaConCita = `${this.apiURl}/fechas_con_citas`;

  constructor(private http: HttpClient) {
    super();
    this.init('cita_mantenimientos')
  }

  obtenerCantidadCitas(fecha: string): Observable<any> {
    const params = new HttpParams().set('fecha', fecha.toString());
    return this.http.get<any>(this.citacantidad, { params }); 
  }

  getFechasBloqueadas() {
    return this.http.get<{fechas: string[]}>(`${this.apiFechaBloqueada}`);
  }

  getFechasConCitas() {
    return this.http.get<{fechas: string[]}>(`${this.apiFechaConCita}`);
  }

  listarPorPerfilId(perfilId: number): Observable<any[]> {
    const params = new HttpParams().set('perfil_id', perfilId.toString());
    return this.http.get<any[]>(this.urlCitaPorPerfil, { params });
  }
  
  listarDetalleAll(): Observable<any[]> {
    return this.http.get<any[]>(this.urlCitaAll);
  }

  listarDetallePorIdCita(cita_id: number): Observable<any[]> {
    const params = new HttpParams().set('cita_id', cita_id.toString());
    return this.http.get<any[]>(this.urlCitaPorIdCita, { params } );
  }

  /** estas funciones: listarDetallePorIdCita, listarDetalleAll
   * traen estos datos
   * [
      {
        "id": 14,
        "asignacion_vehiculo": 1,
        "fecha": "2025-05-08",
        "hora": null,
        "situacion_actual": "pendiente",
        "observacion": null,
        "estado_cita": "A",
        "estado": "A",
        "perfil_id": 3,
        "username": "tjayo",
        "first_name": "Roxana Karina",
        "last_name": "Torres Jayo",
        "email": "",
        "is_active": true,
        "codigo": null,
        "telefono": null,
        "area_id": 1,
        "nombre_area": "Fundo Dos Marias",
        "jefatura_id": 3,
        "jefatura_nombre": "Roxana Karina",
        "vehiculo_id": 1,
        "placa": "5840-VC",
        "marca": "Honda",
        "modelo": "XR150L",
        "kilometraje_inicial": 400.0,
        "numero_serie": "LTMKD0792R5301150",
        "numero": 1,
        "color": "Negro",
        "fabricacion": 2024,
        "numero_motor": "KD07E3022715",
        "tipo_vehiculo_id": 5,
        "nombre_tipo_vehiculo": "Moto",
        "kilometro_min": 1000.0,
        "kilometro_max": null
      }
    ]
   */
}
