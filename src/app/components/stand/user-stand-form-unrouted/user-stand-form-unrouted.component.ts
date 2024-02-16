import { UserAjaxService } from './../../../service/user.ajax.service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DynamicDialogRef, DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IStand, IUser, formOperation } from 'src/app/model/model.interfaces';
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';
import { MediaService } from 'src/app/service/media.service';
import { MessageService } from 'primeng/api'; // Import the MessageService

@Component({
  selector: 'app-user-stand-form-unrouted',
  templateUrl: './user-stand-form-unrouted.component.html',
  styleUrls: ['./user-stand-form-unrouted.component.css'],
  providers: [MessageService]
})
export class UserStandFormUnroutedComponent implements OnInit {

 
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';
  selectedImageUrl: string | undefined;
  standForm!: FormGroup;
  oStand: IStand = {} as IStand;
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;
  id_usuario: number | undefined;
  id_categoria: number | undefined;
  usuario: IUser | undefined;
  stand: IStand = { usuario: { id: 0 }, categoria: { id: 0 } } as IStand;
  constructor(
    private formBuilder: FormBuilder,
    private standService: StandAjaxService, // Asegúrate de usar el servicio correcto
    private router: Router,
    private snackBar: MatSnackBar,
    public oDialogService: DialogService,
    private MediaService: MediaService,
    public oDynamicDialogConfig: DynamicDialogConfig,
    private messageService: MessageService ,
    private oUserAjaxService: UserAjaxService,
  ) {
    this.initializeForm(this.oStand);
    this.id_usuario = this.oDynamicDialogConfig.data.id_usuario;
    console.log(this.id_usuario)
    this.id_categoria=9;
   
  }

  ngOnInit() {
    if(this.id_usuario !== undefined) {
      this.oUserAjaxService.getOne(this.id_usuario).subscribe({
        next:(usuario: IUser) => {
          this.usuario = usuario;
          console.log(this.usuario)
        },
        error: (error) => {
          this.status = error
          this.messageService.add({ severity: 'error',detail: 'No se puede crear la valoración',  life: 2000});
        }
      });
    
    }
    
   
    
    this.initializeForm(this.stand);
  }
  
  initializeForm(oStand: IStand) {
    this.standForm = this.formBuilder.group({
      id: [oStand.id],
      nombre: [oStand.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      descripcion: [oStand.descripcion, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      velocidad: [oStand.velocidad || 'D'], // Default value 'D' if oStand.velocidad is falsy
      alcance: [oStand.alcance || 'D'],     // Default value 'D' if oStand.alcance is falsy
      poder: [oStand.poder || 'D'],         // Default value 'D' if oStand.poder is falsy
      aguante: [oStand.aguante || 'D'],     // Default value 'D' if oStand.aguante is falsy
      acierto: [oStand.acierto || 'D'],  
      imagen: [oStand.imagen, Validators.required],
     desarollo: [oStand.desarollo || 'D']
      // Agrega aquí los demás campos según tu modelo
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.standForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.standForm.valid) {
      const stand = this.standForm.value;
      stand.usuario = this.usuario;
      stand.categoria = { id: 9 }; // Initialize categoria object with id 9
      console.log("iD USUARIO: " + stand.usuario.id);
      console.log("ID CATEGORIA: " + stand.categoria.id);
  
      // Use 'stand' object instead of 'this.standForm.value'
      this.standService.newOne(stand).subscribe({
        next: (data: any) => {
          this.oStand = data;
          this.initializeForm(this.oStand);
          this.snackBar.open('La opinión se ha creado correctamente', '', { duration: 2000 });
          this.snackBar.dismiss();
          this.router.navigate(['/home']);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.snackBar.open('Error al crear la opinión', '', { duration: 2000 });
        }
      });
    }
  }
  


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      this.MediaService.uploadFile(formData).subscribe({
        next: (response) => {
          this.selectedImageUrl = response.url; // Asignar la URL del archivo seleccionado
          this.oStand.imagen = response.url;
          this.standForm.controls['imagen'].patchValue(response.url);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.snackBar.open('Error al subir la imagen', '', { duration: 2000 });
        }
      });
}
  }

}