import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cotizacion-detalle',
  templateUrl: './cotizacion-detalle.component.html',
  styleUrls: ['./cotizacion-detalle.component.css']
})
export class CotizacionDetalleComponent implements OnInit {
  @ViewChild('cerrarModalProceso') cerrarModalProceso:any = ElementRef;
  @ViewChild('cerrarModalRepuesto') cerrarModalRepuesto:any = ElementRef;
  url:string = globals.url;
  
  showModalProceso:boolean = false;
  showModalRepuesto:boolean = false;
  
  id_cotizacion:any = '';
  id_vehiculo:any = '';

  id_proceso:string = '';
  nombre:string = '';
  monto:string = '';
  observacion:string = '';
  totalRepuesto:any = 0.00;
  totalDetalle:any = 0.00;
  total:any = 0.00;

  id_repuesto:string = '';
  nombre_repuesto:string = '';
  costo:string = '';
  detalle:string = '';

  listaProceso:any[] = [];
  listaDetalle:any[] = [];
  listaDetalleRepuesto:any[] = [];
  listaRepuesto:any[] = [];
  listaModelo:any[] = [];

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.url = globals.url;
    this.id_cotizacion = this.route.snapshot.paramMap.get("id_cotizacion");

    this.cotizacionById()
  }

  click_agregarProceso(){

    this.listaProcesoModeloByEstado();
  }

  click_agregarRepuesto(){
    this.id_repuesto = "";
    this.nombre_repuesto = "";
    this.costo = "";
    this.detalle = "";

    this.showModalRepuesto = true;

    this.listaRepuestoByVehiculo();
  }

  clicl_agregarRepuesto(){
    if(this.id_repuesto == ""){
      this.agregarRepuesto();
    }else{
      this.agregarCotizacionRepuesto();
    }
  }

  change_montoProceso(){
    for(let i=0; i<this.listaProceso.length; i++){
      if(this.listaProceso[i]["id"] == this.id_proceso){
        this.nombre = this.listaProceso[i]["nombre"]
        this.monto = this.listaProceso[i]["monto"]
        break;
      }
    }
  }

  change_repuesto(){
    for(let i=0; i<this.listaRepuesto.length; i++){
      if(this.listaRepuesto[i]["id_repuesto"] == this.id_repuesto){
        this.nombre_repuesto = this.listaRepuesto[i]["nombre"]
        this.costo = this.listaRepuesto[i]["precio"]
        this.detalle = this.listaRepuesto[i]["detalle"]
        break;
      }
    }
  }

  agregarRepuesto(){
    Swal.fire({
      title: '¿Esta seguro de agregar un nuevo repuesto?',
      html: "<b>Repuesto:</b>" + this.nombre_repuesto
          + "</br> <b>Costo:</b>" + this.costo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Agregar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Agregando Repuesto',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'id_vehiculo': this.id_vehiculo,
          'nombre': this.nombre_repuesto,
          'detalle': this.detalle,
          'precio': this.costo,
          'id_usuario': localStorage.getItem("id_usuario"),
          'estado': "1",
        };
        this.http.post(this.url+"repuesto/agregarRepuesto", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.id_repuesto = datos["id_repuesto"]

              this.agregarCotizacionRepuesto();
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

  agregarCotizacionRepuesto(){
    Swal.fire({
      title: '¿Esta seguro de agregar el repuesto a la Cotizacion?',
      html: "<b>Repuesto:</b>" + this.nombre_repuesto
          + "</br> <b>Costo:</b>" + this.costo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Agregar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Agregando Repuesto',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'id_cotizacion': this.id_cotizacion,
          'id_repuesto': this.id_repuesto,
          'costo': this.costo,
          'observacion': this.detalle,
          'id_usuario': localStorage.getItem("id_usuario"),
          'estado': "1",
        };
        this.http.post(this.url+"cotizacion/agregarCotizacionRepuesto", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaCotizacionRepuestoByEstado()

              this.cerrarModalRepuesto.nativeElement.click();
              this.showModalRepuesto = false;
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

  agregarCotizacionDetalle(){
    Swal.fire({
      title: '¿Esta seguro de agregar el Proceso?',
      html: "<b></b>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Agregar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Agregando Proceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'id_cotizacion': this.id_cotizacion,
          'procesos': this.listaModelo,
          'id_usuario': localStorage.getItem("id_usuario"),
          'estado': "1",
        };
        this.http.post(this.url+"cotizacion/agregarCotizacionDetalle", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaCotizacionDetalleByEstado()

              /*this.cerrarModalProceso.nativeElement.click();
              this.showModalProceso = false;*/
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

  cotizacionById(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cotizacion": this.id_cotizacion
    };
    this.http.post(this.url+"cotizacion/cotizacionById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.id_vehiculo = datos[0]["id_vehiculo"]

          this.listaCotizacionDetalleByEstado()
          this.listaCotizacionRepuestoByEstado();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaProcesoModeloByEstado()
  {
    Swal.fire({title: 'Buscando Procesos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'estado': "1",
    };
    this.http.post(this.url+"proceso/listaProcesoModeloByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaModelo = datos;

          let elemento:any = document.querySelector("#tablaModelo");
          elemento.style.display = 'block';
          elemento = document.querySelector("#btnActualizarProceso");
          elemento.style.display = 'block';
          elemento = document.querySelector("#btnAgregarProceso");
          elemento.style.display = 'none';

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaCotizacionDetalleByEstado(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cotizacion": this.id_cotizacion,
      "estado": "1"
    };
    this.http.post(this.url+"cotizacion/listaCotizacionDetalleByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaDetalle = datos;
          
          if(this.listaDetalle.length > 0){
            let elemento:any = document.querySelector("#tablaDetalle");
            elemento.style.display = 'block';
            elemento = document.querySelector("#tablaModelo");
            elemento.style.display = 'none';
            elemento = document.querySelector("#btnActualizarProceso");
            elemento.style.display = 'none';

            this.totalDetalle = 0.00;
            for(let i=0; i<this.listaDetalle.length; i++){
              this.totalDetalle = this.totalDetalle + this.listaDetalle[i]["monto"]
            }
  
            this.total = parseFloat(this.totalDetalle) + parseFloat(this.totalRepuesto)
          }else{
            let elemento:any = document.querySelector("#btnAgregarProceso");
            elemento.style.display = 'block';
          }
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaCotizacionRepuestoByEstado(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cotizacion": this.id_cotizacion,
      "estado": "1"
    };
    this.http.post(this.url+"cotizacion/listaCotizacionRepuestoByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaDetalleRepuesto = datos;

          this.totalRepuesto = 0.00;
          for(let i=0; i<this.listaDetalleRepuesto.length; i++){
            this.totalRepuesto = this.totalRepuesto + this.listaDetalleRepuesto[i]["costo"]
          }
          this.total = parseFloat(this.totalDetalle) + parseFloat(this.totalRepuesto)
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaRepuestoByVehiculo(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo,
      "estado": "1"
    };
    this.http.post(this.url+"repuesto/listaRepuestoByVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaRepuesto = datos;
          console.log(this.listaRepuesto)
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaProcesoNoRegistradoByCotizacion(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cotizacion": this.id_cotizacion,
      "estado": "1"
    };
    this.http.post(this.url+"cotizacion/listaProcesoNoRegistradoByCotizacion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaProceso = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  reporteCotizacionDetalleByEstado(){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
        "id_cotizacion": this.id_cotizacion,
        "estado": "1",
        "id_sucursal": localStorage.getItem("sucursal") || "",
        "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"cotizacion/reporteCotizacionDetalleByEstado", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
      var blob = new Blob([datos_recibidos], { type: "application/pdf" });
      var url = window.URL.createObjectURL(blob);
      var pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert('Please disable your Pop-up blocker and try again.');
      }
      /*const fileName = 'reporte_comora.pdf';
      FileSaver.saveAs(blob, fileName);*/
      Swal.close();
    });
  }
}
