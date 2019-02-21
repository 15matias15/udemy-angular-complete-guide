import { NgModule } from '@angular/core';

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        SignupComponent,
        SigninComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        SharedModule
    ]
})

export class AuthModule { }
