import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';
import { listaGestion } from 'src/app/utils/fecha-hora';

@Component({
  selector: 'app-recepcion-lista',
  templateUrl: './recepcion-lista.component.html',
  styleUrls: ['./recepcion-lista.component.css']
})
export class RecepcionListaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  url:string = globals.url;
  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  id_sucursal:any;

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

  listaRecepcion:any[] = [];

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
        this.listaRecepcionByIdSucursal();
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

    this.listaRecepcionByIdSucursal();
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

    this.listaRecepcionByIdSucursal();
  }

  changeMes() {
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
    this.listaRecepcionByIdSucursal();
  }

  changeGestion() {
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
    this.listaRecepcionByIdSucursal();
  }

  changeFechaInicio() {
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;
    this.listaRecepcionByIdSucursal();
  }

  changeFechaFinal() {
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;
    this.listaRecepcionByIdSucursal();
  }

  changeUsuario() {
    this.listaRecepcionByIdSucursal();
  }

  listaUsuarioByEmpresa() {
    let parametros = {
      "estado": 1
    };
    this.http.post(this.url+"usuario/listaUsuarioByEstado", parametros).subscribe((datos_recibidos:any) => {
      this.datosUsuario = datos_recibidos.datos;
    });
  }

  click_agregarRecepcion(){
    this.router.navigate(['/sucursal/recepcion/agregar/', encryptNumber(this.id_sucursal)]);
  }

  click_seleccionRecepcion(id_recepcion:string){
    id_recepcion = id_recepcion + "";
    this.router.navigate(['/sucursal/recepcion/detalle/', encryptNumber(this.id_sucursal), encryptNumber(id_recepcion)]);
  }

  listaRecepcionByIdSucursal()
  {
    Swal.fire({title: 'Buscando recpciones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_sucursal": this.id_sucursal,
      "estado": 1,
      "id_usuario": this.id_usuario,
      "fecha_inicio": this.enviar_fecha_inicio,
      "fecha_fin": this.enviar_fecha_final
    };
    this.http.post(this.url+"recepcion/listaRecepcionByIdSucursal", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaRecepcion = datos;
          
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

  reporteListaVentaBySucursalFechaUsuario() {
    /*Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
    const params = new HttpParams({
      fromObject: {
      "id_sucursal": '',
      "id_empresa": localStorage.getItem("id_empresa") || "",
      "estado": 1,
      "fecha_inicio": this.enviar_fecha_inicio,
      "fecha_final": this.enviar_fecha_final,
      "tipo_venta": '',
      "id_usuario": '',
      "id_usuario_pre_venta": '',
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
    });

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"venta/reporteListaVentaBySucursalFechaUsuario", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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
    */
  }


}
