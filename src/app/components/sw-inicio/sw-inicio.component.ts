import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sw-inicio',
  templateUrl: './sw-inicio.component.html',
  styleUrls: ['./sw-inicio.component.css']
})
export class SwInicioComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  navegar(){
    this.router.navigate(['/login']);
  }

}
