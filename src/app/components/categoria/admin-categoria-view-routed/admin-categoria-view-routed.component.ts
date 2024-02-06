import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-categoria-view-routed',
  templateUrl: './admin-categoria-view-routed.component.html',
  styleUrls: ['./admin-categoria-view-routed.component.css']
})
export class AdminCategoriaViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }

}
