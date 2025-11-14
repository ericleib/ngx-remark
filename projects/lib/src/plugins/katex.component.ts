import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import type { KatexOptions } from "katex";

declare namespace katex {
  function renderToString(expr: string, options: KatexOptions): string;
}

@Component({
  selector: 'remark-katex',
  template: `<span [innerHTML]="html()" class="katex-container"></span>`,
  styles: [`
    .katex-container {
      position: relative;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KatexComponent {
  expr = input.required<string>();
  options = input<KatexOptions>({});

  html = computed(() => this.render());

  sanitizer = inject(DomSanitizer);

  render() {
    try {
      const html = katex.renderToString(this.expr(), this.options());
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    catch(err) {
      console.error(err);
      return this.expr();
    }
  }

}
