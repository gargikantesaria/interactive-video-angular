import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVideoInteractionComponent } from './add-video-interaction/add-video-interaction.component';
import { ViewVideoWithInteractionComponent } from './view-video-with-interaction/view-video-with-interaction.component';

const routes: Routes = [
  {
    path: 'add-video-interaction', component: AddVideoInteractionComponent
  },
  {
    path: 'view-video', component: ViewVideoWithInteractionComponent
  },
  {
    path: '', redirectTo: 'add-video-interaction', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
