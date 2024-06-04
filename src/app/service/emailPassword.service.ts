import { Observable } from 'rxjs';

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EmailValuesDto } from '../model/model.emailDto';
import { ChangePasswordDto } from '../model/model.changePassword';


@Injectable({
  providedIn: "root"
})

export class EmailPasswordService {  
    constructor(
        private oHttpClient: HttpClient
    ) { 

    }

     changePasswordUrl: string = "/initial/email/";

    public sendEmail(oEmailValuesDto: EmailValuesDto): Observable<any>{
        return this.oHttpClient.post<any>(this.changePasswordUrl + 'recover-password', oEmailValuesDto);
    }

    public changePassword(oEmailValuesDto: ChangePasswordDto): Observable<any>{
        return this.oHttpClient.post<any>(this.changePasswordUrl + 'change-password', oEmailValuesDto);
    }

}