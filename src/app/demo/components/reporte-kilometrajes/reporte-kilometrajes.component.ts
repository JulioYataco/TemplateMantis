import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IReportekilometrajes } from 'src/app/core/models/ireporte-kilometrajes';
import { ReporteKilometrajesService } from 'src/app/core/services/reporte-kilometrajes/reporte-kilometrajes.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { Table } from 'primeng/table';


// 📌 Librerías para exportación
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

@Component({
  selector: 'app-reporte-kilometrajes',
  imports: [SHARED_FORMULARIOS_IMPORTS],
  templateUrl: './reporte-kilometrajes.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class ReporteKilometrajesComponent extends BaseMetodosCrud<IReportekilometrajes> implements AfterViewInit{
  
  @ViewChild('dt') override dt!: Table; // Referencia a la tabla

  constructor(protected override modeloService: ReporteKilometrajesService){
    super(modeloService);
  }

  ngAfterViewInit(): void {
    //
  }

  override exportCSV() {
    this.dt.exportCSV(); // Método integrado de PrimeNG para exportar
  }

  exportExcel() {
    // Crear la hoja de trabajo (worksheet)
    const data = this.dt.value.map(entidad => [
      entidad.id, entidad.numero, entidad.kilometraje, entidad.kilometraje_faltante,
      entidad.nombre_tipo_vehiculo, entidad.first_name, entidad.nombre_area, entidad.jefatura_nombre,
      entidad.placa, entidad.color, entidad.modelo, entidad.fabricacion, entidad.numero_serie
    ]);

    // Definir los encabezados
    const headers = [
      'ID', 'N° Moto', 'Kilometraje', 'Km Faltante', 'Movilidad', 'Conductor',
      'Área', 'Jefatura', 'Placa', 'Color', 'Modelo', 'Fabricación', 'N° Serie'
    ];

    // Crear una hoja de trabajo con los datos y encabezados
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Crear un libro de trabajo (workbook)
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, worksheet, 'Reporte Kilometrajes');

    // Exportar el archivo Excel
    XLSX.writeFile(wb, 'ReporteKilometrajes.xlsx');
  }

  exportPDF() {
    const doc = new jsPDF('landscape'); //  Formato horizontal para mejor visualización
    const columns = [
      'ID', 'N° Moto', 'Kilometraje', 'Km Faltante', 'Movilidad', 'Conductor',
      'Área', 'Jefatura', 'Placa', 'Color', 'Modelo', 'Fabricación', 'N° Serie'
    ];
    const rows = this.dt.value.map(entidad => [
      entidad.id, entidad.numero, entidad.kilometraje, entidad.kilometraje_faltante,
      entidad.nombre_tipo_vehiculo, entidad.first_name, entidad.nombre_area, entidad.jefatura_nombre,
      entidad.placa, entidad.color, entidad.modelo, entidad.fabricacion, entidad.numero_serie
    ]);

    doc.text('Reporte de Kilometrajes', 14, 10);
    autoTable(doc,{
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save('ReporteKilometrajes.pdf');
  }
}
