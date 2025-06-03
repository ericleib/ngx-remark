import { ChangeDetectionStrategy, Component, computed, input, resource } from "@angular/core";

declare namespace Prism {
  function highlight(text: string, grammar: any, language: string): string;
  var languages: Record<string, any>;
  var plugins: {
    autoloader: {
      loadLanguages: (languages: string|string[], success?: (languages: string[]) => void, error?: (language: string) => void) => void
    };
  };
}

@Component({
  selector: 'remark-prism',
  template: `
  <pre class="language-{{language()}}"><code class="language-{{language()}}" [innerHtml]="highlightedCode()"></code></pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrismComponent {
  code = input.required<string>();
  language = input('');

  grammar = resource({
    request: () => ({language: this.language()}),
    loader: async ({request: {language}}) => {
      if(language) {
        const grammar = Prism?.languages?.[language];
        if(grammar) {
          return grammar;
        }
        else if(Prism?.plugins?.autoloader) {
          return await new Promise((resolve, reject) => {
            Prism.plugins.autoloader.loadLanguages(language,
              () => resolve(Prism?.languages?.[language] ?? null),
              (lang) => reject(`Unknown language ${lang}`)
            );
          });
        }
      }
      return null;
    },
  });

  highlightedCode = computed(() => {
    if(this.grammar.value()) {
      return Prism.highlight(this.code(), this.grammar.value(), this.language());
    }
    return this.code();
  });

}
