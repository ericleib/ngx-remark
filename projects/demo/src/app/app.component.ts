import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PrismComponent, RemarkModule } from 'ngx-remark';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { sampleMarkdown } from './sample';
import { map, startWith, throttleTime } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [AsyncPipe, RemarkModule, ReactiveFormsModule, PrismComponent]
})
export class AppComponent {

  form = new FormGroup({
    codeHighlights: new FormControl(true),
    customLinks: new FormControl(true),
    customHeadings: new FormControl(false),
    markdown: new FormControl(sampleMarkdown, {nonNullable: true}),
    useGfm: new FormControl(true),
  });

  state$ = this.form.valueChanges.pipe(
    startWith(this.form.value),
    throttleTime(200, undefined, {trailing: true, leading: true}),
    map(state => {
      const processor = state.useGfm?
        unified().use(remarkParse).use(remarkGfm) :
        unified().use(remarkParse);
      return {processor, ...state}
    })
  )

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => window.alert(`"${text}" copied to clipboard!`)
    )
  }
}
