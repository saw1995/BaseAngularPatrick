import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';
import { encryptNumber } from 'src/app/utils/encrypt';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sucursal-lista',
  templateUrl: './sucursal-lista.component.html',
  styleUrls: ['./sucursal-lista.component.css']
})
export class SucursalListaComponent implements OnInit {

  url:string = globals.url;

  listaSucursal:any;

  constructor(private http:HttpClient, private route:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("Sucursales") != undefined){
      this.url = globals.url;

      this.listaSucursalByIdRol();
    }else{
      this.route.navigate(['/restriccion']);
    }
    
  }

  clickNavegarHaciaVerSucursal(_idSucursal:string){
    this.route.navigate(['sucursal/panel/', encryptNumber(_idSucursal)]);
  }

  clickNavegarHaciaAgregarSucursal(){
    this.route.navigate(['sucursal/agregar']);
  }

  clickNavegarHaciaActualizarSucursal(_idSucursal:string){
    this.route.navigate(['sucursal/actualizar', encryptNumber(_idSucursal)]);
  }

  listaSucursalByIdRol(){
    Swal.fire({title: 'Buscando sucursales',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "estado": 1,
      "id_rol": localStorage.getItem("id_rol")
    };

    this.http.post(this.url + "sucursal/listaSucursalByIdRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaSucursal = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

}
