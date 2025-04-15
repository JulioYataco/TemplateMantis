export interface IAsignacionPorPerfil {
    id: number;
    estado: string;
    perfil: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    codigo: string;
    telefono: string;
    vehiculo_id: number;
    placa: string;
    marca: string;
    modelo: string;
    kilometraje_inicial: number;
    numero_serie: string;
    numero_motor: string;
    numero: number;
    area_id: number;
    nombre_area: string;
    nombre_tipo_vehiculo: string;
    tipo_vehiculo_id: number;
    color: string;
    kilometro_min: number;
    kilometro_max: number;
}
