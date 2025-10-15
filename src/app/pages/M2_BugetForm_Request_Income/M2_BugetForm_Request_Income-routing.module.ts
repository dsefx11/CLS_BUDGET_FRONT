import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Budget_Request_IncomeComponent } from './Budget_Request_Income/Budget_Request_Income.component';


const routes: Routes = [
    {
        path: "Budget_Request_Income",
        component: Budget_Request_IncomeComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Budget_Request_IncomeRoutingModule { }