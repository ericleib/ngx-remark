import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { RemarkComponent } from './remark.component';
import { RemarkNodeComponent } from './remark-node.component';
import { RemarkTemplateDirective } from './remark-template.directive';

describe('RemarkComponent', () => {
  let component: RemarkComponent;
  let fixture: ComponentFixture<RemarkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemarkComponent, RemarkNodeComponent]
    });
    fixture = TestBed.createComponent(RemarkComponent);
    component = fixture.componentInstance;
    component.markdown = "# Hello, world!";
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
    <h6 *remarkTemplate="'heading'; let node" [remarkNode]=node></h6>
  </remark>`,
    standalone: false
})
class TestHostComponent {
  markdown = '# Hello world!';
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
});
