import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';
import { decryptNumber } from 'src/app/utils/encrypt';
import { listaGestion } from 'src/app/utils/fecha-hora';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificacion-pago-lista',
  templateUrl: './verificacion-pago-lista.component.html',
  styleUrls: ['./verificacion-pago-lista.component.css']
})
export class VerificacionPagoListaComponent implements OnInit {

  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  url:string = globals.url;
  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  showModalVerificacion:boolean = false;
  showModalAgregarPagoComprobante:boolean = false;

  corte10:any = 0;
  corte20:any = 0;
  corte50:any = 0;
  corte100:any = 0;
  corte200:any = 0;
  corteDolar1:any = 0;
  corteDolar2:any = 0;
  corteDolar5:any = 0;
  corteDolar10:any = 0;
  corteDolar20:any = 0;
  corteDolar50:any = 0;
  corteDolar100:any = 0;

  subTotal10:any = 0;
  subTotal20:any = 0;
  subTotal50:any = 0;
  subTotal100:any = 0;
  subTotal200:any = 0;
  subTotalDolar1:any = 0;
  subTotalDolar2:any = 0;
  subTotalDolar5:any = 0;
  subTotalDolar10:any = 0;
  subTotalDolar20:any = 0;
  subTotalDolar50:any = 0;
  subTotalDolar100:any = 0;

  subTotalBolivianos:any = 0;
  subTotalDolares:any = 0;
  totalBolivianos:any = 0;
  totalDolares:any = 0;

  opcionCorteOcultar:number = 0;

  glosa:any = "";
  monto:any = 0;
  moneda:any = "Bolivianos";
  nombre_origen:any = "";
  cuenta_origen:any = "";
  banco_origen:any = "";
  cuenta_destino:any = "";
  banco_destino:any = "";

  id_clientePago:any = '0';
  id_vehiculoPago:any = '0';

  id_cliente:any = '0';
  id_vehiculo:any = '0';

  id_sucursal:string = '';

  mes:any;
  gestionActual:any;
  rangoUno:string = ""
  rangoDos:string = ""
  fecha_inicio:string = ""
  fecha_final:string = ""
  enviar_fecha_inicio:string = ""
  enviar_fecha_final:string = ""

  id_usuario:string='0';

  datosGestion:any = []
  datosUsuario:any = []

  datosClientePago:any = [];
  datosVehiculoPago:any = [];

  datosCliente:any = [];
  datosVehiculos:any = [];

  listaVenta:any;

