export interface ICitaMantenimientos {
    id: number;
    asignacion_vehiculo: number;
    fecha: string | null;
    hora: string | null;
    situacion_actual: string;  //| 'pendiente' | 'asistio' | 'no_asistio' | 'cancelada';
    observacion: string | null;
}
