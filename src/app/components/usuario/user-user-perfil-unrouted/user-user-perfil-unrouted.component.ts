import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-user-perfil-unrouted',
  templateUrl: './user-user-perfil-unrouted.component.html',
  styleUrls: ['./user-user-perfil-unrouted.component.css']
})
export class UserUserPerfilUnroutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }



}
