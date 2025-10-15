import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmoIndicatorComponent } from './emoIndicator/emoIndicator.component';

const routes: Routes = [
    {
        path:"",
        component: EmoIndicatorComponent
    },
    {
    path:"EmoIndicator",
    component: EmoIndicatorComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmonitorRoutingModule {}