import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { authInterceptor } from "./core/interceptors/auth.interceptor";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { routes } from './app-routing.module';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


import { CookieService } from "ngx-cookie-service";

//Graficos con echarts
//import { provideECharts } from 'ngx-echarts';
import { providePrimeNG } from "primeng/config";
import Lara from '@primeng/themes/lara';
import { MessageService } from "primeng/api";
import { SHARED_PROVIDERS } from "./shared/shared-imports";

//Configuramos fecha peru
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es'; // Importamos el locale de español

// Registrar el locale
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({eventCoalescing : true}),
        provideClientHydration(withEventReplay()),
        provideRouter(routes), 
        provideHttpClient(withFetch()),
        provideHttpClient(withInterceptors([authInterceptor])),
        CookieService,
        provideAnimationsAsync(),
        
        providePrimeNG({
            theme: {
                preset: Lara,
                options: {
                    darkModeSelector: '.my-app-dark'
                }
            }
        }),
        MessageService,
        //Si usaramos solo SHARED_PROVIDERS es porque esto es un array, y angular espera un array de providers, si hacemos esto el resultado seria:
        //providers: [
        // [
        //     importProvidersFrom(ConfirmDialogModule), 
        //     ConfirmationService
        // ]
        // ]
        //Esto da error en angular porque no puede interpretar un array dentro de otro array
        ...SHARED_PROVIDERS //cuando hacemos uso de (...) estamos usando el operador spread de JavaScript/TypeScript de ese modo estamos "sacando" los elementos del array y colocanmos directamente dentro del array de providers. esto nos da:
        // providers: [
        //     importProvidersFrom(ConfirmDialogModule), 
        //     ConfirmationService
        //]
        //De este modo angular lo interpreta correctamente.
    ]
}