export interface IVehiculos {
    id: number;
    tipo_vehiculo: number;
    codigo: number;
    placa: string;
    color?: string;
    marca?: string;
    modelo?: string;
    fabricacion: number;
    kilometraje: number;
    numero_serie?: number;
    numero_motor?: number;
    observacion: string;
}
