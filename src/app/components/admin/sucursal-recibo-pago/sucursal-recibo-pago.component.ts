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
  selector: 'app-sucursal-recibo-pago',
  templateUrl: './sucursal-recibo-pago.component.html',
  styleUrls: ['./sucursal-recibo-pago.component.css']
})
export class SucursalReciboPagoComponent implements OnInit {

  @ViewChild('cerrarModalVerificar') cerrarModalVerificar:any = ElementRef;
  @ViewChild('cerrarModalReciboDetalle') cerrarModalReciboDetalle:any = ElementRef;
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

  listaRecibo:any = []
  id_recibo:any = "";

  totalVerificado:any = 0.00;
  totalNoVerificado:any = 0.00;
  total:any = 0.00;

  nro_recibo:any = '';
  recibo_verificado:any = '';
  total_recibo:any = '';
  detalle_recibo:any = '';
  tipo_recibo:any = '';
  tipo_pago:any = '';
  observacion_recibo:any = '';
  usuario_verificado_recibo:any = '';
  fecha_verificado_recibo:any = '';
  hora_verificado_recibo:any = '';
  usuario_recibo:any = '';
  fecha_recibo:any = '';
  hora_recibo:any = '';
  respaldo:any = '';

  showModalVerificar:boolean = false;
  showModalReciboDetalle:boolean = false;
  showModalImg:boolean = false;

  imageURL:string = "";
  viewerOpen:boolean = false;

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
        this.listaReciboPagoByUsuarioSucursalFechaEstado();
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

    this.listaReciboPagoByUsuarioSucursalFechaEstado();
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

    this.listaReciboPagoByUsuarioSucursalFechaEstado();
  }

  changeMes() {
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
    this.listaReciboPagoByUsuarioSucursalFechaEstado();
  }

  changeGestion() {
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
    this.listaReciboPagoByUsuarioSucursalFechaEstado();
  }

  changeFechaInicio() {
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;
    this.listaReciboPagoByUsuarioSucursalFechaEstado();
  }

  changeFechaFinal() {
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;
    this.listaReciboPagoByUsuarioSucursalFechaEstado();
  }

  changeUsuario() {
    this.listaReciboPagoByUsuarioSucursalFechaEstado();
  }

  click_verImagen(rutaImagen:string){
    this.viewerOpen = true;
    this.imageURL = this.url + rutaImagen;
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
    this.id_recibo = id;
    this.showModalVerificar = true;
  }

  click_abrirReciboDetalle(id:any){
    this.id_recibo = id;
    this.showModalReciboDetalle = true;
    this.reciboPagoById();
  }

  actualizarVerificacion(){

    Swal.fire({title: 'Actualizando Estado',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "verificado": "1",
      "id_usuario": localStorage.getItem("id_usuario"),
      "id": this.id_recibo
    };

    this.http.post(this.url+"recibo/actualizarVerificacion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.id_recibo = "";
          this.cerrarModalVerificar.nativeElement.click();
          this.showModalVerificar = false;
          this.listaReciboPagoByUsuarioSucursalFechaEstado()

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
  
  reciboPagoById(){

    Swal.fire({title: 'Buscando Recibo de Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_recibo_pago": this.id_recibo
    };
    this.http.post(this.url+"recibo/reciboPagoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.length > 0){
            this.id_recibo = datos[0]["id"];
            this.nro_recibo = datos[0]["nro_recibo_pago"];
            this.fecha_recibo = datos[0]["fecha"];
            this.hora_recibo = datos[0]["hora"];
            this.usuario_recibo = datos[0]["usuario"];
            this.total_recibo = datos[0]["total"];
            this.detalle_recibo = datos[0]["detalle"];
            this.observacion_recibo = datos[0]["observacion"];
            this.tipo_pago = datos[0]["tipo_pago"];
            this.tipo_recibo = datos[0]["tipo"];
            this.fecha_verificado_recibo = datos[0]["fecha_verificado"];
            this.hora_verificado_recibo = datos[0]["hora_verificado"];
            this.usuario_verificado_recibo = datos[0]["usuario_verificado"];
            this.respaldo = datos[0]["respaldo"];
            if(datos[0]["id_usuario_verificado"] == '1'){
              this.fecha_verificado_recibo = "- - -";
              this.hora_verificado_recibo = "- - -";
              this.usuario_verificado_recibo = "- - -";
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

  listaReciboPagoByUsuarioSucursalFechaEstado(){

    Swal.fire({title: 'Buscando Recibos de Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_sucursal": this.id_sucursal,
      "id_usuario": this.id_usuario,
      "fecha_inicio": this.enviar_fecha_inicio,
      "fecha_fin": this.enviar_fecha_final,
      "estado": "1"
    };
    this.http.post(this.url+"recibo/listaReciboPagoByUsuarioSucursalFechaEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaRecibo = datos;

          this.total = 0.0;
          this.totalVerificado = 0.0;
          this.totalNoVerificado = 0.0;

          for(let i=0; i<this.listaRecibo.length; i++){
            if(this.listaRecibo[i]["verificado"] == "1"){
              this.listaRecibo[i]["verificado_literal"] = "Verificado"
              this.totalVerificado = this.totalVerificado + parseFloat(this.listaRecibo[i]["total"]);
            }else{
              this.totalNoVerificado = this.totalNoVerificado + parseFloat(this.listaRecibo[i]["total"]);
              this.listaRecibo[i]["verificado_literal"] = "No Verificado"
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

  reporteReciboPagoById(id_recibo:any){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
      "id_recibo_pago": id_recibo,
      "id_sucursal": this.id_sucursal,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"recibo/reporteReciboPagoById", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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
