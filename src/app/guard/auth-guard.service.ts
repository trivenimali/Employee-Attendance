import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { User } from '../interface/user';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    public toastr:ToastrService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authService.isLoggedIn !==true)
    {
      this.toastr.info('Access Denied');
      //window.alert('Access Denied')
      this.router.navigate(['sign-in'])
    }
    return  true;
  }
}