import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BR_OperateComponent } from './BR_Operate/BR_Operate.component';
import { BR_InvestComponent } from './BR_Invest/BR_Invest.component';
import { BR_SubsidyComponent } from './BR_Subsidy/BR_Subsidy.component';
import { BR_OtherComponent } from './BR_Other/BR_Other.component';
import { BR_ProjectComponent } from './BR_Project/BR_Project.component';
import { BR_PersonalComponent } from './BR_Personal/BR_Personal.component';



const routes: Routes = [
    {
        path: "",
        component: BR_OperateComponent
    },
    {
        path: "1",
        component: BR_PersonalComponent
    },
    {
        path: "2",
        component: BR_OperateComponent
    },
    {
        path: "BR_Personal",
        component: BR_PersonalComponent
    },
    {
        path: "BR_Operate",
        component: BR_OperateComponent
    },
    {
        path: "BR_Invest",
        component: BR_InvestComponent
    },
    {
        path: "BR_Subsidy",
        component: BR_SubsidyComponent
    },
    {
        path: "BR_Other",
        component: BR_OtherComponent
    },
    {
        path: "BR_Project",
        component: BR_ProjectComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BudgetFormMainRountingModule { }