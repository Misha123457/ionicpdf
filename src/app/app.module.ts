import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { NgxSignaturePadModule } from '@eve-sama/ngx-signature-pad';

@NgModule({
  declarations: [AppComponent,FileuploadComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,NgxSignaturePadModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
