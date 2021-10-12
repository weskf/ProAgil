import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
 // registerForm: FormGroup;

 registerForm = new FormGroup({
  fullname: new FormControl(),
    email: new FormControl(),
    username: new FormControl(),
    passwords: new FormGroup({
      password: new FormControl(),
      confirmPassword: new FormControl()  
    })    
  });

  constructor(private fb: FormBuilder
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
    console.log('cadastro usuario');
  }
}
