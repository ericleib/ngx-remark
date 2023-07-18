import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { REMARK_PROCESSOR, RemarkModule } from 'ngx-remark';
import { unified, Processor } from 'unified'
import { Root } from 'mdast';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';


function customPipeline(): Processor<Root, Root, Root> {
  return unified()
    .use(remarkParse)
    .use(remarkGfm);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RemarkModule
  ],
  providers: [
    {provide: REMARK_PROCESSOR, useValue: customPipeline}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
