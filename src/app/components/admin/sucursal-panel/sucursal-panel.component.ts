import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';


@Component({
  selector: 'app-sucursal-panel',
  templateUrl: './sucursal-panel.component.html',
  styleUrls: ['./sucursal-panel.component.css']
})
export class SucursalPanelComponent implements OnInit {
  url : any;

  id_sucursal:string = "";

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private servicioSucursal: ServicioSucursalService) { }

  ngOnInit(): void {
    this.url = globals.url;
    this.id_sucursal = decryptNumber(this.route.snapshot.paramMap.get("id_sucursal"));
    this.servicioSucursal.setIdSucursal(this.id_sucursal);
  }

}
