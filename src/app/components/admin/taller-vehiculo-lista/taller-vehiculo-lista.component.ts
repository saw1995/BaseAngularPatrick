import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioTallerService } from 'src/app/services/servicio-taller.service';
import { decryptNumber } from 'src/app/utils/encrypt';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taller-vehiculo-lista',
  templateUrl: './taller-vehiculo-lista.component.html',
  styleUrls: ['./taller-vehiculo-lista.component.css']
})
export class TallerVehiculoListaComponent implements OnInit {
  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  url:string = globals.url;

  id_taller:any = '';
  id_taller_vehiculo:any = '';

  listaVehiculos:any = [];

  showModalAgregarGasto:boolean = false;

  id_parqueo_vehiculo_seleccionado:string = '';
  id_vehiculo_seleccionado:string ='';
  vehiculo_seleccionado:string = '';
  concepto_gasto:string = '';
  subtotal_gasto:number = 0;
  observacion_gasto:string = '';

  constructor(private route:ActivatedRoute, private serviceTaller:ServicioTallerService, private router:Router, private http:HttpClient) { }

  ngOnInit(): void {
    if(localStorage.getItem("Talleres") != undefined){
  
      this.id_taller = decryptNumber(this.route.snapshot.paramMap.get("id_taller"));
      
      setTimeout(()=>{
        this.listaVehiculosByIdTaller();
      }, 100);
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  click_agregarGastoModal(_id_parqueo_vehiculo:string, _idVehiculo:string, _clase:string, _marca:string, _tipo:string, _version:string, _anho:string){
    this.id_parqueo_vehiculo_seleccionado = _id_parqueo_vehiculo;
    this.id_vehiculo_seleccionado = _idVehiculo;
    this.vehiculo_seleccionado = _clase + ' ' + _marca + ' ' + _tipo + ' ' + _version + ' ' + _anho;

    this.showModalAgregarGasto = true;
  }

  click_tallerVehiculoDetalle(id_taller_vehiculo:any){
    this.id_taller_vehiculo = id_taller_vehiculo;
    
    this.router.navigate(['/taller/detalle', this.id_taller_vehiculo]);
  }

  listaVehiculosByIdTaller(){
    Swal.fire({title: 'Buscando recpciones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_taller": this.id_taller,
      "estado": 1
    };
    this.http.post(this.url+"taller/listaVehiculosByIdTaller", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaVehiculos = datos;
          for(let i=0;i<this.listaVehiculos.length;i++){
            let imagenes = this.listaVehiculos[i].foto.split(",");
            this.listaVehiculos[i].foto = imagenes;
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  agregarGastoVehiculo(){

    if(this.concepto_gasto == ""){
      Swal.fire("Error validación datos", 'El Campo concepto no puede estar vacío. . .', "warning");
    }
    else if(this.subtotal_gasto <= 0){
      Swal.fire("Error validación datos", 'El Campo subtotal no puede ser menor o igual a cero. . .', "warning");
    }
    else{

      Swal.fire({title: 'Registrando Reparacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
      let parametros = {
        'id_vehiculo': this.id_vehiculo_seleccionado,
        'id_usuario': localStorage.getItem('id_usuario'),
        'concepto': this.concepto_gasto,
        'subtotal': this.subtotal_gasto,
        'observacion': this.observacion_gasto,
        'foto': 'sin_imagen_gastro.jpg'
      };

      this.http.post(this.url+"vehiculo/agregarGastoVehiculo", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];

        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.showModalAgregarGasto = false;
              this.cerrarModal.nativeElement.click();
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
}
