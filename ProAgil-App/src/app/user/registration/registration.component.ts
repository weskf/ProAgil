import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
 // registerForm: FormGroup;
 user: User;
 registerForm = new FormGroup({
  fullname: new FormControl(),
    email: new FormControl(),
    username: new FormControl(),
    passwords: new FormGroup({
      password: new FormControl(),
      confirmPassword: new FormControl()  
    })    
  });

  constructor(private authService: AuthService
            , public router: Router
            , private fb: FormBuilder
            , private toastr: ToastrService) { 
              this.validation();  
            }

  ngOnInit() {

  }

  public validation(){
    this.registerForm = this.fb.group({
      fullname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        passwords: this.fb.group({
          password: ['', [Validators.required, Validators.minLength(4)]],
          confirmPassword:['', Validators.required]
        }, { Validator : this.compararSenhas })
    });
  }

  compararSenhas(fb: FormGroup){
    const confirmSenhaCtrl = fb.get('confirmPassword');
    if(confirmSenhaCtrl.errors == null || 'mismatch' in confirmSenhaCtrl.errors){
      if(fb.get('password').value != confirmSenhaCtrl.value){
        confirmSenhaCtrl.setErrors({mismatch : true});
      }else
      {
        confirmSenhaCtrl.setErrors(null);
      }
    }
  }

  cadastrarUsuario(){
    if (this.registerForm.valid){
      this.user = Object.assign({ password: this.registerForm.get('passwords.password').value }, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Cadastrado realizado');
        },
        error => {
          const erro = error.error;
          erro.array.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                  this.toastr.error('Cadastro duplicado');
                break;            
              default:
                  this.toastr.error(`Erro no cadastro! CODE: ${element.code}`)
                break;
            }
          });
        }
      )
    }
  }
}
