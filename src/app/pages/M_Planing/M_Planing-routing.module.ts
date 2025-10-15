import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Plan_Project_RequestComponent } from './Plan_Project_Request/Plan_Project_Request.component';


const routes: Routes = [
    {
        path: "Plan_Project_Request",
        component: Plan_Project_RequestComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class M_PlaningRoutingModule { }