import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
// src/app/shared/shared-imports.ts
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { importProvidersFrom } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';
import { SkeletonModule } from 'primeng/skeleton';

// import { MessageService } from 'primeng/api';
// import { CardComponent } from '../theme/shared/components/card/card.component';

export const SHARED_FORMULARIOS_IMPORTS = [
    CommonModule,         //Importa funciones basicas ngIf, ngFor, ngClass, etc.
    FormsModule,          //Habilita el uso de ngModel para hacer formularios basados en planillas
    ReactiveFormsModule,  //Para manejar formularios reactivos
    InputTextModule,      //Permite usar pinputText para mejorar la apariencia de los inputs
    ButtonModule,         //Permite usar pButton
    TableModule,          //Permite usar <p-table></p-table> para mostrar datos dinamicamente
    DialogModule,          //Permite usar <p-dialog></p-dialog>
    CardComponent,         //Permite usar <app-card></app-card>
    RippleModule,
    ToastModule,
    DropdownModule,
    InputIconModule,
    IconFieldModule,
    ToolbarModule,
    ConfirmDialogModule, //Para confirmación de operaciones cruds
    ToastModule, //Con esto mostramos mensaje de exito, error o advertencia
    DatePickerModule,
    SkeletonModule //Para cargar una tabla vacia mientras cargan los datos
];
//Esto hace 2 cosas importantes
//Aseguremonos de que esto lo agregemos al main.ts. Porque sino angular no podrá resolver ConfirmDialogModul ni ConfirmationService. De no hacer eso no te cargará ninguna tabla
export const SHARED_PROVIDERS = [
    importProvidersFrom(ConfirmDialogModule, ToastModule), //Este método convierte el módulo en un provider global, sin esto, tendriamos que importar ConfirmDialogModule en cada component crud que donde queremos usar en su html <p-confirmDialog />, lo cual no seria eficiente y tomaria más trabajo de importar uno por uno
    ConfirmationService, //Es el servicio de primeNG que permite controlar la lógica de confirmación de manera centralizada. De igual forma si no la ponemos aqui, tenemos que importarla en cada componente que la necesite. y nos aseguramos que cualquier componente en la app puede usarlo sin necesidad de instanciarlo manualmente.  Disponible en todas las app
    MessageService
];
