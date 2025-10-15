import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbToastModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { FlatpickrModule } from 'angularx-flatpickr';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';

// NG2 Search Filter
import { NgPipesModule } from 'ngx-pipes';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';

import { LightboxModule } from 'ngx-lightbox';

// Load Icons
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';

// Pages Routing
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";
import { WidgetModule } from '../shared/widget/widget.module';
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';

import { ToastsContainer } from './dashboards/dashboard/toasts-container.component';
import { DashboardsModule } from "./dashboards/dashboards.module";
import { AppsModule } from "./apps/apps.module";
import { EcommerceModule } from "./ecommerce/ecommerce.module";
// import { ReportSubInventoryComponent } from "./ReportSubInventory/ReportSubInventory.component";
import { EmonitorModule } from './emonitor/emonitor.module';
import { BudgetFormModule } from './BudgetForm_Main/BudgetFromMain.module';
import { DROPZONE_CONFIG, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { M2_BugetForm_Request_IncomeModule } from './M2_BugetForm_Request_Income/M2_BugetForm_Request_Income.module';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: '#', // URL หลอก (จำเป็นต้องมี)
  autoProcessQueue: false, // ห้ามประมวลผลคิวโดยอัตโนมัติ (สำคัญมาก)
  maxFilesize: 30,
  // ปิดการตรวจสอบต่างๆ
  accept: (file, done) => done(),
  timeout: 0
};

@NgModule({
  declarations: [
    DashboardComponent,
    ToastsContainer,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    FlatpickrModule.forRoot(),
    CountUpModule,
    NgApexchartsModule,
    LeafletModule,
    NgbDropdownModule,
    SimplebarAngularModule,
    PagesRoutingModule,
    SharedModule,
    WidgetModule,
    SlickCarouselModule,
    LightboxModule,
    DashboardsModule,
    AppsModule,
    EcommerceModule,
    NgPipesModule,
    //ไม่จำเป็นต้องใช้
    // EmonitorModule,
    BudgetFormModule,
    M2_BugetForm_Request_IncomeModule,
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
