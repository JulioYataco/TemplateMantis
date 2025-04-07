import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { BaseGenericoService } from 'src/app/core/services/entidades/base-generico.service';
//import { BaseMetodosCrud } from '../../components/baseMetodosCrud.component';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
//import { BaseMetodosCrud } from '../../components/baseMetodosCrud.component';
import { Table } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-base-crud',
  standalone: true,
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './base-crud.component.html',
  styleUrl: './base-crud.component.scss'
})

export class BaseCrudComponent<T> implements OnInit{
    // Configuraciones dinámicas para la vista
    @Input() tituloGlobal: string = '';
    @Input() columns: { field: string; header: string }[] = [];
    @Input() formFields: { field: string; label: string }[] = [];

    // Capturamos la referencia al p-table con ViewChild
    @ViewChild('dt') dt!: Table;

    lista: T[] = []; //arreglo de elementos del tipo T que se inicializa como un arreglo vacio
    displayModal: boolean = false;
    entidad: Partial<T> = {}; //Usamos partial para decir que la entidad no esta obligada a tener todas sus propiedades
    entidadcompleta!: T ; //Objeto del tipo T, con el operador "!" Inidca que siempre tendra valor antes de usarse
    tituloFormulario: string = '';

    @Input() globalFilterFields: string[] = []; // Campos para el filtro global

    protected confirmationService = inject(ConfirmationService)
    protected messageService = inject(MessageService);
    
    // Recibimos la instancia del servicio mediante Input
    @Input() modeloService!: BaseGenericoService<T>;
        
    //Inicializa traendo el metodo getdata
    ngOnInit(): void {
        this.getData();
    }

    //Listar todos los atributos
    getData(){
        this.modeloService.getAll().subscribe(data => {
            this.lista = data;
            console.log("lista:", data);
        });
    }

    exportCSV() {
        this.dt.exportCSV();
    }
    

    //Para abrir dialogo y poder registar o editar
    mostrarDialogo(){
        this.displayModal = true;
        this.entidad = {} //Limpia el formulario
    }

    cerrarDialogo(){
        this.displayModal = false;
        this.entidad = {} //Limpia el formulario
    }

    //Para editar registro
    CargarDatosModal(entidad: T) {
        this.entidad = { ...entidad }; //Copia objeto
        console.log("datos a editas:", entidad);
        this.displayModal = true; //abre el modal
    }

    //Crear o editar
    guardar() {
        console.log('Se llamó al método guardar', this.entidad);
        // Si tiene id, entonces es edición
        if ((this.entidad as any).id) {
            this.confirmationService.confirm({
                message: '¿Estas seguro de actualizar este registro?',
                header: 'Confirmación de Actualización',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.modeloService.update((this.entidad as any).id, this.entidad).subscribe({
                        next: () => {
                            console.log('Registro actualizado');
                            this.getData();
                            this.messageService.add({ severity: 'success', summary: 'Editado', detail: 'Registro editado correctamente'});
                            this.displayModal = false;
                        },
                        error: err => console.error('Error al actualizar:', err)
                    });
                }
            })
        } else {
            this.confirmationService.confirm({
                message: '¿Estas seguro de agregar este nuevo registro?',
                header: 'Confirmación de Nuevo Registro',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    // Si no tiene id, entonces es creación
                    this.modeloService.create(this.entidad).subscribe({
                        next: () => {
                            this.getData();
                            this.messageService.add({ severity: 'success', summary: 'Registrado', detail: 'Registro agregado correctamente'});
                            this.displayModal = false;
                        },
                        error: err => console.error('error al crear:', err)
                    });
                }
            })
        }
    }

    //Eliminar registro
    eliminar(id: number){
        this.confirmationService.confirm({
            message: '¿Estas seguro de eliminar este registro?',
            header: 'Confirmación Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //Si acepta la confirmación eliminamos
                this.modeloService.delete(id).subscribe(() => {
                    this.getData();
                    this.messageService.add({ severity: 'warn', summary: 'Eliminado', detail: 'Registro Eliminado correctamente'});
                });
            },
            reject: () => {
                console.log('Eliminación cancelada');
            }
        })
    }

}
    