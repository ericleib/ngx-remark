import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map, startWith, throttleTime } from 'rxjs';
import { Processor, unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import { KatexComponent, PrismComponent, RemarkModule } from 'ngx-remark';
import { sampleMarkdown } from './sample';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [AsyncPipe, RemarkModule, ReactiveFormsModule, PrismComponent, KatexComponent]
})
export class AppComponent {

  form = new FormGroup({
    codeHighlights: new FormControl(true),
    mathExpressions: new FormControl(true),
    customHeadings: new FormControl(false),
    markdown: new FormControl(sampleMarkdown, {nonNullable: true}),
    useGfm: new FormControl(true),
  });

  state$ = this.form.valueChanges.pipe(
    startWith(this.form.value),
    throttleTime(200, undefined, {trailing: true, leading: true}),
    map(state => {
      let processor: Processor<any, any, any> = unified().use(remarkParse);
      if(state.useGfm) {
        processor = processor.use(remarkGfm);
      }
      if(state.mathExpressions) {
        processor = processor.use(remarkMath);
      }
      return {processor, ...state}
    })
  )

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => window.alert(`"${text}" copied to clipboard!`)
    )
  }
}
