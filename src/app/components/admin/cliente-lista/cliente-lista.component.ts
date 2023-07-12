import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css']
})
export class ClienteListaComponent implements OnInit, AfterViewInit, OnDestroy {
  url:string = globals.url;
  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  tipo:any = "";
  tipo_literal:any = "";

  tipoLista:any = "";
  listaClientes:any[] = [];

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(localStorage.getItem("Importacion") != undefined){
      this.url = globals.url;
      this.tipo = this.route.snapshot.paramMap.get("tipo");
      if(this.tipo == "1"){
        this.tipo_literal = "Auto Venta";
      }
      if(this.tipo == "2"){
        this.tipo_literal = "Importación";
      }

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
        if(localStorage.getItem("Clientes - Todos") != undefined){
          this.listaClientesByEstado()
          this.tipoLista = "Todos los clientes en el sistema"
        }else{
          this.listaClientesByUsuarioEstado();
          this.tipoLista = "Clientes registrados solo por el usuario de la actual cuenta"
        }
      }, 150);
      

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

  click_agregarCliente(){
    this.router.navigate(['/cliente/agregar', this.tipo]);
  }

  click_perfilCliente(id_cliente:any, tipo:any){
    if(tipo == "1"){
      this.router.navigate(['/cliente/perfil-venta', id_cliente]);
    }
    if(tipo == "2"){
      this.router.navigate(['/cliente/perfil', id_cliente]);
    }
  }

  click_whatsapp(celular:any){
    window.open("https://api.whatsapp.com/send?phone=591" + celular, "_blank");
  }

  listaClientesByEstado()
  {
    let _tipo = "2"
    if(this.tipo == "1"){
      _tipo = "0,1"
    }
    
    Swal.fire({title: 'Buscando Clientes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_sucursal": localStorage.getItem("sucursal"),
      "tipo": _tipo,
      "estado": "1"
    };
    this.http.post(this.url+"cliente/listaClientesByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaClientes = datos;

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

  listaClientesByUsuarioEstado()
  {
    Swal.fire({title: 'Buscando Clientes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_usuario": localStorage.getItem("id_usuario"),
      "id_sucursal": localStorage.getItem("sucursal"),
      "tipo": this.tipo,
      "estado": "1"
    };
    this.http.post(this.url+"cliente/listaClientesByUsuarioEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaClientes = datos;

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
