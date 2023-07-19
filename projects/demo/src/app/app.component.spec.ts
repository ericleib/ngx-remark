import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RemarkModule } from 'ngx-remark';
import { unified } from 'unified';
import remarkParse from 'remark-parse';

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
    expect(compiled.querySelector('table tr td')?.textContent).toContain('Option');
  });
});
