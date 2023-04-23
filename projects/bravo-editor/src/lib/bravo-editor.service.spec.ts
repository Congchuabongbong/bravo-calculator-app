import { TestBed } from '@angular/core/testing';

import { BravoEditorService } from './bravo-editor.service';

describe('BravoEditorService', () => {
  let service: BravoEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BravoEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
