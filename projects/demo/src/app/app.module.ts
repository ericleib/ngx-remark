import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RemarkModule } from 'ngx-remark';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RemarkModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
