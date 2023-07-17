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
});
