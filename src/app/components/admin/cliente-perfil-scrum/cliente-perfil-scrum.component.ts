import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';

@Component({
  selector: 'app-cliente-perfil-scrum',
  templateUrl: './cliente-perfil-scrum.component.html',
  styleUrls: ['./cliente-perfil-scrum.component.css']
})
export class ClientePerfilScrumComponent implements OnInit {
  @ViewChild('cerrarModalHistoriaAgregar') cerrarModalHistoriaAgregar:any = ElementRef;
  @ViewChild('cerrarModalRespuestaAgregar') cerrarModalRespuestaAgregar:any = ElementRef;

  url:string = globals.url;
  @Input() id_cliente:any = "";

  id_vehiculo:any = "";
  id_tarea:any = "";
  id_scrum_contacto:any = "";
  id_scrum_informacion:any = "";
  id_scrum_requerimiento:any = "";
  nota_tarea:any = "";
  swRespuesta:boolean = false;

  id_scrum_involucramiento:any = "";
  id_scrum_conversion:any = "";
  id_scrum_respuesta:any = "";
  nota_respuesta:any = "";
  id_scoring:any = "";

  listaScrumTarea:any = [];
  listaScrumContacto:any = [];
  listaScrumInformacion:any = [];
  listaScrumRequerimiento:any = [];
  listaScrumInvolucramiento:any = [];
  listaScrumConversion:any = [];
  listaScrumRespuesta:any = [];
  listaVehiculos:any = [];
  
  showModalHistoriaAgregar:boolean = false;
  showModalRespuestaAgregar:boolean = false;

  constructor(private router: ActivatedRoute, private http:HttpClient, private nav:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("Clientes") != undefined){
      this.url = globals.url;

      this.listaScrumTareaByCliente();
    }else{
      this.nav.navigate(['/restriccion']);
    }
  }

  click_abrirModalHistoriaAgregar(){
    this.showModalHistoriaAgregar = true;
    this.listaScrumContactoByEstado();
  }

  click_abrirModalRespuestaAgregar(id_tarea:any){
    this.id_tarea = id_tarea;
    this.showModalRespuestaAgregar = true;
    this.listaScrumInvolucramientoByEstado();
  }

  agregarScrumTarea(){
    console.log(this.id_cliente)
    Swal.fire({title: 'Guardando nuevo registro . . .',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.id_cliente == "")
    {
      Swal.fire("Campo Vacio", "Seleccione nuevamente el cliente, intente nuevamente", "warning");
    }
    else if(this.id_scrum_contacto == '')  
    {
      Swal.fire("Campo Vacio", "Debe seleccionar el Tipo de Contacto, intente nuevamente", "warning");
    }
    else if(this.id_scrum_informacion == '')
    {
      Swal.fire("Campo Vacio", "Debe seleccionar el Tipo de Información, intente nuevamente", "warning");
    }
    else if(this.id_scrum_requerimiento == '')
    {
      Swal.fire("Campo Vacio", "Debe seleccionar el Tipo de Requerimiento, intente nuevamente", "warning");
    }
    else if(this.nota_tarea == '')
    {
      Swal.fire("Campo Vacio", "Ingrese el detalle de la nota. . .", "warning");
    }
    else
    { 
      let parametros = {
        "id_usuario": localStorage.getItem("id_usuario"),
        'id_cliente': this.id_cliente, 
        'id_usuario_respuesta': "1",
        'id_scrum_contacto': this.id_scrum_contacto,
        'id_scrum_informacion': this.id_scrum_informacion,
        'id_scrum_requerimiento': this.id_scrum_requerimiento,
        'id_scrum_involucramiento': "1",
        'id_scrum_conversion': "1",
        'id_scrum_respuesta': "1",
        'id_vehiculo': "1",
        'nota_tarea': this.nota_tarea,
        'scoring': "0",
        'estado': "1"
      };
  
      this.http.post(this.url + "scrum/agregarScrumTarea", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            this.showModalHistoriaAgregar = false;
            this.cerrarModalHistoriaAgregar.nativeElement.click();

            this.listaScrumTareaByCliente();
          }else{
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }else{
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });
    }

  }

  actualizarScrumTarea(){
    Swal.fire({title: 'Guardando nuevo registro . . .',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.id_scrum_respuesta == '')  
    {
      Swal.fire("Campo Vacio", "Debe seleccionar el Tipo de Respuesta, intente nuevamente", "warning");
    }
    else if(this.id_scrum_involucramiento == '')
    {
      Swal.fire("Campo Vacio", "Debe seleccionar el Tipo de Involucramiento, intente nuevamente", "warning");
    }
    else if(this.id_scrum_conversion == '')
    {
      Swal.fire("Campo Vacio", "Debe seleccionar el Tipo de Conversion, intente nuevamente", "warning");
    }
    else if(this.id_scoring == '')
    {
      Swal.fire("Campo Vacio", "Debe seleccionar el nivel de Respuesta, intente nuevamente", "warning");
    }
    else if(this.nota_respuesta == '')
    {
      Swal.fire("Campo Vacio", "Ingrese el detalle de la respuesta. . .", "warning");
    }
    else
    { 
      let parametros = {
        "id_usuario_respuesta": localStorage.getItem("id_usuario"),
        'id_scrum_respuesta': this.id_scrum_respuesta,
        'id_scrum_involucramiento': this.id_scrum_involucramiento, 
        'id_scrum_conversion': this.id_scrum_conversion,  
        'nota_respuesta': this.nota_respuesta,
        'scoring': this.id_scoring,
        'id_scrum_tarea': this.id_tarea
      };
  
      this.http.post(this.url + "scrum/actualizarScrumTarea", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            this.showModalRespuestaAgregar = false;
            this.cerrarModalRespuestaAgregar.nativeElement.click();

            this.listaScrumTareaByCliente();
          }else{
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }else{
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });
    }

  }
  
  listaScrumTareaByCliente(){
    Swal.fire({title: 'Buscando historias', text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"scrum/listaScrumTareaByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumTarea = datos;
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
      "filtro": "0"
    };
    this.http.post(this.url+"scrum/listaScrumContactoByEstado", parametros).subscribe((datos_recibidos:any) => {

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          this.listaScrumContacto = datos;

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
      "filtro": "0"
    };
    this.http.post(this.url+"scrum/listaScrumInformacionByEstado", parametros).subscribe((datos_recibidos:any) => {


      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          this.listaScrumInformacion = datos;

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
      "filtro": "0"
    };
    this.http.post(this.url+"scrum/listaScrumRequerimientoByEstado", parametros).subscribe((datos_recibidos:any) => {

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumRequerimiento = datos;
          
          this.listaBusquedaVehiculoByCliente();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaBusquedaVehiculoByCliente()
  {
    let parametros = {
      "estado": 1,
      "id_cliente": this.id_cliente
    };
    this.http.post(this.url+"cliente/listaBusquedaVehiculoByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaVehiculos = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaScrumInvolucramientoByEstado(){
    Swal.fire({title: 'Extrayendo Informacion', text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "estado": "1",
      "filtro": "0"
    };
    this.http.post(this.url+"scrum/listaScrumInvolucramientoByEstado", parametros).subscribe((datos_recibidos:any) => {

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumInvolucramiento = datos;
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
      "filtro": "0"
    };
    this.http.post(this.url+"scrum/listaScrumConversionByEstado", parametros).subscribe((datos_recibidos:any) => {

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumConversion = datos;
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
      "filtro": "0"
    };
    this.http.post(this.url+"scrum/listaScrumRespuestaByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaScrumRespuesta = datos;
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

}
