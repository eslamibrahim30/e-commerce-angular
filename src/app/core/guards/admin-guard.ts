import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getUser();

  if (user && user.role === 'admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
