export interface IMantenimientos {
    id: number;
    cita_mantenimiento: number;
    tipo_mantenimiento: number;
    mecanico: number;
    fecha_mantenimiento: number;
    kilometraje_actual: number;
    proximo_mantenimiento?: Date;
    estado_vehicular?: boolean;
    costo?: number;
    observacion?: string;
}
