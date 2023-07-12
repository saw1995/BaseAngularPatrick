import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-repuesto-lista',
  templateUrl: './repuesto-lista.component.html',
  styleUrls: ['./repuesto-lista.component.css']
})
export class RepuestoListaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cerrarModalProceso') cerrarModalProceso:any = ElementRef;
  url:string = globals.url;
  
  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  showModalProceso:boolean = false;

  lblTitulo:string = '';
  nombre:string = '';
  monto:string = '0';

  agregarActulizar:string = '';
  id_proceso:string = '';

  listaRepuesto:any[] = [];
  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(localStorage.getItem("Configuracion") != undefined){
      this.url = globals.url;  

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 50,
        lengthMenu : [50, 100, 200],
        processing: true,
        language: {
          url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json"
        }
      };

      setTimeout(()=>{
        this.listaRepuestoByEstado();
      }, 500)
      
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  click_proceso(){
    if(this.agregarActulizar == "0"){
      this.agregarProceso();
    }

    if(this.agregarActulizar == "1"){
      this.actualizarProcesoById();
    }
  }

  click_agregarProceso(){
    this.agregarActulizar = "0"
    this.lblTitulo = "AGREGAR NUEVO PROCESO"
    this.nombre = "";
    this.monto = "0";

    this.showModalProceso = true;
  }

  click_actualizarProceso(nombre:any, monto:any, id_proceso:any){
    this.agregarActulizar = "1"
    this.lblTitulo = "ACTUALIZAR PROCESO"
    this.nombre = nombre;
    this.monto = monto;
    this.id_proceso = id_proceso;

    this.showModalProceso = true;
  }

  agregarProceso()
  {
    Swal.fire({
      title: '¿Esta seguro de agregar el Proceso?',
      html: "<b>Proceso:</b>" + this.nombre
          + "</br> <b>Monto:</b>" + this.monto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Agregar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Agregando Proceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'nombre': this.nombre,
          'monto': this.monto,
          'id_usuario': localStorage.getItem("id_usuario"),
          'estado': "1",
        };
        this.http.post(this.url+"proceso/agregarProceso", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaRepuestoByEstado();

              this.cerrarModalProceso.nativeElement.click();
              this.showModalProceso = false;
            }else{
              Swal.fire("Error en el Servidor", datosNodejs, "warning");
            }
          }else{
            Swal.fire("Error en la Base de Datos", datosMysql, "warning");
          }
        });
      }
      
    });
  }

  actualizarProcesoEstadoById(nombre_proceso:any, id_proceso:any)
  {
    this.id_proceso = id_proceso;
    Swal.fire({
      title: '¿Esta seguro de eliminar el Proceso?',
      html: "<b>Proceso:</b>" + nombre_proceso,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Eliminando Proceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'estado': "0",
          'id': this.id_proceso,
        };
        this.http.post(this.url+"proceso/actualizarProcesoEstadoById", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaRepuestoByEstado();
            }else{
              Swal.fire("Error en el Servidor", datosNodejs, "warning");
            }
          }else{
            Swal.fire("Error en la Base de Datos", datosMysql, "warning");
          }
        });
      }
    });
  }

  actualizarProcesoById()
  {
    Swal.fire({
      title: '¿Esta seguro de actualizar el Proceso?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Actualizar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Actualizando Proceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'nombre': this.nombre,
          'monto': this.monto,
          'id': this.id_proceso,
        };
        this.http.post(this.url+"proceso/actualizarProcesoById", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaRepuestoByEstado();

              this.cerrarModalProceso.nativeElement.click();
              this.showModalProceso = false;
            }else{
              Swal.fire("Error en el Servidor", datosNodejs, "warning");
            }
          }else{
            Swal.fire("Error en la Base de Datos", datosMysql, "warning");
          }
        });
      }
    });
  }

  listaRepuestoByEstado()
  {
    Swal.fire({title: 'Buscando Repuestos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'estado': "1",
    };
    this.http.post(this.url+"repuesto/listaRepuestoByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaRepuesto = datos;

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
  
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 50,
              lengthMenu : [50, 100, 200],
              processing: true,
              language: {
                url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json"
              }
            };
            this.dtTrigger.next(this.dtOptions);
            });
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

}

