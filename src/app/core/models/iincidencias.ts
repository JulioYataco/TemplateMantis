export interface IIncidencias {
    id: number;
    asignacion_vehiculo: number;
    fecha_hora: Date;
    incidencia: string;
    costo_reparacion: number;
    solucion: string;
    observacion: string;
}
