import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BaseMetodosCrud } from '../baseMetodosCrud.component';
import { IReportekilometrajes } from 'src/app/core/models/ireporte-kilometrajes';
import { ReporteKilometrajesService } from 'src/app/core/services/reporte-kilometrajes/reporte-kilometrajes.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';
import { Table } from 'primeng/table';
// import { CalendarModule } from 'primeng/calendar';
import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';

// Librerías para exportación
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reporte-kilometrajes',
  imports: [SHARED_FORMULARIOS_IMPORTS, ProgressBarModule, ToastModule],
  templateUrl: './reporte-kilometrajes.component.html',
  styleUrl: '../BaseCrudComponent.component.scss'
})
export class ReporteKilometrajesComponent extends BaseMetodosCrud<IReportekilometrajes> implements AfterViewInit{
  
  @ViewChild('dt') override dt!: Table; // Referencia a la tabla

  fecha_inicio: string | null = null;
  fecha_fin: string | null = null;
  observacionSeleccionada: string | null = null;
  reporte: IReportekilometrajes[] = [];
  error: string = '';

  listaFiltrada: IReportekilometrajes[] = [];

  listaTipos = [
    { observacion: 'Alquilada', nombre: 'Alquilada' },
    { observacion: 'Beta', nombre: 'Beta' }
  ];


  constructor(protected override modeloService: ReporteKilometrajesService){
    super(modeloService);
  }

  ngAfterViewInit(): void {
    //
  }

  override getData(): void {
    this.cargando = true;
    this.modeloService.getAll().subscribe(
      (data) => {
        //console.log();
        this.lista = data; //Guardamos los datos sin filtrar
        this.listaFiltrada = [...data];  // Inicializamos la lista filtrada con todos los datos
        //this.aplicarFiltros(); // <- aquí aplicamos filtros locales
        this.cargando = false;
      },
      (error) => {
        console.error('Error al cargar los datos', error);
        this.cargando = false;
      }
    );
  }

  aplicarFiltros() {
    this.modeloService.listarReporteKilometrajeFiltrado(this.observacionSeleccionada, this.fecha_inicio, this.fecha_fin)
    .subscribe( 
      (data) => {

        //("Observaciones", this.observacionSeleccionada);
        //console.log("Fecha Inicio", this.fecha_inicio);
        //console.log("Fecha Fin", this.fecha_fin);
        //console.log("filtro del backend", data);
        this.listaFiltrada = data; //Asignamos los datos obtenidos sin filtro
        this.error = '';
      },
      
      (error) => {
        this.error = 'Hubo error al obtener los datos';
        console.error(error);
      }
    );
    // ("Observaciones", this.observacionSeleccionada);
    // console.log("Fecha Inicio", this.fecha_inicio);
    // console.log("Fecha Fin", this.fecha_fin);
  }

  // aplicarFiltros(): void {
  //   console.log('Observación seleccionada:', this.observacionSeleccionada);
  //   this.listaFiltrada = this.lista.filter(item => {
  //     const fechaItem = new Date(item.fecha_crea);
  //     // Si fechaInicio está definida, filtramos por fechaInicio
  //     const matchFechaInicio = this.fechaInicio ? fechaItem >= this.fechaInicio : true;
  //     // Si fechaFin está definida, filtramos por fechaFin
  //     const matchFechaFin = this.fechaFin ? fechaItem <= this.fechaFin : true;
  //     // Filtrar por observación seleccionada
  //     const matchObservacion = this.observacionSeleccionada
  //       ? item.observacion === this.observacionSeleccionada
  //       : true;

  //       console.log('Filtro aplicado:', matchFechaInicio, matchFechaFin, matchObservacion);
  //     // Devuelve verdadero si el elemento cumple con todos los filtros
  //     return matchFechaInicio && matchFechaFin && matchObservacion;
      
  //   });
  // }

  override exportCSV() {
    this.dt.exportCSV(); // Método integrado de PrimeNG para exportar
  }

  exportExcel() {

    // Crear una instancia de DatePipe para formatear las fechas
    const datePipe = new DatePipe('es'); 

    // Crear la hoja de trabajo (worksheet)
    const data = this.dt.value.map(entidad => [
      datePipe.transform(entidad.fecha_crea, 'dd MMM yy, HH:mm'), 
      entidad.numero, entidad.kilometraje, entidad.kilometraje_faltante,
      entidad.nombre_tipo_vehiculo, entidad.first_name, entidad.nombre_area, entidad.jefatura_nombre,
      entidad.placa, entidad.color, entidad.modelo, entidad.fabricacion, entidad.numero_serie,
      entidad.numero_motor, entidad.observacion
    ]);

    // Definir los encabezados
    const headers = [
      'Fecha', 'N° Moto', 'Kilometraje', 'Km Faltante', 'Movilidad', 'Conductor',
      'Área', 'Jefe', 'Placa', 'Color', 'Modelo', 'Fabricación', 'N° Serie',
      'N° Motor', 'Adquisición'
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
      'Fecha', 'N° Moto', 'Km', 'Km Faltante', 'Movilidad', 'Conductor',
      'Área', 'Jefe', 'Placa', 'Color', 'Modelo', 'Fabric.', 'N° Serie',
      'N° Motor', 'Adqui.'
    ];

    // Crear una instancia de DatePipe para formatear las fechas
    const datePipe = new DatePipe('es');

    const rows = this.dt.value.map(entidad => [
      datePipe.transform(entidad.fecha_crea, 'dd MMM yy, HH:mm'), // Formato de fecha
      entidad.numero, entidad.kilometraje, entidad.kilometraje_faltante,
      entidad.nombre_tipo_vehiculo, entidad.first_name, entidad.nombre_area, entidad.jefatura_nombre,
      entidad.placa, entidad.color, entidad.modelo, entidad.fabricacion, entidad.numero_serie,
      entidad.numero_motor, entidad.observacion
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
