import { Directive, inject, Input, OnInit, ViewChild } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
//import { MessageService } from "primeng/api";
import { BaseGenericoService } from "src/app/core/services/entidades/base-generico.service";

    //export: permite usar la clase en otros archivos
    //Para que angular reconozca la clase
    @Directive() //lo usamos porque las clases bases no pueden ser un componente directo, al no tener select, template, styleUrls
    export abstract class BaseMetodosCrud<T> implements OnInit{
        lista: T[] = []; //arreglo de elementos del tipo T que se inicializa como un arreglo vacio
        displayModal: boolean = false;
        entidad: Partial<T> = {}; //Usamos partial para decir que la entidad no esta obligada a tener todas sus propiedades
        entidadcompleta!: T ; //Objeto del tipo T, con el operador "!" Inidca que siempre tendra valor antes de usarse
        tituloFormulario: string = '';

        @Input() globalFilterFields: string[] = []; // Campos para el filtro global
        // Capturamos la referencia al p-table con ViewChild
        @ViewChild('dt') dt!: Table;
        protected confirmationService = inject(ConfirmationService)
        protected messageService = inject(MessageService);

        constructor(protected modeloService: BaseGenericoService<T>){}
        
        cargando: boolean = true;  // Control de carga
        skeletonData = Array(5).fill({}); // Para mostrar 5 filas de esqueleto

        //Inicializa traendo el metodo getdata
        ngOnInit(): void {
            this.getData();
        }

        //Listar todos los atributos
        getData(){
            this.cargando = true;
            this.modeloService.getAll().subscribe(
                (data) => {
                    this.lista = data;
                    this.cargando = false;
                    //console.log("lista:", data);
                },
                (error) => {
                    console.error('Error al cargar los datos', error);
                    this.cargando = false;
                }
            );
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
            //console.log("datos a editas:", entidad);
            this.displayModal = true; //abre el modal
        }

        //Crear o editar
        guardar() {
            //console.log('Se llamó al método guardar', this.entidad);
            // Si tiene id, entonces es edición
            if ((this.entidad as any).id) {
                this.confirmationService.confirm({
                    message: '¿Estas seguro de actualizar este registro?',
                    header: 'Confirmación de Actualización',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.modeloService.update((this.entidad as any).id, this.entidad).subscribe({
                            next: () => {
                                //console.log('Registro actualizado');
                                this.getData();
                                this.messageService.add({ severity: 'info', summary: 'Editado', detail: 'Registro editado correctamente'});
                                this.displayModal = false;
                            },
                            error: err => console.error('Error al actualizar:', err)
                        });
                    }
                });
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
                                this.messageService.add({ severity: 'info', summary: 'Registrado', detail: 'Registro agregado correctamente'});
                                this.displayModal = false;
                            },
                            error: err => console.error('error al crear:', err)
                        });
                    }
                });
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
                        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registro Eliminado correctamente'});
                    });
                },
                reject: () => {
                    console.log('Eliminación cancelada');
                }
            })
        }
        
    }