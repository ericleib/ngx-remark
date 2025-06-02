import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkNodeComponent } from './remark-node.component';
import { RemarkTemplateDirective } from './remark-template.directive';
import { RemarkComponent } from './remark.component';

describe('RemarkComponent', () => {
  let component: RemarkComponent;
  let fixture: ComponentFixture<RemarkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemarkComponent, RemarkNodeComponent, RemarkTemplateDirective]
    });
    fixture = TestBed.createComponent(RemarkComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('markdown', "# Hello, world!");
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, world!');
  });
});

@Component({
  template: `
    <remark [markdown]="markdown">
      @if(customHeading) {
        <h6 *remarkTemplate="'heading'; let node" [remarkNode]=node></h6>
      }
    </remark>
  `,
  standalone: false
})
class TestHostComponent {
  markdown = '# Hello world!';
  customHeading = true;
}


describe('RemarkComponent with remarkTemplate', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent, RemarkComponent, RemarkNodeComponent, RemarkTemplateDirective]
    });
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with h6', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('h1')).toBeFalsy();
    expect(compiled.querySelector('h6')?.textContent).toContain('Hello world!');
  });
  
  it('should update text and add paragraph', () => {
    const el = fixture.nativeElement.querySelector('h6');
    component.markdown = 
`# Hello there!
This is a paragraph`;
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('h1')).toBeFalsy();
    expect(compiled.querySelector('h6')?.textContent).toContain('Hello there!');
    expect(compiled.querySelector('h6')).toBe(el); // The element should be reused
    expect(compiled.querySelector('p')?.textContent).toContain('This is a paragraph');
  });

  it('should modify the html', () => {
    const el = fixture.nativeElement.querySelector('h6');
    component.markdown = 
`This is a paragraph
# Hello there!`;
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('h1')).toBeFalsy();
    expect(compiled.querySelector('h6')?.textContent).toContain('Hello there!');
    expect(compiled.querySelector('h6')).not.toBe(el); // The element should not be reused because it is at a different position
    expect(compiled.querySelector('p')?.textContent).toContain('This is a paragraph');
  })
  
  it('should render header with h6 and then not', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('h1')).toBeFalsy();
    expect(compiled.querySelector('h6')?.textContent).toContain('Hello world!');
    component.customHeading = false;
    fixture.detectChanges();
    expect(compiled.querySelector('h6')).toBeFalsy();
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello world!');
  });
  
  it('should render a list without paragraphs', () => {
    component.markdown = `
- Hello
- World
`;
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    expect(Array.from(compiled.querySelectorAll('li')).length).toBe(2);
    expect(Array.from(compiled.querySelectorAll('li > p')).length).toBe(0);
  });
  
  it('should render a list item with children with a paragraph', () => {
    component.markdown = `
- Hello
  - test
- World
`;
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    expect(Array.from(compiled.querySelectorAll('li')).length).toBe(3);
    expect(Array.from(compiled.querySelectorAll('li > p')).length).toBe(1);
  });
});
