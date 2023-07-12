import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
//var htmlToPdfmake = require("html-to-pdfmake");
import htmlToPdfmake from 'html-to-pdfmake';
    

@Component({
  selector: 'app-adenda-editar',
  templateUrl: './adenda-editar.component.html',
  styleUrls: ['./adenda-editar.component.css']
})
export class AdendaEditarComponent implements OnInit {
  url:string = globals.url;

  listaParrafo:any[] = [];
  id_adenda_parrafo:any = "";

  json:any = '';
  ckeditorContent: string = '';

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.url = globals.url;

    this.listaAdendaParrafoByEstado()
  }

  generarVistaPrevia(){

  }

  actualizarAdendaParrafoById(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
    this.json = htmlToPdfmake(this.ckeditorContent)
    this.json = JSON.stringify(this.json)

    let parametros = {
      "html": this.ckeditorContent,
      "json": this.json,
      "id_usuario": localStorage.getItem("id_usuario"),
      "id": this.id_adenda_parrafo
    };
    this.http.post(this.url+"adenda/actualizarAdendaParrafoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaAdendaParrafoByEstado()
  {
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": "1"
    };
    this.http.post(this.url+"adenda/listaAdendaParrafoByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaParrafo = datos;

          if(this.listaParrafo.length > 0){
            this.id_adenda_parrafo = this.listaParrafo[0]["id"];
            this.ckeditorContent = this.listaParrafo[0]["html"];
          }

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  reporteAdendaPrevio(){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
      "id_sucursal": localStorage.getItem("sucursal") || "",
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"adenda/reporteAdendaPrevio", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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
