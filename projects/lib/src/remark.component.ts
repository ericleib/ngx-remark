import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, OnChanges, QueryList, TemplateRef } from '@angular/core';
import { RemarkService } from './remark.service';
import { RemarkTemplateDirective } from './remark-template.directive';
import { Root } from 'mdast';
import { RemarkTemplatesService } from './remark-templates.service';

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
  @Input({required: true}) markdown!: string;
  /** Options for the unified plugins */
  @Input() options?: any;
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
    private remarkService: RemarkService,
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

  parse() {
    this.tree = this.remarkService.parse(this.markdown, this.options);
    this.cdr.markForCheck();
  }

  updateTemplates() {
    this.templates = {};
    this.templateQuery?.forEach(
      template => this.templates![template.nodeType] = template.template
    );
    this.parse();
  }

}
