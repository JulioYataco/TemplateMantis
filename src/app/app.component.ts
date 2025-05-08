// angular import
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './theme/shared/components/spinner/spinner.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { PrimeNG } from 'primeng/config';
import { PRIMENG_ES } from './i19n/primeng-es';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SpinnerComponent, NgxEchartsModule,]
})
export class AppComponent implements OnInit{
  // public props
  title = 'mantis-free-version';
  private primengConfig = inject(PrimeNG)

  ngOnInit(): void {
    this.primengConfig.setTranslation(PRIMENG_ES)
  }
}
