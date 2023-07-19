import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, OnChanges, QueryList, TemplateRef } from '@angular/core';
import { RemarkTemplateDirective } from './remark-template.directive';
import { RemarkTemplatesService } from './remark-templates.service';
import { unified, Processor } from 'unified';
import remarkParse from 'remark-parse';
import { Root } from 'mdast';

@Component({
  selector: 'remark',
  template: `
    <remark-node *ngIf="tree && templates" [remarkNode]="tree"></remark-node>
    <pre *ngIf="debug"><code>{{tree | json }}</code></pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RemarkTemplatesService]
})
export class RemarkComponent implements OnChanges, AfterContentInit {
  /** The markdown string to render */
  @Input() markdown!: string;
  /** A custom processor to use instead of the default `unified().user(remarkParse)` */
  @Input() processor?: Processor<Root, Root, Root>;
  /** Set this flag to true to display the parsed markdown tree */
  @Input() debug = false;

  /** Custom templates to override the default rendering components */
  @ContentChildren(RemarkTemplateDirective)
  templateQuery?: QueryList<RemarkTemplateDirective>;

  tree?: Root;

  get templates() {
    return this.remarkTemplatesService.templates;
  }

  set templates(value) {
    this.remarkTemplatesService.templates = value;
  }

  constructor(
    private remarkTemplatesService: RemarkTemplatesService,
    private cdr: ChangeDetectorRef
  ) { }

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
      template => this.templates![template.nodeType] = template.template
    );
    this.parse();
  }

  getProcessor() {
    return this.processor ?? unified().use(remarkParse);
  }

  parse() {
    const processor = this.getProcessor();
    const tree = processor.parse(this.markdown);
    this.tree = processor.runSync(tree);
    this.cdr.markForCheck();
  }

}
