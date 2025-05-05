import { Component, OnInit } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IAsignacionVehiculos } from 'src/app/core/models/iasignacion-vehiculos';
import { AsignacionVehiculosService } from 'src/app/core/services/entidades/asignacion-vehiculos/asignacion-vehiculos.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { IVehiculos } from 'src/app/core/models/ivehiculos';
import { VehiculosService } from 'src/app/core/services/entidades/vehiculos/vehiculos.service';
import { PerfilesDetalleService } from 'src/app/core/services/perfiles/perfiles-detalle.service';
import { IPerfilDetalles } from 'src/app/core/models/iperfil-detalles';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
// Librerías para exportación
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-asignacion-vehiculos',
  imports: [SHARED_FORMULARIOS_IMPORTS, SelectModule, FileUploadModule],
  templateUrl: './asignacion-vehiculos.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class AsignacionVehiculosComponent extends BaseMetodosCrud<IAsignacionVehiculos>{
  
  vehiculos: IVehiculos[] = [];
  perfilDetalles: IPerfilDetalles[] = [];

  //Para la importación de registro
  datosPreview: any[] = [];
  columnasPreview: string[] = [];
  modalPreview: boolean = false;
  
  constructor(
    protected override modeloService: AsignacionVehiculosService,
    private vehiculoService: VehiculosService,
    private perfilDetalleService: PerfilesDetalleService
  ){
    super(modeloService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.obtenerVehiculo();
    this.obtenerPerfilesDetalle();
  }

  obtenerVehiculo(): void {
    this.vehiculoService.getAll().subscribe(data => {
      this.vehiculos = data.map(vehiculo => ({
        ...vehiculo,
        numero_placa: `N° Moto ${vehiculo.numero }  -  ${ vehiculo.placa}`
      }));
    });
  }

  obtenerPlacaVehiculo(vehiculo_id: number): string {
    const data = this.vehiculos.find(r => r.id === vehiculo_id)
    return data ? data.placa : 'Desconocido'
  }

  obtenerPerfilesDetalle(): void {
    this.perfilDetalleService.perfilDetalles().subscribe(data => {
      this.perfilDetalles = data.map(perfil => ({
        ...perfil,
        full_name: `${perfil.first_name} ${perfil.last_name}`
      }));
    });
  }

  obtenerNombrePerfil(usuario_id: number): string {
    const data = this.perfilDetalles.find(r => r.usuario_id === usuario_id)
    return data ? `${data.first_name} ${data.last_name}` : 'Desconocido'
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
