import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from 'src/app/core/services/login/auth.service';
import { SHARED_FORMULARIOS_IMPORTS } from 'src/app/shared/shared-imports';

@Component({
  selector: 'app-login',
  imports: [SHARED_FORMULARIOS_IMPORTS, CheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {

  username: string = "";
  password: string = "";

  visible: boolean = false;

  //Constructor para inyectar el service que creamos
  constructor(
    private authService: AuthService, 
    private router: Router,
    private messageService: MessageService
  ) {}

  login(): void{
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.access_token) {
          this.router.navigate(['/sedes']);
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario o contraseña incorrecta',
        });
      },
    });
  }
}
