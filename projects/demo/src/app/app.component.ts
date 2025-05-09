import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RemarkModule } from 'ngx-remark';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { sampleMarkdown } from './sample';
import { startWith, throttleTime } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [AsyncPipe, RemarkModule, ReactiveFormsModule]
})
export class AppComponent {

  processor = unified()
    .use(remarkParse)
    .use(remarkGfm);

  markdownInput = new FormControl(sampleMarkdown);
  customParagraphs = new FormControl(true);
  customLinks = new FormControl(true);
  customHeadings = new FormControl(false);

  markdown$ = this.markdownInput.valueChanges.pipe(
    startWith(sampleMarkdown),
    throttleTime(200, undefined, {trailing: true, leading: true})
  )

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => window.alert(`"${text}" copied to clipboard!`)
    )
  }
}
