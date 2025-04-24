import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, OnChanges, QueryList, inject, input } from '@angular/core';
import { Node, Root } from 'mdast';
import remarkParse from 'remark-parse';
import { Processor, unified } from 'unified';
import type { Compatible } from 'unified/lib';
import { RemarkTemplateDirective } from './remark-template.directive';
import { RemarkTemplatesService } from './remark-templates.service';

@Component({
    selector: 'remark',
    template: `
    @if (tree && templates) {
      <remark-node [remarkNode]="tree"></remark-node>
    }
    @if (debug()) {
      <pre><code>{{tree | json }}</code></pre>
    }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RemarkTemplatesService],
    standalone: false
})
export class RemarkComponent implements OnChanges, AfterContentInit {
  private remarkTemplatesService = inject(RemarkTemplatesService);
  private cdr = inject(ChangeDetectorRef);

  /** The markdown string to render */
  readonly markdown = input.required<Compatible>();

  /** A custom processor to use instead of the default `unified().user(remarkParse)` */
  readonly processor = input<Processor<Root>>();
  /** Set this flag to true to display the parsed markdown tree */
  readonly debug = input(false);

  /** Custom templates to override the default rendering components */
  @ContentChildren(RemarkTemplateDirective)
  templateQuery?: QueryList<RemarkTemplateDirective>;

  tree?: Node;

  get templates() {
    return this.remarkTemplatesService.templates;
  }

  set templates(value) {
    this.remarkTemplatesService.templates = value;
  }


  ngOnChanges() {
    if(this.templates) {
      this.parse();
    }
  }

  ngAfterContentInit() {
    this.templateQuery?.changes.subscribe(() => this.updateTemplates());
    this.updateTemplates();
  }

  updateTemplates() {
    this.templates = {};
    this.templateQuery?.forEach(
      template => this.templates![template.nodeType()] = template.template
    );
    this.parse();
  }

  getProcessor() {
    return this.processor() ?? unified().use(remarkParse);
  }

  parse() {
    const processor = this.getProcessor();
    const tree = processor.parse(this.markdown());
    this.tree = processor.runSync(tree);
    this.cdr.markForCheck();
  }

}
