
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IUser, IUserPage } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AdminUsuarioDetailUnroutedComponent } from '../admin-usuario-detail-unrouted/admin-usuario-detail-unrouted.component';


@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-usuario-plist-unrouted',
  templateUrl: './admin-usuario-plist-unrouted.component.html',
  styleUrls: ['./admin-usuario-plist-unrouted.component.css']
})
export class AdminUsuarioPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  oPage: IUserPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oUserToRemove: IUser | null = null;
 

  constructor(
    private oUserAjaxService: UserAjaxService,
    public oDialogService: DialogService,
    private oConfirmationService: ConfirmationService,
    private snackBar: MatSnackBar
   
  ) { }

  ngOnInit() {
    this.getPage();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    });
  }

  search(filterValue: string): void {
    if (filterValue && filterValue.length >= 3) {
      this.oUserAjaxService.getPage(this.oPaginatorState.rows ?? 10, this.oPaginatorState.first, 'id', 'asc')
        .pipe(
          debounceTime(500),
          switchMap((data: IUserPage) => of(data))
        )
        .subscribe(
          (data: IUserPage) => {
            this.oPage = data;
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      this.oUserAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc')
        .subscribe(
          (data: IUserPage) => {
            this.oPage = data;
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  getValue(event: any): string {
    return event.target.value;
  }
  doView(u: IUser) {
    this.ref = this.oDialogService.open(AdminUsuarioDetailUnroutedComponent, {
        data: {
            id: u.id
        },
        header: 'Vista Usuario', 
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
    });
}

  getPage(): void {
    this.oUserAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IUserPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        console.log(data);
        console.log(this.oPaginatorState)
      },

      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  onPageChang(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    this.orderDirection = (this.orderDirection === "asc") ? "desc" : "asc";
    this.getPage();
  }

  ref: DynamicDialogRef | undefined;

  doRemove(user: IUser) {
    this.oConfirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      accept: () => {
        this.oUserAjaxService.removeOne(user.id).subscribe({
          next: () => {
            this.getPage();
            this.showSnackBar('Usuario eliminado exitosamente');
          },
          error: (error: any) => {
            console.error(error);
            this.showSnackBar('Error al eliminar el usuario');
          }
        });
      }
    });
  }
  

private showSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
        duration: 3000, 
        horizontalPosition: 'center', 
        verticalPosition: 'bottom' 
    });
}
}