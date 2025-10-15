import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Permission_Menu_MainComponent } from './Permission_Menu_Main/Permission_Menu_Main.component';
import { Manage_Permission_GroupComponent } from './Manage_Permission_Group/Manage_Permission_Group.component';




const routes: Routes = [
    {
        path: "",
        component: Permission_Menu_MainComponent
    },
    {
        path: "Permission_Menu_Main",
        component: Permission_Menu_MainComponent
    },
    {
        path: "Manage_Permission_Group",
        component: Manage_Permission_GroupComponent
    }


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MasterManageRoutingModule { }
