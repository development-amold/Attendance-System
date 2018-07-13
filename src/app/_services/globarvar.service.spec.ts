import { TestBed, inject } from '@angular/core/testing';

import { GlobarvarService } from './globarvar.service';

describe('GlobarvarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobarvarService]
    });
  });

  it('should be created', inject([GlobarvarService], (service: GlobarvarService) => {
    expect(service).toBeTruthy();
  }));
});
