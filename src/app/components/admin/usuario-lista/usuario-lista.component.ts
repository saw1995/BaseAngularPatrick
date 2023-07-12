import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css']
})
export class UsuarioListaComponent implements OnInit {
  url : any;
  data : any;

  lblTituloUsuario:any;

  constructor(private http: HttpClient, public router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("Usuarios") != undefined){
      this.url = globals.url;

      this.lblTituloUsuario = "Habilitados";
      this.listaUsuarioByEstado("1");
    }else{
      this.router.navigate(['/restriccion']);
    }

  }

  ngAfterViewInit(): void {
 
  }

  ngOnDestroy(): void {

  }

  agregarUsuario() {
    this.router.navigate(['/usuario/agregar']);
  }

  ver_perfil_usuario(id:string) {
    this.router.navigate(['/usuario/perfil', encryptNumber(id)]);
  }

  navegar_editar_usuario(id:string) {
    this.router.navigate(['/usuario/editar', encryptNumber(id)]);
  }

  listaUsuarioByEstado(estado:string) {
    if(estado == "1"){
      this.lblTituloUsuario = "Habilitados";
    }else{
      this.lblTituloUsuario = "Deshabilitados";
    }

    Swal.fire({title: 'Buscando usuarios',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": estado
    };

    this.http.post(this.url+"usuario/listaUsuarioByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.data = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

 

}
