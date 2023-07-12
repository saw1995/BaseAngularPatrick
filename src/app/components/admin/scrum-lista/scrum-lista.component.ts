import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';

@Component({
  selector: 'app-scrum-lista',
  templateUrl: './scrum-lista.component.html',
  styleUrls: ['./scrum-lista.component.css']
})
export class ScrumListaComponent implements OnInit {
  url:string = globals.url;

  id_scrum_contacto:any = "";
  id_scrum_informacion:any = "";
  id_scrum_requerimiento:any = "";
  id_scrum_involucramiento:any = "";
  id_scrum_conversion:any = "";
  id_scrum_respuesta:any = "";
  id_scoring:any = "";
  todos_scoring:any = "'1','2','3','4'";

  fecha_de:any = "";
  fecha_hasta:any = "";
  lblBusqueda:any = "No se realizo la busqueda";

  listaScrumTarea:any = [];
  listaScrumContacto:any = [];
  listaScrumInformacion:any = [];
  listaScrumRequerimiento:any = [];
  listaScrumInvolucramiento:any = [];
  listaScrumConversion:any = [];
  listaScrumRespuesta:any = [];

  constructor(private router: ActivatedRoute, private http:HttpClient, private nav:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("Historias") != undefined){
      this.url = globals.url;

      const date = new Date();
      const fechaDia = (date.getDate()+"").length == 1 ? "0" + date.getDate() : date.getDate();
      const fechaMes = ((date.getMonth()+1)+"").length == 1 ? "0" + (date.getMonth()+1) : (date.getMonth()+1);
      const fecha = date.getFullYear()+"-"+fechaMes+"-"+fechaDia;

      this.fecha_de = fecha;
      this.fecha_hasta = fecha;
      this.id_scoring = this.todos_scoring;

      this.listaScrumContactoByEstado();
    }else{
      this.nav.navigate(['/restriccion']);
    }
  }

  listaScrumTareaByFiltro(){
    Swal.fire({title: 'Buscando historias', text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "fecha_de": this.fecha_de,
      "fecha_hasta": this.fecha_hasta,
      "id_scrum_contacto": this.id_scrum_contacto,
      "id_scrum_informacion": this.id_scrum_informacion,
      "id_scrum_requerimiento": this.id_scrum_requerimiento,
      "id_scrum_involucramiento": this.id_scrum_involucramiento,
      "id_scrum_conversion": this.id_scrum_conversion,
      "id_scrum_respuesta": this.id_scrum_respuesta,
      "id_scoring": this.id_scoring,
      "estado": "1"
    };
    this.http.post(this.url+"scrum/listaScrumTareaByFiltro", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumTarea = datos;
          this.lblBusqueda = this.listaScrumTarea.length + " Resultado(s) encontado(s)";

          console.log(this.listaScrumTarea);
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaScrumContactoByEstado(){

    Swal.fire({title: 'Extrayendo Informacion', text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": "1",
      "filtro": "1"
    };
    this.http.post(this.url+"scrum/listaScrumContactoByEstado", parametros).subscribe((datos_recibidos:any) => {

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumContacto = datos;
          this.id_scrum_contacto = this.listaScrumContacto[this.listaScrumContacto.length-1]["id_scrum_contacto"];

          this.listaScrumInformacionByEstado();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaScrumInformacionByEstado(){

    let parametros = {
      "estado": "1",
      "filtro": "1"
    };
    this.http.post(this.url+"scrum/listaScrumInformacionByEstado", parametros).subscribe((datos_recibidos:any) => {


      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumInformacion = datos;
          this.id_scrum_informacion = this.listaScrumInformacion[this.listaScrumInformacion.length-1]["id_scrum_informacion"];

          this.listaScrumRequerimientoByEstado();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaScrumRequerimientoByEstado(){
    let parametros = {
      "estado": "1",
      "filtro": "1"
    };
    this.http.post(this.url+"scrum/listaScrumRequerimientoByEstado", parametros).subscribe((datos_recibidos:any) => {

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumRequerimiento = datos;
          this.id_scrum_requerimiento = this.listaScrumRequerimiento[this.listaScrumRequerimiento.length-1]["id_scrum_requerimiento"];

          this.listaScrumInvolucramientoByEstado();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaScrumInvolucramientoByEstado(){
    let parametros = {
      "estado": "1",
      "filtro": "1"
    };
    this.http.post(this.url+"scrum/listaScrumInvolucramientoByEstado", parametros).subscribe((datos_recibidos:any) => {

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumInvolucramiento = datos;
          this.id_scrum_involucramiento = this.listaScrumInvolucramiento[this.listaScrumInvolucramiento.length-1]["id_scrum_involucramiento"];

          this.listaScrumConversionByEstado();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaScrumConversionByEstado(){
    let parametros = {
      "estado": "1",
      "filtro": "1"
    };
    this.http.post(this.url+"scrum/listaScrumConversionByEstado", parametros).subscribe((datos_recibidos:any) => {

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumConversion = datos;
          this.id_scrum_conversion = this.listaScrumConversion[this.listaScrumConversion.length-1]["id_scrum_conversion"];

          this.listaScrumRespuestaByEstado();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaScrumRespuestaByEstado(){
    let parametros = {
      "estado": "1",
      "filtro": "1"
    };
    this.http.post(this.url+"scrum/listaScrumRespuestaByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumRespuesta = datos;
          this.id_scrum_respuesta = this.listaScrumRespuesta[this.listaScrumRespuesta.length-1]["id_scrum_respuesta"];

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
