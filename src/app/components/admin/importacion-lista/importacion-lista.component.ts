import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';
import { decryptNumber, encryptNumber } from 'src/app/utils/encrypt';
import { listaGestion } from 'src/app/utils/fecha-hora';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-importacion-lista',
  templateUrl: './importacion-lista.component.html',
  styleUrls: ['./importacion-lista.component.css']
})
export class ImportacionListaComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  url:string = globals.url;
  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  id_sucursal:any;

  datosGestion:any = []
  datosUsuario:any = []

  listaImportacion:any;

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private servicioSucursal: ServicioSucursalService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Importacion") != undefined){
      this.url = globals.url;  
      this.id_sucursal = localStorage.getItem("sucursal");
      //this.servicioSucursal.setIdSucursal(this.id_sucursal);
      
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
        this.listaImportacionByIdSucursal();
      }, 500);
      
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

  click_agregarImportacion(){
    this.router.navigate(['/importacion/agregar/', encryptNumber(this.id_sucursal)]);
  }

  click_nevagarImportacionDetalle(id_vehiculo:string){
    this.router.navigate(['/importacion/detalle/', encryptNumber(id_vehiculo)]);
  }

  listaImportacionByIdSucursal()
  {
    Swal.fire({title: 'Buscando registros de importacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_sucursal": this.id_sucursal,
      "estado": "1"
    };
    this.http.post(this.url+"importacion/listaImportacionByIdSucursal", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaImportacion = datos;
          console.log(this.listaImportacion)
          for(let i=0;i<this.listaImportacion.length;i++){
            let imagenes = this.listaImportacion[i].foto_vehiculo.split(",");
            this.listaImportacion[i].foto = imagenes;
            this.listaImportacion[i].foto_uno = imagenes[0];
          }
          
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

  reporteImportacionesGeneral() {
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    //id_sucursal, estado, fecha_inicio, fecha_fin, id_usuario, id_usuario_impresion
    const params = new HttpParams({
      fromObject: {
      "id_sucursal": this.id_sucursal,
      "estado": 1,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
    });

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"importacion/reporteImportacionesGeneral", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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
