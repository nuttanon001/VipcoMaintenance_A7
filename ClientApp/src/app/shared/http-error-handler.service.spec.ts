import { TestBed, inject } from '@angular/core/testing';

import { HttpErrorHandler } from './http-error-handler.service';

describe('HttpErrorHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpErrorHandler]
    });
  });

  it('should be created', inject([HttpErrorHandler], (service: HttpErrorHandler) => {
    expect(service).toBeTruthy();
  }));
});
