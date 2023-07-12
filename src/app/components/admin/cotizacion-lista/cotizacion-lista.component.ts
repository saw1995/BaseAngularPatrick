import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cotizacion-lista',
  templateUrl: './cotizacion-lista.component.html',
  styleUrls: ['./cotizacion-lista.component.css']
})
export class CotizacionListaComponent implements OnInit, AfterViewInit, OnDestroy {
  url:string = globals.url;

  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  showModalProceso:boolean = false;

  listaCotizacion:any = [];
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

      this.listaCotizacionByEstado();
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

  click_cotizacionDetalle(id_cotizacion:any){
    this.router.navigate(['/cotizacion/detalle', id_cotizacion]);
  }

  listaCotizacionByEstado()
  {
    Swal.fire({title: 'Buscando Cotizaciones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'estado': "1",
    };
    this.http.post(this.url+"cotizacion/listaCotizacionByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaCotizacion = datos;
          for(let i=0;i<this.listaCotizacion.length;i++){
            let imagenes = this.listaCotizacion[i].foto_vehiculo.split(",");
            this.listaCotizacion[i].foto = imagenes;
            this.listaCotizacion[i].foto_uno = imagenes[0];
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

}
