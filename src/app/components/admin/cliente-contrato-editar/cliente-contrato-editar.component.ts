import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from 'src/app/utils/encrypt';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
//var htmlToPdfmake = require("html-to-pdfmake");
import htmlToPdfmake from 'html-to-pdfmake';
    
@Component({
  selector: 'app-cliente-contrato-editar',
  templateUrl: './cliente-contrato-editar.component.html',
  styleUrls: ['./cliente-contrato-editar.component.css']
})
export class ClienteContratoEditarComponent implements OnInit {
  url:string = globals.url;

  id_contrato:any = "";

  listaContrato:any[] = [];

  json:any = '';
  ckeditorContent: string = '';

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.url = globals.url;
    this.id_contrato = decryptNumber(this.route.snapshot.paramMap.get("id_contrato"));

    this.contratoById()
  }

  actualizarContratoById(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
    this.json = htmlToPdfmake(this.ckeditorContent)
    this.json = JSON.stringify(this.json)
    
    let parametros = {
      "html": this.ckeditorContent,
      "json": this.json,
      "id": this.id_contrato
    };
    this.http.post(this.url+"contrato/actualizarContratoById", parametros).subscribe((datos_recibidos:any) => {
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

  contratoById()
  {
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_contrato": this.id_contrato
    };
    this.http.post(this.url+"contrato/contratoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaContrato = datos;

          if(this.listaContrato.length > 0){
            this.id_contrato = this.listaContrato[0]["id"];
            this.ckeditorContent = this.listaContrato[0]["html"];
          }

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  reporteContratoById(){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
      "id_contrato": this.id_contrato,
      "id_sucursal": localStorage.getItem("sucursal") || "",
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"contrato/reporteContratoById", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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