  id_venta_pago_seleccionado:string = '';

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private servicioSucursal: ServicioSucursalService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Sucursales") != undefined){
      this.url = globals.url;  
      this.id_sucursal = decryptNumber(this.route.snapshot.paramMap.get("id_sucursal"));
      this.servicioSucursal.setIdSucursal(this.id_sucursal);
      
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        lengthMenu : [10, 25, 50],
        processing: true,
        language: {
          url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json"
        }
      };

      this.listaUsuarioByEmpresa();
      
      this.listaVehiculosGeneralByEstado();
      this.listaClientesByEstado();

      this.datosGestion = listaGestion();
      this.gestionActual = this.datosGestion[ this.datosGestion.length - 1 ]["gestion"]
      this.id_usuario = "0"
      this.rangoUno = "Mes"
      this.rangoDos = "Año"
      this.mes = (Number(new Date().getMonth()) +1)
      this.fecha_inicio = this.gestionActual + "-" + this.mes + "-" + new Date().getDate()
      this.fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate()
      
      this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
      this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
      setTimeout(()=>{
      
        this.listaPagosRealizadosVehiculoByFiltros();  

      }, 100);
      
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

  click_AbrirAgregarPago(){
    this.corte10 =0;
    this.corte20 =0;
    this.corte50 =0;
    this.corte100 =0;
    this.corte200 =0;
    this.corteDolar1 =0;
    this.corteDolar2 =0;
    this.corteDolar5 =0;
    this.corteDolar10 =0;
    this.corteDolar20 =0;
    this.corteDolar50 =0;
    this.corteDolar100 =0;
    this.id_clientePago = '0';
    this.id_vehiculoPago = '0';
    this.showModalAgregarPagoComprobante = true;
  }

  clickRbMes() {
    this.rangoUno = "Mes"
    this.rangoDos = "Año"
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();

    let elemento:any = document.querySelector("#divFechaInicio");
    elemento.style.display = 'none';
    elemento = document.querySelector("#divFechaFinal");
    elemento.style.display = 'none';
    elemento = document.querySelector("#cbMes");
    elemento.style.display = 'flex';
    elemento = document.querySelector("#cbGestion");
    elemento.style.display = 'flex';

    this.listaPagosRealizadosVehiculoByFiltros();
  }

  clickRbFecha() {
    this.rangoUno = "Fecha Inicio"
    this.rangoDos = "Fecha Final"
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;

    let elemento:any = document.querySelector("#cbMes");
    elemento.style.display = 'none';
    elemento = document.querySelector("#cbGestion");
    elemento.style.display = 'none';
    elemento = document.querySelector("#divFechaInicio");
    elemento.style.display = 'flex';
    elemento = document.querySelector("#divFechaFinal");
    elemento.style.display = 'flex';

    this.listaPagosRealizadosVehiculoByFiltros();
  }

  changeMes() {
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
    this.listaPagosRealizadosVehiculoByFiltros();
  }

  changeGestion() {
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
    this.listaPagosRealizadosVehiculoByFiltros();
  }

  changeFechaInicio() {
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;
    this.listaPagosRealizadosVehiculoByFiltros();
  }

  changeFechaFinal() {
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;
    this.listaPagosRealizadosVehiculoByFiltros();
  }

  changeUsuario() {
    this.listaPagosRealizadosVehiculoByFiltros();
  }

  calcularTotal(){
    this.subTotal10 = 10 * parseInt(this.corte10);
    this.subTotal20 = 20 * parseInt(this.corte20);
    this.subTotal50 = 50 * parseInt(this.corte50);
    this.subTotal100 = 100 * parseInt(this.corte100);
    this.subTotal200 = 200 * parseInt(this.corte200);
    
    this.subTotalDolar1 = 1 * parseInt(this.corteDolar1);
    this.subTotalDolar2 = 2 * parseInt(this.corteDolar2);
    this.subTotalDolar5 = 5 * parseInt(this.corteDolar5);
    this.subTotalDolar10 = 10 * parseInt(this.corteDolar10);
    this.subTotalDolar20 = 20 * parseInt(this.corteDolar20);
    this.subTotalDolar50 = 50 * parseInt(this.corteDolar50);
    this.subTotalDolar100 = 100 * parseInt(this.corteDolar100);

    this.subTotalBolivianos = parseInt(this.subTotal10) + parseInt(this.subTotal20) + parseInt(this.subTotal50) + parseInt(this.subTotal100) + parseInt(this.subTotal200)
    this.subTotalDolares = parseInt(this.subTotalDolar1) + parseInt(this.subTotalDolar2) + parseInt(this.subTotalDolar5) + parseInt(this.subTotalDolar10) + parseInt(this.subTotalDolar20) + parseInt(this.subTotalDolar50) + parseInt(this.subTotalDolar100)
  }

  listaUsuarioByEmpresa() {
    let parametros = {
      "estado": 1
    };
    this.http.post(this.url+"usuario/listaUsuarioByEstado", parametros).subscribe((datos_recibidos:any) => {
      this.datosUsuario = datos_recibidos.datos;
    });
  }

  actualizarVentaVerificacionDatosById(_id:string)
  {
    Swal.fire({title: 'Actualizando registro. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "verificado": 1,
      "id_usuario_verificado": localStorage.getItem('id_usuario'),
      "id": _id
    };
    this.http.post(this.url+"vehiculo/actualizarVehiculoPagoVerificacion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.listaPagosRealizadosVehiculoByFiltros();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  agregarVehiculoPago()
  {
    if(this.glosa == ""){
      Swal.fire("Error en validación", "Debe agregar concepto o detalle de registro. . .", "warning");
    }else if(this.id_cliente == ""){
      Swal.fire("Error en validación", "Debe seleccionar un cliente para realizar el registro de pago . .", "warning");
    }else if(this.id_vehiculo == ""){
      Swal.fire("Error en validación", "Debe Seleccionar un vehiculo para realizar el registro de pago. . .", "warning");
    }else if(this.monto <=0){
      Swal.fire("Error en validación", "El monto para el pago no puede ser menor o igual a cero. . .", "warning");
    }else{
      Swal.fire({title: 'Registrando comprobante Pago. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      let parametros = {
        "id_vehiculo": this.id_vehiculoPago,
        "id_cliente": this.id_clientePago,
        "id_usuario":localStorage.getItem('id_usuario'),
        "id_sucursal": this.id_sucursal,
        "concepto": this.glosa,
        "corte_boliviano_10": this.corte10,
        "corte_boliviano_20": this.corte20,
        "corte_boliviano_50": this.corte50,
        "corte_boliviano_100": this.corte100,
        "corte_boliviano_200": this.corte200,
        "corte_dolar_1": this.corteDolar1,
        "corte_dolar_2": this.corteDolar2,
        "corte_dolar_5": this.corteDolar5,
        "corte_dolar_10": this.corteDolar10,
        "corte_dolar_20": this.corteDolar20,
        "corte_dolar_50": this.corteDolar50,
        "corte_dolar_100": this.corteDolar100,
        "glosa": this.glosa,
        "monto": this.monto,
        "moneda": this.moneda,
        "nombre_origen": this.nombre_origen,
        "cuenta_origen": this.cuenta_origen,
        "banco_origen": this.banco_origen,
        "cuenta_destino": this.cuenta_destino,
        "banco_destino": this.banco_destino,
        "subtotal": this.monto
      };
      this.http.post(this.url+"vehiculo/agregarVehiculoPago", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
  
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.listaPagosRealizadosVehiculoByFiltros();
              this.cerrarModal.nativeElement.click();
              this.showModalVerificacion = false;
            }
          }else{
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }else{
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });
    }    
  }
  
  listaVehiculosGeneralByEstado()
  {
    Swal.fire({title: 'Buscando vehiculos. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": "1"
    };
    this.http.post(this.url+"vehiculo/listaVehiculosGeneralByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.datosVehiculos = datos;
          this.datosVehiculoPago = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaClientesByEstado()
  {
    Swal.fire({title: 'Buscando Clientes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": "1"
    };
    this.http.post(this.url+"cliente/listaClientesByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.datosCliente = datos;
          this.datosClientePago = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaPagosRealizadosVehiculoByFiltros()
  {
    Swal.fire({title: 'Buscando registros de venta. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_sucursal":  this.id_sucursal,
      "estado": 1,
      "fecha_inicio": this.enviar_fecha_inicio,
      "fecha_fin": this.enviar_fecha_final,
      "usuarios": this.id_usuario,
      "clientes": this.id_cliente,
      "vehiculos": this.id_vehiculo
    };
    
    this.http.post(this.url+"vehiculo/listaPagosRealizadosVehiculoByFiltros", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaVenta = datos;

          for(let i = 0; i<= this.listaVenta.length-1;i++){
            this.listaVenta[i].estado_verificacion = datos[i].verificado==1?"Verificado":'No Verificado';
          }

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10,
              lengthMenu : [10, 25, 50],
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

  reporteDetallePagosDetalleByVehiculoPago(_idVehiculoPago:string) {
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
    const params = new HttpParams({
      fromObject: {
      "id_vehiculo_pago": _idVehiculoPago, 
      "id_sucursal": this.id_sucursal,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
    });

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"vehiculo/reporteDetallePagosDetalleByVehiculoPago", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
      var blob = new Blob([datos_recibidos], { type: "application/pdf" });
      var url = window.URL.createObjectURL(blob);
      var pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert('Please disable your Pop-up blocker and try again.');
      }
      //const fileName = 'reporte_comora.pdf';
      //FileSaver.saveAs(blob, fileName);
      Swal.close();
    });
  }

}
