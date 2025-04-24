import { TestBed } from '@angular/core/testing';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { AppComponent } from './app.component';
import { RemarkModule } from 'projects/lib/src';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RemarkModule],
    declarations: [AppComponent]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should NOT render table', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.processor = unified().use(remarkParse);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('table tr td')).toBeNull();
  });

  it('should render table (with GFM)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('table tr th')?.textContent).toContain('Option');
  });

  it('should render red paragraphs', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(Array.from(compiled.querySelectorAll('p')).length).toBe(18);
    expect(
      Array.from(compiled.querySelectorAll('p')).every(
        (p) => p.style.color === 'red'
      )
    ).toBeTrue();
  });

  it('should render every link wrapped in a green span and preceded by " foo "', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(Array.from(compiled.querySelectorAll('a')).length).toBe(1);
    expect(
      Array.from(compiled.querySelectorAll('a')).every((link) => {
        return (
          link.parentElement?.firstChild?.textContent === ' foo ' &&
          link.parentElement?.nodeName === 'SPAN' &&
          link.parentElement?.style.color === 'green'
        );
      })
    ).toBeTrue();
  });

  it('should render tables with tbody and thead', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('table thead tr th')).toBeTruthy();
    expect(compiled.querySelector('table thead tr td')).toBeFalsy();
    expect(compiled.querySelector('table tbody tr th')).toBeFalsy();
    expect(compiled.querySelector('table tbody tr td')).toBeTruthy();
    expect((compiled.querySelector('table tbody tr td:first-child') as any)?.style.textAlign).toBe('left');
    expect((compiled.querySelector('table tbody tr td:last-child') as any)?.style.textAlign).toBe('center');
  });
});
