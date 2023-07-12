import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';

@Component({
  selector: 'app-cliente-perfil-venta',
  templateUrl: './cliente-perfil-venta.component.html',
  styleUrls: ['./cliente-perfil-venta.component.css']
})
export class ClientePerfilVentaComponent implements OnInit {

  url:string = globals.url;

  id_cliente:any = "";
  id_sucursal:any = '';
  ci:string  = '';
  expedicion:string = '';
  genero:string = '';
  nombre:string = '';
  apellido_paterno:string = '';
  apellido_materno:string = '';
  correo:string = '';
  telefono:string = '';
  departamento:string = '';
  direccion:string = '';
  foto:string = 'sin_imagen_cliente.jpg';
  usuario:string = '';
  cliente_usuario:string = '';
  fecha:string = '';
  hora:string = '';
  
  listaVehiculos:any = [];
  constructor(private router: ActivatedRoute, private http:HttpClient, private nav:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("Clientes") != undefined){
      this.url = globals.url;
      this.id_cliente = this.router.snapshot.paramMap.get("id_cliente");

      this.clienteById();
    }else{
      this.nav.navigate(['/restriccion']);
    }
  }

  click_agregarVehiculo(){
    this.nav.navigate(['/vehiculo/agregar', "0", this.id_cliente]);
  }

  click_vehiculoPerfil(id_vehiculo:any){

  }

  clienteById(){
    Swal.fire({title: 'Buscando cliente',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"cliente/clienteById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.id_sucursal = datos[0].id_sucursal;
          this.ci = datos[0].ci;
          this.expedicion = datos[0].ci_exp;
          this.nombre = datos[0].nombre;
          this.apellido_paterno = datos[0].appat;
          this.apellido_materno = datos[0].apmat;
          this.genero = datos[0].genero;
          this.correo = datos[0].email;
          this.telefono = datos[0].celular;
          this.departamento = datos[0].departamento;
          this.direccion = datos[0].direccion;
          this.foto = datos[0].foto;
          this.cliente_usuario = datos[0].cliente_usuario;
          this.usuario = datos[0].usuario;
          this.fecha = datos[0].fecha;
          this.hora = datos[0].hora;
        
          this.listaVehiculoByTipoCliente();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaVehiculoByTipoCliente()
  {
    Swal.fire({title: 'Buscando Vehiculos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "tipo": "0,4",
      "id_cliente": this.id_cliente
    };
    this.http.post(this.url+"cliente/listaVehiculoByTipoCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaVehiculos = datos;
          for(let i=0; i<this.listaVehiculos.length; i++){
            let imagenes = this.listaVehiculos[i].foto.split(",");
            this.listaVehiculos[i].foto = imagenes;
            this.listaVehiculos[i].foto_uno = imagenes[0];
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
