import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { encryptNumber } from 'src/app/utils/encrypt';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taller-lista',
  templateUrl: './taller-lista.component.html',
  styleUrls: ['./taller-lista.component.css']
})
export class TallerListaComponent implements OnInit {

  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  url:string = globals.url;

  showModalAgregarTaller:boolean = false;
  showModalActualizarTaller:boolean = false;

  id_taller:string = '';
  nombre:string = '';
  propietario:string = '';
  direccion:string = '';

  listaTaller:any;

  constructor(private router:Router, private http:HttpClient, private route:ActivatedRoute) { }

  ngOnInit(): void {
    if(localStorage.getItem("Talleres") != undefined){
      
      this.listaTalleresByEstado();
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  click_agregarTaller(){
    this.nombre = '';
    this.propietario = '';
    this.direccion = '';
    this.showModalAgregarTaller = true;
  }

  click_actualizarTaller(_id:string, _nombre:string, _propietario:string, _direccion:string){
    this.id_taller = _id;
    this.nombre = _nombre;
    this.propietario = _propietario;
    this.direccion = _direccion;
    this.showModalActualizarTaller = true;
  }

  click_irVehiculo(_idTaller:string){
    this.router.navigate(['/taller/vehiculo', encryptNumber(_idTaller)]);
  }

  agregarTaller(){
    if(this.nombre == "")
    {
      Swal.fire("Error al validar los datos", "El campo nombre taller no puede ser vacío.", "warning");
    }else if(this.propietario == "")
    {
      Swal.fire("Error al validar los datos", "El campo descripción taller no puede ser vacío.", "warning");
    }
    else if(this.direccion == "")
    {
      Swal.fire("Error al validar los datos", "El campo dirrecion taller no puede ser vacío.", "warning");
    }
    else
    {
      let parametros = {
        "nombre": this.nombre,
        'propietario': this.propietario,
        'direccion': this.direccion
      };
  
      Swal.fire({title: 'Guardando nuevo registro',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "taller/agregarTaller", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.listaTalleresByEstado();
              this.cerrarModal.nativeElement.click();
              this.showModalAgregarTaller = false;
            }
          }
          else
          {
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }
        else
        {
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });
    }
  }

  actualizarDatosTallerById(){
    if(this.nombre == "")
    {
      Swal.fire("Error al validar los datos", "El campo nombre taller no puede ser vacío.", "warning");
    }else if(this.propietario == "")
    {
      Swal.fire("Error al validar los datos", "El campo descripción taller no puede ser vacío.", "warning");
    }
    else if(this.direccion == "")
    {
      Swal.fire("Error al validar los datos", "El campo dirrecion taller no puede ser vacío.", "warning");
    }
    else
    {
      let parametros = {
        "nombre": this.nombre,
        'propietario': this.propietario,
        'direccion': this.direccion,
        'id': this.id_taller
      };
  
      Swal.fire({title: 'Actualizando registro. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "taller/actualizarDatosTallerById", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.listaTalleresByEstado();
              this.cerrarModal.nativeElement.click();
              this.showModalActualizarTaller = false;
            }
          }
          else
          {
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }
        else
        {
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });
    }
  }

  listaTalleresByEstado(){
    Swal.fire({title: 'Buscando talleres. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = { "estado": 1 };
    this.http.post(this.url+"taller/listaTalleresByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaTaller = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
