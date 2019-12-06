import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SecureInnerPagesGuard } from './guard/secure-inner-pages.guard';
import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [
  {
    path: '', 
    redirectTo: '/sign-in',
    pathMatch: 'full'
  },

  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate:[SecureInnerPagesGuard]
    //canActivate:[AuthGuard]
  },

  {
    path: 'sign-up', 
    component: SignUpComponent,
    //canActivate:[AuthGuard]
    canActivate:[SecureInnerPagesGuard]
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate:[AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
