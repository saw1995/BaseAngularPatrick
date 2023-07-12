import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';
import { decryptNumber } from 'src/app/utils/encrypt';
import { listaGestion } from 'src/app/utils/fecha-hora';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sucursal-devolucion-pago',
  templateUrl: './sucursal-devolucion-pago.component.html',
  styleUrls: ['./sucursal-devolucion-pago.component.css']
})
export class SucursalDevolucionPagoComponent implements OnInit {

  @ViewChild('cerrarModalVerificar') cerrarModalVerificar:any = ElementRef;
  @ViewChild('cerrarModalDevolucionDetalle') cerrarModalDevolucionDetalle:any = ElementRef;
  url:string = globals.url;
  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

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

  listaDevolucion:any = []
  id_devolucion:any = "";

  totalVerificado:any = 0.00;
  totalNoVerificado:any = 0.00;
  total:any = 0.00;

  nro_devolucion:any = '';
  devolucion_verificado:any = '';
  total_devolucion:any = '';
  detalle_devolucion:any = '';
  tipo_devolucion:any = '';
  tipo_pago:any = '';
  observacion_devolucion:any = '';
  usuario_verificado_devolucion:any = '';
  fecha_verificado_devolucion:any = '';
  hora_verificado_devolucion:any = '';
  usuario_devolucion:any = '';
  fecha_devolucion:any = '';
  hora_devolucion:any = '';

  showModalVerificar:boolean = false;
  showModalDevolucionDetalle:boolean = false;

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
        this.listaDevolucionPagoByUsuarioSucursalFechaEstado();
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

    this.listaDevolucionPagoByUsuarioSucursalFechaEstado();
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

    this.listaDevolucionPagoByUsuarioSucursalFechaEstado();
  }

  changeMes() {
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
    this.listaDevolucionPagoByUsuarioSucursalFechaEstado();
  }

  changeGestion() {
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
    this.listaDevolucionPagoByUsuarioSucursalFechaEstado();
  }

  changeFechaInicio() {
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;
    this.listaDevolucionPagoByUsuarioSucursalFechaEstado();
  }

  changeFechaFinal() {
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;
    this.listaDevolucionPagoByUsuarioSucursalFechaEstado();
  }

  changeUsuario() {
    this.listaDevolucionPagoByUsuarioSucursalFechaEstado();
  }

  listaUsuarioByEmpresa() {
    let parametros = {
      "estado": 1
    };
    this.http.post(this.url+"usuario/listaUsuarioByEstado", parametros).subscribe((datos_recibidos:any) => {
      this.datosUsuario = datos_recibidos.datos;
    });
  }

  click_abrirVerificar(id:any){
    this.id_devolucion = id;
    this.showModalVerificar = true;
  }

  click_abrirDevolucionDetalle(id:any){
    this.id_devolucion = id;
    this.showModalDevolucionDetalle = true;
    this.devolucionPagoById();
  }

  actualizarVerificacion(){

    Swal.fire({title: 'Actualizando Estado',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "verificado": "1",
      "id_usuario": localStorage.getItem("id_usuario"),
      "id": this.id_devolucion
    };

    this.http.post(this.url+"devolucionpago/actualizarVerificacion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.id_devolucion = "";
          this.cerrarModalVerificar.nativeElement.click();
          this.showModalVerificar = false;
          this.listaDevolucionPagoByUsuarioSucursalFechaEstado()

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
  
  devolucionPagoById(){

    Swal.fire({title: 'Buscando Devolucion de Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_devolucion_pago": this.id_devolucion
    };
    this.http.post(this.url+"devolucionpago/devolucionPagoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.length > 0){
            this.id_devolucion = datos[0]["id"];
            this.nro_devolucion = datos[0]["nro_devolucion_pago"];
            this.fecha_devolucion = datos[0]["fecha"];
            this.hora_devolucion = datos[0]["hora"];
            this.usuario_devolucion = datos[0]["usuario"];
            this.total_devolucion = datos[0]["total"];
            this.detalle_devolucion = datos[0]["detalle"];
            this.observacion_devolucion = datos[0]["observacion"];
            this.tipo_pago = datos[0]["tipo_pago"];
            this.tipo_devolucion = datos[0]["tipo"];
            this.fecha_verificado_devolucion = datos[0]["fecha_verificado"];
            this.hora_verificado_devolucion = datos[0]["hora_verificado"];
            this.usuario_verificado_devolucion = datos[0]["usuario_verificado"];

            if(datos[0]["id_usuario_verificado"] == '1'){
              this.fecha_verificado_devolucion = "- - -";
              this.hora_verificado_devolucion = "- - -";
              this.usuario_verificado_devolucion = "- - -";
            }

          }
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaDevolucionPagoByUsuarioSucursalFechaEstado(){

    Swal.fire({title: 'Buscando Devolucions de Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_sucursal": this.id_sucursal,
      "id_usuario": this.id_usuario,
      "fecha_inicio": this.enviar_fecha_inicio,
      "fecha_fin": this.enviar_fecha_final,
      "estado": "1"
    };
    this.http.post(this.url+"devolucionpago/listaDevolucionPagoByUsuarioSucursalFechaEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaDevolucion = datos;

          this.total = 0.0;
          this.totalVerificado = 0.0;
          this.totalNoVerificado = 0.0;

          for(let i=0; i<this.listaDevolucion.length; i++){
            if(this.listaDevolucion[i]["verificado"] == "1"){
              this.listaDevolucion[i]["verificado_literal"] = "Verificado"
              this.totalVerificado = this.totalVerificado + parseFloat(this.listaDevolucion[i]["total"]);
            }else{
              this.totalNoVerificado = this.totalNoVerificado + parseFloat(this.listaDevolucion[i]["total"]);
              this.listaDevolucion[i]["verificado_literal"] = "No Verificado"
            }
          }
          this.total = parseFloat(this.totalVerificado) + parseFloat(this.totalNoVerificado);
                    
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

  reporteDevolucionPagoById(id_devolucion:any){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
      "id_devolucion_pago": id_devolucion,
      "id_sucursal": this.id_sucursal,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"devolucionpago/reporteDevolucionPagoById", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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
