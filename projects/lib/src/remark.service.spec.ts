import { TestBed } from '@angular/core/testing';

import { RemarkService } from './remark.service';

describe('RemarkService', () => {
  let service: RemarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse basic markdown', () => {
    const tree = service.parse("# Hello, world!");
    expect(tree).toBeTruthy();
    expect(tree.children).toBeTruthy();
    expect(tree.children.length).toBe(1);
    expect(tree.children[0].type).toBe("heading");
    expect((tree.children[0] as any).depth).toBe(1);
    expect((tree.children[0] as any).children).toBeTruthy();
    expect((tree.children[0] as any).children.length).toBe(1);
    expect((tree.children[0] as any).children[0].type).toBe("text");
    expect((tree.children[0] as any).children[0].value).toBe("Hello, world!");
  });
});
