import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUser } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-user-user-detail-unrouted',
  templateUrl: './user-user-detail-unrouted.component.html',
  styleUrls: ['./user-user-detail-unrouted.component.css']
})
export class UserUserDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;

  oUser: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;

  constructor(
    private oUserAjaxService: UserAjaxService,
    @Optional() public ref:DynamicDialogRef,
    @Optional() public config:DynamicDialogConfig
  ) {     
    if (config){
      if (config.data){
        this.id = config.data.id;
      }
    }    
  }

  ngOnInit() {
    console.log(this.id);
    this.getOne();
  }

  getOne(): void {
    this.oUserAjaxService.getOne(this.id).subscribe({    
      next: (data: IUser) => {
        this.oUser = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }

}
