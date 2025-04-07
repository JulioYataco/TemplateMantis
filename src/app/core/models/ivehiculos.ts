export interface IVehiculos {
    id: number;
    tipo_vehiculo: number;
    numero: number;
    placa: string;
    color?: string;
    marca?: string;
    modelo?: string;
    fabricacion: number;
    kilometraje_inicial: number;
    numero_serie?: string;
    numero_motor?: string;
    observacion?: string;
}
