import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proceso-lista',
  templateUrl: './proceso-lista.component.html',
  styleUrls: ['./proceso-lista.component.css']
})
export class ProcesoListaComponent implements OnInit {
  @ViewChild('cerrarModalProceso') cerrarModalProceso:any = ElementRef;
  url:string = globals.url;
  
  showModalProceso:boolean = false;

  lblTitulo:string = '';
  nombre:string = '';
  monto:string = '0';

  agregarActulizar:string = '';
  id_proceso:string = '';

  listaProceso:any[] = [];
  listaProcesoModelo:any[] = [];
  listaModelo:any[] = [];

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(localStorage.getItem("Configuracion") != undefined){
      this.url = globals.url;  

      this.listaProcesoModeloByEstado();
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  click_proceso(){
    if(this.agregarActulizar == "0"){
      this.agregarProceso();
    }

    if(this.agregarActulizar == "1"){
      this.actualizarProcesoById();
    }
  }

  click_agregarProceso(){
    this.agregarActulizar = "0"
    this.lblTitulo = "AGREGAR NUEVO PROCESO"
    this.nombre = "";
    this.monto = "0";

    this.showModalProceso = true;
  }

  click_actualizarProceso(nombre:any, monto:any, id_proceso:any){
    this.agregarActulizar = "1"
    this.lblTitulo = "ACTUALIZAR PROCESO"
    this.nombre = nombre;
    this.monto = monto;
    this.id_proceso = id_proceso;

    this.showModalProceso = true;
  }

  click_subirModelo(id_proceso:any){
    let lista = this.listaProcesoModelo;
    for(let i=0; i<lista.length; i++){
      if(lista[i]["id_proceso"] == id_proceso){
        if(i == 0){
          break;
        }else{
          let a = lista[i-1]
          let b = lista[i]
          
          lista[i] = a
          lista[i-1] = b
          break;
        }
      }
    }
    this.listaProcesoModelo = lista;
  }

  click_bajarModelo(id_proceso:any){
    let lista = this.listaProcesoModelo;

    for(let i=0; i<lista.length; i++){
      if(lista[i]["id_proceso"] == id_proceso){
        if(i == lista.length-1){
          break;
        }else{
          let a = lista[i]
          let b = lista[i+1]
          
          lista[i] = b
          lista[i+1] = a
          break;
        }
      }
    }
    this.listaProcesoModelo = lista;

  }

  click_eliminarModelo(id_proceso:any){
    let lista = this.listaProcesoModelo;
    this.listaProcesoModelo = []
    for(let i=0; i<lista.length; i++){
      if(lista[i]["id_proceso"] != id_proceso){
        this.listaProcesoModelo.push(lista[i])
      }
    }
  }

  click_agregarModelo(proceso:any){
    this.listaProcesoModelo.push(proceso)
    
    let lista = this.listaProceso;
    this.listaProceso = []
    for(let i=0; i<lista.length; i++){
      if(lista[i]["id_proceso"] != proceso["id_proceso"]){
        this.listaProceso.push(lista[i])
      }
    }
  }

  actualizarProcesoModelo()
  {
    Swal.fire({
      title: '¿Esta seguro de actualizar el Modelo?',
      html: "<b></b>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Actualizar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Actualizando Modelo',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'procesos': this.listaProcesoModelo,
          'id_usuario': localStorage.getItem("id_usuario")
        };
        this.http.post(this.url+"proceso/actualizarProcesoModelo", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaProcesoModeloByEstado();
            }else{
              Swal.fire("Error en el Servidor", datosNodejs, "warning");
            }
          }else{
            Swal.fire("Error en la Base de Datos", datosMysql, "warning");
          }
        });
      }
    });
  }

  agregarProceso()
  {
    Swal.fire({
      title: '¿Esta seguro de agregar el Proceso?',
      html: "<b>Proceso:</b>" + this.nombre
          + "</br> <b>Monto:</b>" + this.monto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Agregar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Agregando Proceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'nombre': this.nombre,
          'monto': this.monto,
          'id_usuario': localStorage.getItem("id_usuario"),
          'estado': "1",
        };
        this.http.post(this.url+"proceso/agregarProceso", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaProcesoNoRegistradoByEstado();

              this.cerrarModalProceso.nativeElement.click();
              this.showModalProceso = false;
            }else{
              Swal.fire("Error en el Servidor", datosNodejs, "warning");
            }
          }else{
            Swal.fire("Error en la Base de Datos", datosMysql, "warning");
          }
        });
      }
      
    });
  }

  actualizarProcesoEstadoById(nombre_proceso:any, id_proceso:any)
  {
    this.id_proceso = id_proceso;
    Swal.fire({
      title: '¿Esta seguro de eliminar el Proceso?',
      html: "<b>Proceso:</b>" + nombre_proceso,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Eliminando Proceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'estado': "0",
          'id': this.id_proceso,
        };
        this.http.post(this.url+"proceso/actualizarProcesoEstadoById", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaProcesoNoRegistradoByEstado();
            }else{
              Swal.fire("Error en el Servidor", datosNodejs, "warning");
            }
          }else{
            Swal.fire("Error en la Base de Datos", datosMysql, "warning");
          }
        });
      }
    });
  }

  actualizarProcesoById()
  {
    Swal.fire({
      title: '¿Esta seguro de actualizar el Proceso?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Actualizar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Actualizando Proceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'nombre': this.nombre,
          'monto': this.monto,
          'id': this.id_proceso,
        };
        this.http.post(this.url+"proceso/actualizarProcesoById", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaProcesoNoRegistradoByEstado();

              this.cerrarModalProceso.nativeElement.click();
              this.showModalProceso = false;
            }else{
              Swal.fire("Error en el Servidor", datosNodejs, "warning");
            }
          }else{
            Swal.fire("Error en la Base de Datos", datosMysql, "warning");
          }
        });
      }
    });
  }

  listaProcesoModeloByEstado()
  {
    Swal.fire({title: 'Buscando Procesos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'estado': "1",
    };
    this.http.post(this.url+"proceso/listaProcesoModeloByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaProcesoModelo = datos;
          this.listaModelo = [];

          for(let i=0; i<this.listaProcesoModelo.length; i++){
            this.listaModelo.push({
              "nro": this.listaProcesoModelo[i]["nro"],
              "id_proceso": this.listaProcesoModelo[i]["id_proceso"],
            })
          }

          this.listaProcesoNoRegistradoByEstado()
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaProcesoNoRegistradoByEstado()
  {
    Swal.fire({title: 'Buscando Procesos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'estado': "1",
    };
    this.http.post(this.url+"proceso/listaProcesoNoRegistradoByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaProceso = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  

}
