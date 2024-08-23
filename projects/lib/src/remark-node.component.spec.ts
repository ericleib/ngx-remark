import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemarkNodeComponent } from './remark-node.component';
import { RemarkTemplatesService } from './remark-templates.service';
import { Root } from 'mdast';

function getNode(text: string, heading = 0) {
  return {
    type: 'root',
    children: [{
      type: heading? 'heading' : 'paragraph',
      depth: heading || undefined,
      children: [
        { type: 'text', value: text }
      ]
    }]
  } as Root;
}

class RemarkNodeComponentInit extends RemarkNodeComponent {
  ngOnInit() {}
  ngOnChanges() {}
}

describe('RemarkNodeComponent', () => {
  let component: RemarkNodeComponentInit;
  let fixture: ComponentFixture<RemarkNodeComponentInit>;

  beforeEach(() => {
    spyOn(RemarkNodeComponentInit.prototype, 'ngOnInit' as any);
    spyOn(RemarkNodeComponentInit.prototype, 'ngOnChanges' as any);
    TestBed.configureTestingModule({
      declarations: [RemarkNodeComponentInit],
      providers: [RemarkTemplatesService]
    });
    fixture = TestBed.createComponent(RemarkNodeComponentInit);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('remarkNode', getNode('Hello'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(RemarkNodeComponentInit.prototype.ngOnInit).toHaveBeenCalledTimes(2);    // one for root and one for paragraph
    expect(RemarkNodeComponentInit.prototype.ngOnChanges).toHaveBeenCalledTimes(2); // one for root and one for paragraph
  });

  it('should render paragraph', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Hello');
  });

  it('should update text', () => {
    const el = fixture.nativeElement.querySelector('p');
    fixture.componentRef.setInput('remarkNode', getNode('World'));
    fixture.detectChanges();
    expect(RemarkNodeComponentInit.prototype.ngOnInit).toHaveBeenCalledTimes(2);    // one for root and one for paragraph initially
    expect(RemarkNodeComponentInit.prototype.ngOnChanges).toHaveBeenCalledTimes(4); // then new root and new paragraph
    expect(fixture.nativeElement.querySelector('p')?.textContent).toContain('World');
    expect(fixture.nativeElement.querySelector('p')).toBe(el); // The element should be reused
  });
  
  it('should change switch to a heading', () => {
    const el = fixture.nativeElement.querySelector('p');
    fixture.componentRef.setInput('remarkNode', getNode('World', 2));
    fixture.detectChanges();
    expect(RemarkNodeComponentInit.prototype.ngOnInit).toHaveBeenCalledTimes(3);    // one for root and one for paragraph initially, then the new heading
    expect(RemarkNodeComponentInit.prototype.ngOnChanges).toHaveBeenCalledTimes(4); // then new root and new paragraph
    expect(fixture.nativeElement.querySelector('h2')?.textContent).toContain('World');
    expect(fixture.nativeElement.querySelector('p')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('h2')).not.toBe(el);
  });
});
