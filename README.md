[![Build project](https://github.com/ericleib/ngx-remark/actions/workflows/build.yml/badge.svg)](https://github.com/ericleib/ngx-remark/actions/workflows/build.yml)
[![npm version](https://badge.fury.io/js/ngx-remark.svg)](https://badge.fury.io/js/ngx-remark)

# ngx-remark

**ngx-remark** is a library that allows to render Markdown with custom Angular components and templates.

Most libraries for rendering Markdown in Angular first transform the Markdown to HTML and then use the `innerHTML` attribute to render the HTML. The problem of this approach is that there is no way to use Angular components or directives in any part of the generated HTML.

In contrast, this library uses [Remark](https://remark.js.org/) to parse the Markdown into an abstract syntax tree (AST) and then uses Angular to render the AST as HTML. The `<remark>` component renders all standard Markdown elements with default built-in templates, but it also allows to override the templates for any element.

Typical use cases include:

- Displaying code blocks with a custom code editor.
- Displaying custom tooltips over certain elements.
- Allowing custom actions with buttons or links.
- Integration with Angular features, like the [`Router`](#router-integration).

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
<remark markdown="# Hello World"/>
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

## Router integration

By default, links in the Markdown document are rendered as non-Angular links, ie.:

```html
<a href="https://google.com"></a>
```

A common problem is handling links that point to routes in the Angular application. This is a good use-case for ngx-remark:

```html
<remark [markdown]="markdown">
  <ng-template [remarkTemplate]="'link'" let-node>
    @if(node.url.startsWith('https://')) {
      <a [href]="node.url" target="_blank" [title]="node.title ?? ''" [remarkNode]="node"></a>
    }
    @else {
      <a [routerLink]="node.url" [title]="node.title ?? ''" [remarkNode]="node"></a>
    }
  </ng-template>
</remark>
```

Note that we handle 2 types of links:
- External links (starting with `https://`) are rendered with `href` and `target="_blank"`.
- Internal links use the Angular router

(In practice, the distinction between the 2 types might be more subtle)

## Cursor symbol

When this component is used to display the output of an LLM in streaming mode, it can be a nice touch to insert a glowing "cursor" symbol at the end of the text.

This can be achieved in 3 steps:

1. Create a plugin to insert a custom node after the last `text` node in the AST:

```ts
processor.use(() => this.placeholderPlugin);

placeholderPlugin = (tree: Node) => {
  visit(tree, "text", (node: Text, index: number, parent: Parent) => {
    parent.children.push({type: "cursor"} as any);
    return EXIT;
  }, true);
  return tree;
}
```

2. Add a template to render this component:

```html
<span *remarkTemplate="'cursor'" [ngClass]="{cursor: streaming}"></span>
```

3. Add styles to the `.cursor` class:

```css
.cursor {
  display: inline-block;
  height: 1rem;
  vertical-align: text-bottom;
  width: 10px;
  animation: cursor-glow 0.3s ease-in-out infinite;
  background: grey;
}

@keyframes cursor-glow {
  50% {
    opacity: .2;
  }
}
```

## Plugins

### Remark plugins

Remark is a tool that transforms markdown with [plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#list-of-plugins).

For example, converting gemoji shortcodes into emoji can be achieved with the [remark-gemoji](https://github.com/remarkjs/remark-gemoji) plugin:

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGemoji from 'remark-gemoji';

processor = unified()
  .use(remarkParse)
  .use(remarkGemoji);
```

This particular plugin works out-of-the-box because it does not introduce a new node type in the syntax tree (emojis are just UTF-8 characters).

Other plugins (such as [remark-directive](https://github.com/remarkjs/remark-directive) or [remark-sectionize](https://github.com/jake-low/remark-sectionize)) may introduce node types that must be rendered with an Angular template or component.


### Code highlighting

Syntax highlighting for code blocks can be enabled by adding [Prismjs](https://prismjs.com/) to your project.

#### Install Prism

The simplest way to install Prism is by loading stylesheets and scripts from a CDN, for example:

```html
<head>
  ...
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism-okaidia.min.css" rel="stylesheet" />
</head>
<body>
  <app-root></app-root>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/plugins/autoloader/prism-autoloader.min.js"></script>
</body>
```

#### Render code blocks

With Prism globally loaded, you can add the `remark-prism` component as a template inside your `remark` component:

```ts
import { PrismComponent, RemarkModule } from 'ngx-remark';

@Component({
  ...
  imports: [..., RemarkModule, PrismComponent]
})
```

```html
<remark [markdown]="markdown">
  <remark-prism *remarkTemplate="'code'; let node"
    [code]="node.value"
    [language]="node.lang">
  </remark-prism>
</remark>
```

You can also nest `remark-prism` inside a more complex component or template (eg. including a "Copy to clipboard" button).

Note that there is no need to customize the `processor`, as the component takes the raw code as an input.

#### Advanced setup

You may also install Prism with `npm i prismjs` and add the scripts and stylesheets to your `angular.json` file.

You may want to avoid to avoid loading the stylesheet globally, as it will add styling to any `<code>` element in your app. One way to scope the styling only to this library is use this trick in your SCSS stylesheet:

```scss
@use "sass:meta";

remark-prism {
  @include meta.load-css("node_modules/prismjs/themes/prism-okaidia.css");
}
```

If you need the autoloader plugin to work in this context, you will need to add the languages files to your assets with a glob such as:

```json
{
  "input": "node_modules/prismjs/components/",
  "glob": "prism-*.min.js",
  "output": "components/"
}
```

This will add all the ~300 language files to your assets so they can be loaded when needed.

### Headings with anchor links

You can render headings with an anchor link with the provided component `remark-heading`:

```ts
import { RemarkModule, HeadingComponent } from 'ngx-remark';

@Component({
  ...
  imports: [..., RemarkModule, HeadingComponent]
})
```

and

```html
<remark [markdown]="markdown">
  <remark-heading *remarkTemplate="'heading'; let node" [node]="node"></remark-heading>
</remark>
```

The `id` is automatically generated from the heading text content.

### Math expressions

Math expressions can be rendered with [KaTeX](https://katex.org/).

This requires four steps:
- Install KaTeX in your project with `npm i katex remark-math`.
- Import the KaTeX stylesheet into your styles (or simply load it from a CDN)
- Add the `remark-math` plugin to your processor with `processor.use(remarkMath)`
- Render math expressions with the provided `remark-katex` component:

```ts
import { RemarkModule, KatexComponent } from 'ngx-remark';

@Component({
  ...
  imports: [RemarkModule, KatexComponent]
})
```

```html
<remark [markdown]="markdown" [processor]="processor">
  <remark-katex *remarkTemplate="'math'; let node" [expr]="node.value"></remark-katex>
  <remark-katex *remarkTemplate="'inlineMath'; let node" [expr]="node.value"></remark-katex>
</remark>
```

In the example above, we make no difference between `math` and `inlineMath` elements, but in practice they might require minor styling differences.

### Mermaid diagrams

[Mermaid](https://mermaid.js.org) is a JavaScript based diagramming and charting tool that uses Markdown-inspired text definitions and a renderer to create and modify complex diagrams.

#### Install Mermaid

The simplest way to install Mermaid is to load the library from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid@11.6.0/dist/mermaid.min.js"></script>
```

#### Render mermaid code blocks

Add the provided `remark-mermaid` component inside your `remark` component. Mermaid diagrams are typically rendered within code blocks, so your Angular template might look like this:

```html
<remark [markdown]="markdown">
  <ng-template [remarkTemplate]="'code'" let-node>
    @if(node.lang === 'mermaid') {
      <remark-mermaid [code]="node.value"/>
    }
    @else {
      <remark-prism [code]="node.value" [language]="node.lang"/>
    }
  </ng-template>
</remark>
```

Note that there is no need to customize the `processor`, as the component takes the raw mermaid code as an input.

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


