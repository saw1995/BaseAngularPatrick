import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ServicioTallerService } from 'src/app/services/servicio-taller.service';
import { encryptNumber } from 'src/app/utils/encrypt';
import { listaGestion } from 'src/app/utils/fecha-hora';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taller-recepcion-importacion',
  templateUrl: './taller-recepcion-importacion.component.html',
  styleUrls: ['./taller-recepcion-importacion.component.css']
})
export class TallerRecepcionImportacionComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  url:string = globals.url;
  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  id_sucursal:any;

  listaRececepcionVehiculos:any[] = [];

  id_taller:string = '';

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

  constructor(private router:Router, private serviceTaller:ServicioTallerService, private http:HttpClient) { }

  ngOnInit(): void {
    if(localStorage.getItem("Talleres") != undefined){
  
      this.id_taller = this.serviceTaller.getIdTaller();

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
        this.listaRecepcionTallerVehiculosByImportacion();
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

    this.listaRecepcionTallerVehiculosByImportacion();
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

    this.listaRecepcionTallerVehiculosByImportacion();
  }

  changeMes() {
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
    this.listaRecepcionTallerVehiculosByImportacion();
  }

  changeGestion() {
    this.enviar_fecha_inicio = this.gestionActual + "-" + this.mes + "-" + "01";
    this.enviar_fecha_final = this.gestionActual + "-" + this.mes + "-" + new Date(this.gestionActual, this.mes, 0).getDate();
    this.listaRecepcionTallerVehiculosByImportacion();
  }

  changeFechaInicio() {
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;
    this.listaRecepcionTallerVehiculosByImportacion();
  }

  changeFechaFinal() {
    this.enviar_fecha_inicio = this.fecha_inicio;
    this.enviar_fecha_final = this.fecha_final;
    this.listaRecepcionTallerVehiculosByImportacion();
  }

  changeUsuario() {
    this.listaRecepcionTallerVehiculosByImportacion();
  }

  listaUsuarioByEmpresa() {
    let parametros = {
      "estado": 1
    };
    this.http.post(this.url+"usuario/listaUsuarioByEstado", parametros).subscribe((datos_recibidos:any) => {
      this.datosUsuario = datos_recibidos.datos;
    });
  }

  click_navegarAgregarRecepcion(){
    this.router.navigate(['/taller/' + encryptNumber(this.id_taller) + '/recepcion/agregar']);
  }


  listaRecepcionTallerVehiculosByImportacion()
  {
    Swal.fire({title: 'Buscando recpciones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_taller": this.id_taller,
      "estado": 1,
      "id_usuario": this.id_usuario,
      "fecha_inicio": this.enviar_fecha_inicio,
      "fecha_fin":this.enviar_fecha_final
    };
    this.http.post(this.url+"taller/listaRecepcionTallerVehiculosByImportacion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaRececepcionVehiculos = datos;
          
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

  reporteRecepcionTallerVehiculosByImportacion() {
    //reporteRecepcionTallerVehiculosByImportacion(id_taller, estado, id_usuario, fecha_inicio, fecha_fin, id_sucursal, id_usuario_impresion)
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
    const params = new HttpParams({
      fromObject: {
      "id_taller": this.id_taller,
      "estado": 1,
      "id_usuario": this.id_usuario,
      "fecha_inicio": this.enviar_fecha_inicio,
      "fecha_fin": this.enviar_fecha_final,
      "id_sucursal": '1',
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
    });

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"taller/reporteRecepcionTallerVehiculosByImportacion", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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
