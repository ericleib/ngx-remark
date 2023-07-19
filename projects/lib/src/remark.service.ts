import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { unified, Processor } from 'unified';
import remarkParse from 'remark-parse';
import { Root } from 'mdast';

export const REMARK_PROCESSOR = new InjectionToken<(options?: any) => Processor<Root, Root, Root>>('RemarkProcessor');

@Injectable({
  providedIn: 'root'
})
export class RemarkService {

  constructor(
    @Inject(REMARK_PROCESSOR) @Optional()
    protected processor?: (options?: any) => Processor<Root, Root, Root>
  ) { }

  protected getPipeline(options?: any): Processor<Root, Root, Root> {
    return this.processor?.(options) ?? unified().use(remarkParse);
  }

  public parse(markdown: string, options?: any): Root {
    const pipeline = this.getPipeline(options);
    const tree = pipeline.parse(markdown);
    return pipeline.runSync(tree);
  }
}
