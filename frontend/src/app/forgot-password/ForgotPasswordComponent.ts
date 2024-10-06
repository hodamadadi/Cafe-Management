import { SnackbarService } from './../services/snackbar.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { emit } from 'process';
import { GlobalConstants } from '../shared/global-constants';
import { error } from 'console';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgatPasswordForm: any = UntypedFormGroup;
  responseMessage: any;
  forgotPasswordForm: UntypedFormGroup | undefined;
  response: any;
  dialogRef: any;
  SnackbarService: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
    });
  }
  handleSubmit() {
    this.ngxService.start();
    var formData = this.forgotPasswordForm?.value;
    var data = {
      email: formData.email,
    };
    this.userService.forgotPassword(data).subscribe(
      (Response: any) => {
        this.ngxService.stop();
        this.responseMessage = this.response?.message;
        this.dialogRef.close();
        this.SnackbarService.openSnackBar(this.responseMessage, ' ');
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.SnackbarService.openSnackBar(
          this.responseMessage,
          GlobalConstants.genericError
        );
      }
    );
  }
}