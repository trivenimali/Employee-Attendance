import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { HistoryComponent } from './history/history.component';


const routes: Routes = [
  {
    path: '', 
    redirectTo: '/sign-in',
    pathMatch: 'full'
  },

  {
    path: 'sign-in',
    component: SignInComponent,
    //canActivate:[SecureInnerPagesGuard]
    //canActivate:[AuthGuard]
  },

  {
    path: 'sign-up', 
    component: SignUpComponent,
    //canActivate:[AuthGuard]
    //canActivate:[SecureInnerPagesGuard]
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate:[AuthGuard]
  },

  {
    path: 'history',
    component:HistoryComponent,
    canActivate:[AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
