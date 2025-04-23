//import { Time } from "@angular/common";

export interface ICitaMantenimientos {
    id: number;
    asignacion_vehiculo: number;
    fecha: string | null;
    hora: string | null;
    completado: boolean;
    observacion: string | null;
}
