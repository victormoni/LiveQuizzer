import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = () =>
    TestBed.runInInjectionContext(() =>
      TestBed.inject(AuthGuard).canActivate()
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
