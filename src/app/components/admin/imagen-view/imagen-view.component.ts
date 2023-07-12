import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-imagen-view',
  templateUrl: './imagen-view.component.html',
  styleUrls: ['./imagen-view.component.css']
})
export class ImagenViewComponent implements OnInit {

  @Input() open:boolean = false;
  @Input() imageURL:string = "";

  @Output() close = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
