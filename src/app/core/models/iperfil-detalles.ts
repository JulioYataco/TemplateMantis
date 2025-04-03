export interface IPerfilDetalles {
    estado: string;
    usuario_id: number; //Primario
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    codigo: string;
    telefono: string;
    licencia: string;
    rol_id: number;
    nombre_rol: string;
    area_id: number;
    nombre_area: string;
}
