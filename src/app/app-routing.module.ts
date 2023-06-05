import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RouteKeys } from 'src/core/Routes';
import { MapComponent } from './pages/map/map.component';

const routes: Routes = [
  { path: RouteKeys.Home, pathMatch: 'full', component: HomeComponent },
  { path: RouteKeys.Map, pathMatch: 'full', component: MapComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
