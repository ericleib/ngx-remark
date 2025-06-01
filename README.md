[![Build project](https://github.com/ericleib/ngx-remark/actions/workflows/build.yml/badge.svg)](https://github.com/ericleib/ngx-remark/actions/workflows/build.yml)
[![npm version](https://badge.fury.io/js/ngx-remark.svg)](https://badge.fury.io/js/ngx-remark)

# ngx-remark

This library allows to render Markdown with custom HTML templates in Angular.

Most libraries for rendering Markdown in Angular first transform the Markdown to HTML and then use the `innerHTML` attribute to render the HTML. The problem of this approach is that there is no way to use Angular components or directives in any part of the generated HTML.

In contrast, this library uses [Remark](https://remark.js.org/) to parse the Markdown into an abstract syntax tree (AST) and then uses Angular to render the AST as HTML. The `<remark>` component renders all standard Markdown elements with default built-in templates, but it also allows to override the templates for any element.

Typical use cases include:

- Displaying code blocks with a custom code editor.
- Displaying custom tooltips over certain elements.
- Allowing custom actions with buttons or links.

## Demo

- [Playground](https://ericleib.github.io/ngx-remark/)
- [Stackblitz](https://stackblitz.com/edit/stackblitz-starters-gah83vcs?file=src%2Fmain.ts)

## Installation

Install the library with npm:

```bash
npm install ngx-remark remark
```


## Importing the library

Import the `RemarkModule` in your standalone component or module:

```typescript
import { RemarkModule } from 'ngx-remark';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RemarkModule],
})
export class App { }
```

## Usage

Use the `<remark>` component to render Markdown:

```html
<remark markdown="# Hello World"></remark>
```

The above renders the HTML will all default templates.

You can customize the Remark processing pipeline with the optional `processor` input (the default is `unified().use(remarkParse)`):

```html
<remark [markdown]="markdown" [processor]="processor"></remark>
```

As an example, the following uses the [remark-gfm](https://github.com/remarkjs/remark-gfm) plugin to support GitHub Flavored Markdown:

```typescript
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

processor = unified().use(remarkParse).use(remarkGfm);
```

You can override the templates for any node type with the `<ng-template>` element and the `remarkTemplate` directive:

```html
<remark markdown="# Hello World">

  <ng-template remarkTemplate="heading" let-node>
    <h1 *ngIf="node.depth === 1" [remarkNode]="node" style="color: red;"></h1>
    <h2 *ngIf="node.depth === 2" [remarkNode]="node"></h2>
    ...
  </ng-template>

</remark>
```

In the above example, note the following:

- The headings of depth 1 are customized with a red color.
- The `remarkTemplate` attribute must be set to the name of the [MDAST](https://github.com/syntax-tree/mdast) node type.
- The `let-node` attribute is required to make the `node` variable available in the template. The `node` variable is of type `Node` and can be used to access the properties of the node.
- Since the heading node might have children (in particular `text` nodes), the `remarkNode` directive is used to render the children of the node.

It is possible to use the structural shorthand syntax for the `remarkTemplate` directive:

```html
<remark markdown="This is a paragraph with [link](https://example.com)">

  <span *remarkTemplate="'link'; let node" style="color: green;">
    This is a link: <a [href]="node?.url" [title]="node.title ?? ''" [remarkNode]="node"></a>
  </span>

</remark>
```

If the node type doesn't have children, the `[remarkNode]` directive isn't required:

```html
<remark [markdown]="markdownWithCodeBlocks">

  <my-code-editor *remarkTemplate="'code'; let node"
    [code]="node.code"
    [language]="node.lang">
  </my-code-editor>

</remark>
```

You can customize various node types by adding as many templates as needed:

```html
<remark [markdown]="markdownWithCodeBlocks">

  <my-code-editor *remarkTemplate="'code'; let node"
    [code]="node.code"
    [language]="node.lang">
  </my-code-editor>

  <span *remarkTemplate="'link'; let node" style="color: green;">
    This is a link: <a [href]="node?.url" [title]="node.title ?? ''" [remarkNode]="node"></a>
  </span>

</remark>
```


## Custom Markdown syntax

Rendering custom Markdown syntax requires 2 steps:
- Parsing the Markdown with a custom [Remark](https://remark.js.org/) processor. The abstract syntax tree (AST) will contain nodes with a custom type (let's say `my-type`). 
- Rendering the custom nodes with an Angular template, such as: `<span *remarkTemplate="'my-type'; let node">{{node.value}}</span>`.

### Example

We want to support a custom block such as:

```
:::dropdown  
Option 1
Option 2
Option 3  
:::
```

First, we create a custom processor that finds this syntax within the AST:

```typescript
processor = unified()
  .use(remarkParse)
  .use(() => this.plugin);

plugin = (tree: Node) => {
  visit(tree, 'paragraph', (node: Paragraph, index: number, parent: Parent) => {
    const firstChild = node.children[0];
    const lastChild = node.children.at(-1)!;
    if (
      firstChild.type === 'text' &&
      lastChild.type === 'text' &&
      firstChild.value.startsWith(':::dropdown') &&
      lastChild.value.trimEnd().endsWith(':::')
    ) {
      parent.children[index] = {
        type: 'dropdown',
        options: node.children
          .flatMap((child) =>
            (child as Text).value
              .replace(':::dropdown', '')
              .replace(':::', '')
              .split('\n')
          )
          .filter((c) => c),
      } as any;
    }
    return CONTINUE;
  });
};
```

This custom processor searches for and replaces nodes such as:

```json
{
  "type": "paragraph",
  "children": [
    {
      "type": "text",
      "value": ":::dropdown\nOption 1\nOption 2\nOption 3\n:::"
    }
  ]
}
```

with:

```json
{
  "type": "dropdown",
  "options": [
    "Option 1",
    "Option 2",
    "Option 3"
  ]
}
```

Then, in our Angular application we can render the dropdown with:

```html
<remark [markdown]="markdown" [processor]="processor">
  <ng-template [remarkTemplate]="'dropdown'" let-node>
    <select>
      @for(option of node.options; track $index) {
      <option>{{ option }}</option>
      }
    </select>
  </ng-template>
</remark>
```

Here's a working example: https://stackblitz.com/edit/stackblitz-starters-emzbbhj4?file=src%2Fmain.ts


