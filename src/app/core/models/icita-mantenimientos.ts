import { Time } from "@angular/common";

export interface ICitaMantenimientos {
    id: number;
    asignacion_vehiculo: number;
    fecha: Date;
    hora: Time;
    completado: boolean;
    observacion: string;
}
