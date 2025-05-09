import { ChangeDetectionStrategy, Component, computed, contentChildren, input, TemplateRef } from '@angular/core';
import { Root } from 'mdast';
import remarkParse from 'remark-parse';
import { Processor, unified } from 'unified';
import type { Compatible } from 'unified/lib';
import { RemarkTemplateDirective } from './remark-template.directive';
import { RemarkTemplatesService } from './remark-templates.service';

@Component({
  selector: 'remark',
  template: `
    @if (tree()) {
      <remark-node [remarkNode]="tree()"></remark-node>
    }
    @if (debug()) {
      <pre><code>{{tree() | json }}</code></pre>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RemarkTemplatesService],
  standalone: false
})
export class RemarkComponent {
  /** The markdown string to render */
  readonly markdown = input.required<Compatible>();
  /** A custom processor to use instead of the default `unified().user(remarkParse)` */
  readonly processor = input<Processor<Root>>();
  /** Set this flag to true to display the parsed markdown tree */
  readonly debug = input(false);

  /** Custom templates to override the default rendering components */
  templateQuery = contentChildren(RemarkTemplateDirective);

  tree = computed(() => {
    const processor = this.processor() ?? unified().use(remarkParse);
    const tree = processor.parse(this.markdown());
    return processor.runSync(tree);
  });

  constructor(
    public remarkTemplatesService: RemarkTemplatesService
  ) {
    remarkTemplatesService.templates = computed(() => {
      const templates: {[nodeType: string]: TemplateRef<any>} = {};
      for(const template of this.templateQuery()) {
        templates[template.nodeType()] = template.template
      }
      return templates;
    });
  }

}
