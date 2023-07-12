import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioTallerService } from 'src/app/services/servicio-taller.service';
import { decryptNumber, encryptNumber } from 'src/app/utils/encrypt';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taller-modulo',
  templateUrl: './taller-modulo.component.html',
  styleUrls: ['./taller-modulo.component.css']
})
export class TallerModuloComponent implements OnInit {
  url:string = globals.url;

  id_taller:string = ''
  nombre_taller:string = '';
  descripcion_taller:string = '';

  constructor(private http:HttpClient, private route:ActivatedRoute, private servicioTaller:ServicioTallerService, private router:Router) { }

  ngOnInit(): void {

    if(localStorage.getItem("Talleres") != undefined){
      this.id_taller = decryptNumber(this.route.snapshot.paramMap.get("id_taller"));
      this.servicioTaller.setIdTaller(this.id_taller);
      setTimeout(()=>{
        this.tallerById();
      }, 100);
      
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  click_navegarHaciVehiculo(){
    this.router.navigate(['/taller/' + encryptNumber(this.id_taller) + '/vehiculos']);
  }

  click_navegarNuevaRecepcion(){
    this.router.navigate(['/taller/' + encryptNumber(this.id_taller) + '/recepcion']);
  }

  tallerById(){
    Swal.fire({title: 'Buscando talleres. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = { "id": this.id_taller };
    this.http.post(this.url+"taller/tallerById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.id_taller = datos[0].id;
          this.nombre_taller = datos[0].nombre;
          this.descripcion_taller = datos[0].propietario + " - " + datos[0].direccion;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
