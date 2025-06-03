import { ChangeDetectionStrategy, Component, ElementRef, inject, input, resource, viewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

declare namespace mermaid {
  function render(id: string, code: string): Promise<{svg: string}>;
}

@Component({
  selector: 'remark-mermaid',
  template: `
  <div #container></div>
  <div [innerHTML]="svg.value()"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MermaidComponent {
  el = viewChild.required<ElementRef>('container');
  code = input.required<string>();

  sanitizer = inject(DomSanitizer);

  svg = resource({
    request: () => ({code: this.code(), el: this.el()}),
    loader: ({request: {code, el}}) => this.render(code, el),
    defaultValue: "loading"
  });

  async render(code: string, el: ElementRef) {
    try {
      if(!(window as any).mermaid) {
        return "Mermaid is not loaded";
      }
      if(!el.nativeElement.id) {
        el.nativeElement.id = `mermaid-${crypto.randomUUID()}`;
      }
      const {svg} = await mermaid.render(el.nativeElement.id, code);
      return this.sanitizer.bypassSecurityTrustHtml(svg);
    }
    catch(err) {
      console.error(err);
      return (err as Error).message;
    }
  }
}
