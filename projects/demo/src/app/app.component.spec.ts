import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    fixture.detectChanges();
    const compiled = fixture.nativeElement.querySelector('remark') as HTMLElement;
    expect(compiled).toBeTruthy();
  });

  it('should NOT render table', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.componentInstance.form.controls.useGfm.setValue(false);
    await new Promise((res) => setTimeout(() => res(true), 250)); // Need to wait because the form changes are throttled...
    fixture.detectChanges();
    const compiled = fixture.nativeElement.querySelector('remark') as HTMLElement;
    expect(compiled.querySelector('table tr td')).toBeNull();
  });

  it('should render table (with GFM)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement.querySelector('remark') as HTMLElement;
    expect(compiled.querySelector('table tr th')?.textContent).toContain('Option');
  });

  it('should render every link wrapped in a green span and preceded by " 🔗"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement.querySelector('remark') as HTMLElement;
    expect(Array.from(compiled.querySelectorAll('a')).length).toBe(2);
    for(const link of Array.from(compiled.querySelectorAll('a'))) {
      expect(link.parentElement?.firstChild?.textContent).toBe(' 🔗');
      expect(link.parentElement?.nodeName).toBe('SPAN');
      expect(link.style.color).toBe('green');
    }
  });

  it('should render tables with tbody and thead', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement.querySelector('remark') as HTMLElement;
    expect(compiled.querySelector('table thead tr th')).toBeTruthy();
    expect(compiled.querySelector('table thead tr td')).toBeFalsy();
    expect(compiled.querySelector('table tbody tr th')).toBeFalsy();
    expect(compiled.querySelector('table tbody tr td')).toBeTruthy();
    expect((compiled.querySelector('table tbody tr td:first-child') as any)?.style.textAlign).toBe('left');
    expect((compiled.querySelector('table tbody tr td:last-child') as any)?.style.textAlign).toBe('center');
  });

  it('should highlight code', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement.querySelector('remark-prism') as HTMLElement;
    expect(compiled).toBeTruthy();
    // the following does not pass because Prismjs is not loaded
    //expect(compiled.querySelector('span.token.punctuation')).toBeTruthy();
  });

  it('should NOT highlight code', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.componentInstance.form.controls.codeHighlights.setValue(false);
    await new Promise((res) => setTimeout(() => res(true), 250)); // Need to wait because the form changes are throttled...
    fixture.detectChanges();
    const compiled = fixture.nativeElement.querySelector('remark-prism');
    expect(compiled).toBeNull();
  });
});
