import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { ServicioParqueoService } from 'src/app/services/servicio-parqueo.service';


@Component({
  selector: 'app-parqueo-panel',
  templateUrl: './parqueo-panel.component.html',
  styleUrls: ['./parqueo-panel.component.css']
})
export class ParqueoPanelComponent implements OnInit {

  url : any;

  id_sucursal:string = "1"
  id_parqueo:string = '';

  capacidad:number = 0;

  listaParqueo:any = []
  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private servicioparqueo: ServicioParqueoService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Sucursales") != undefined){
      this.url = globals.url;
      this.id_parqueo = decryptNumber(this.route.snapshot.paramMap.get("id_parqueo"));
      this.servicioparqueo.setIdParqueo(this.id_parqueo);
      
      this.parqueoById()
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  parqueoById(){
    Swal.fire({title: 'Extrayendo informacion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    let parametros = {
      'id_parqueo': this.id_parqueo
    };

    this.http.post(this.url+"parqueo/parqueoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaParqueo = datos;
          
          this.capacidad = this.listaParqueo[0].capacidad;

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
