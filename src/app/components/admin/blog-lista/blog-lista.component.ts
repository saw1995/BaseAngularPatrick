import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { encryptNumber } from 'src/app/utils/encrypt';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-lista',
  templateUrl: './blog-lista.component.html',
  styleUrls: ['./blog-lista.component.css']
})
export class BlogListaComponent implements OnInit {

  url:string = globals.url;

  listaBlog:any;

  lblTituloBlog:string = 'Habilitados';

  constructor(private router:Router, private http:HttpClient) { }

  ngOnInit(): void {
    if(localStorage.getItem("Blog") != undefined){
      
      setTimeout(()=>{
        this.listaBlogByEstado(1);
      }, 150);
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  clickNavegarAgregarblog(){
    this.router.navigate(['/blog/agregar']);
  }

  clickNavegarActualizarBlog(_idBlog:string){
    this.router.navigate(['/blog/actualizar', encryptNumber(_idBlog)]);
  }

  listaBlogByEstado(_estado:number){
    let parametros = {
      'estado': _estado
    };

    Swal.fire({title: 'Buscando contenidos creados. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "blog/listaBlogByEstado", parametros).subscribe((datos_recibidos:any) => 
    {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaBlog = datos;
          this.lblTituloBlog = _estado==1 ? 'Habilitados':'Deshabilitados';

          for(let i = 0; i<= datos.length-1; i++){
            let imagenes = datos[i].imagen.split(",");
            this.listaBlog[i].imagen_uno = imagenes[0];
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
