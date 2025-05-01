import { Component } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IVehiculos } from 'src/app/core/models/ivehiculos';
import { VehiculosService } from 'src/app/core/services/entidades/vehiculos/vehiculos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { TipoVehiculosService } from 'src/app/core/services/entidades/tipo-vehiculos/tipo-vehiculos.service';
import { ITipoVehiculos } from 'src/app/core/models/itipo-vehiculos';
import { FileUploadModule } from 'primeng/fileupload';
// Librerías para exportación
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vehiculos',
  imports: [SHARED_FORMULARIOS_IMPORTS, FileUploadModule],
  templateUrl: './vehiculos.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class VehiculosComponent extends BaseMetodosCrud<IVehiculos> {
  
  tipovehiculos: ITipoVehiculos[] = []
  listaTipos = [
    { observacion: 'Alquilada', nombre: 'Alquilada' },
    { observacion: 'Beta', nombre: 'Beta' }
  ];

  datosPreview: any[] = [];
  columnasPreview: string[] = [];
  modalPreview: boolean = false;

  constructor(
    protected override modeloService: VehiculosService,
    private tipoVehiculoService: TipoVehiculosService
  ) {
    super(modeloService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.obtenerTipoVehiculos();
  }

  obtenerTipoVehiculos(): void {
    this.tipoVehiculoService.getAll().subscribe(tipovehiculo => {
      this.tipovehiculos = tipovehiculo;
    });
  }

  obtenerNombreTipoVehiculo(idtipo_vehiculo: number): string {
    const tipovehiculo = this.tipovehiculos.find(l => l.id === idtipo_vehiculo);
    return tipovehiculo ? tipovehiculo.nombre_tipo_vehiculo : 'Desconocido';
  }

  importarDesdeExcel(event: any): void {
    const archivo = event.target.files[0];
    const lector = new FileReader();
  
    lector.onload = (e: any) => {
      const datos = new Uint8Array(e.target.result);
      const libro = XLSX.read(datos, { type: 'array' });
      const hoja = libro.Sheets[libro.SheetNames[0]];
      const registros = XLSX.utils.sheet_to_json<any>(hoja);
  
      // Validaciones básicas antes de guardar
      if (registros.length === 0) {
        console.log('El archivo está vacío o no tiene formato válido.');
        return;
      }
  
      // Aquí deberías enviar al backend en lote
      //console.log(registros);
      // Preview y columnas para tabla
      this.datosPreview = registros;
      this.columnasPreview = Object.keys(registros[0]);
      this.modalPreview = true;
    };
  
    lector.readAsArrayBuffer(archivo);
  }

  CerrarModalPreview(){
    this.datosPreview = [];
    this.columnasPreview = [];
    this.modalPreview = false;
  };

  confirmarImportacion():void{
    this.confirmationService.confirm({
      message: '¿Estas seguro de importar todos estos registros?',
      header: 'Confirmación de Importación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.modeloService.registroMasivo((this.datosPreview)).subscribe({
          next: () => {
            this.getData();
            this.messageService.add({ severity: 'info', summary: 'Subido', detail: 'Registro importado correctamente'});
            this.modalPreview = false;
          },
          error: (err) => {
            console.error('Error al importar',err);
          }
        });
      }
    });
  }
}
