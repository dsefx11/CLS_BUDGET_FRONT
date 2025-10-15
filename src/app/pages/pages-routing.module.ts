import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Component pages
import { DashboardComponent } from "./dashboards/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./BudgetForm_Main/BudgetFromMain.module').then(m => m.BudgetFormModule)
  },
  {
    path: 'BudgetFromMain', loadChildren: () => import('./BudgetForm_Main/BudgetFromMain.module').then(m => m.BudgetFormModule)
  },
  {
    path: 'M2_BugetForm_Request_Income', loadChildren: () => import('./M2_BugetForm_Request_Income/M2_BugetForm_Request_Income.module').then(m => m.M2_BugetForm_Request_IncomeModule)
  },
  {
    path: 'M_Planing', loadChildren: () => import('./M_Planing/M_Planing.module').then(m => m.M_PlaningModule)
  },
  {
    path: 'Manage_Master', loadChildren: () => import('./Manage_Master/Master_Manage.module').then(m => m.Manage_MasterModule)
  },
  {
    path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
  },
  {
    path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule)
  },
  {
    path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule)
  },
  {
    path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)
  },
  {
    path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule)
  },
  {
    path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule)
  },
  {
    path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule)
  },
  {
    path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(m => m.TicketsModule)
  },
  {
    path: 'pages', loadChildren: () => import('./extrapages/extraspages.module').then(m => m.ExtraspagesModule)
  },
  { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  {
    path: 'advance-ui', loadChildren: () => import('./advance-ui/advance-ui.module').then(m => m.AdvanceUiModule)
  },
  {
    path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule)
  },
  {
    path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
  },
  {
    path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
  },
  {
    path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule)
  },
  {
    path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
  },
  {
    path: 'marletplace', loadChildren: () => import('./nft-marketplace/nft-marketplace.module').then(m => m.NftMarketplaceModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
