import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
// Select Droup down
import { NgSelectModule } from '@ng-select/ng-select';
// Ui Switch
import { UiSwitchModule } from 'ngx-ui-switch';
// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';
// Color Picker
import { ColorPickerModule } from 'ngx-color-picker';
// Mask
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask, IConfig } from 'ngx-mask';
// Ngx Sliders
import { NgxSliderModule } from 'ngx-slider-v2';
//Wizard
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
// Ck Editer
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// Drop Zone
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
// Auto Complate
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

// Load Icons
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';

// Component pages


import { SharedModule } from '../../shared/shared.module';
import { BasicComponent } from '../form/basic/basic.component';
import { SelectComponent } from '../form/select/select.component';
import { CheckboxsRadiosComponent } from '../form/checkboxs-radios/checkboxs-radios.component';
import { PickersComponent } from '../form/pickers/pickers.component';
import { MasksComponent } from '../form/masks/masks.component';
import { AdvancedComponent } from '../form/advanced/advanced.component';
import { RangeSlidersComponent } from '../form/range-sliders/range-sliders.component';
import { ValidationComponent } from '../form/validation/validation.component';
import { WizardComponent } from '../form/wizard/wizard.component';
import { EditorsComponent } from '../form/editors/editors.component';
import { FileUploadsComponent } from '../form/file-uploads/file-uploads.component';
import { LayoutsComponent } from '../form/layouts/layouts.component';
import { CustomCaptchaComponent } from '../form/custom-capcha/custom-captcha.component';


import { Budget_Request_IncomeComponent } from './Budget_Request_Income/Budget_Request_Income.component';
import { Budget_Request_IncomeRoutingModule } from './M2_BugetForm_Request_Income-routing.module';
import { Request_Income_DetailComponent } from './Budget_Request_Income/Request_Income_Detail/Request_Income_Detail.component';
import { Project_Form_Component } from './Budget_Request_Income/Project_Form/Project_Form.component';


import { Thai } from 'flatpickr/dist/l10n/th';

import { BudgetFormModule } from '../BudgetForm_Main/BudgetFromMain.module';


const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    url: '#', // URL หลอก (จำเป็นต้องมี)
    autoProcessQueue: false, // ห้ามประมวลผลคิวโดยอัตโนมัติ (สำคัญมาก)
    maxFilesize: 10, // ขนาดไฟล์สูงสุด (หน่วยเป็น MB)
    // ปิดการตรวจสอบต่างๆ
    accept: (file, done) => done(),
    timeout: 0
};

@NgModule({
    declarations: [
        // **Main**
        Budget_Request_IncomeComponent,
        Request_Income_DetailComponent,
        Project_Form_Component,



    ],
    imports: [
        // **โมดูล Angular พื้นฐาน**
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // **โมดูลจาก Bootstrap**
        NgbPaginationModule,
        NgbDropdownModule,
        NgbNavModule,
        NgbAccordionModule,

        // **โมดูลสำหรับ UI และฟังก์ชันเพิ่มเติม**
        NgSelectModule,
        UiSwitchModule,
        FlatpickrModule.forRoot({ locale: Thai }),
        ColorPickerModule,
        NgxMaskDirective,
        NgxMaskPipe,
        NgxSliderModule,
        CdkStepperModule,
        NgStepperModule,
        CKEditorModule,
        DropzoneModule,
        AutocompleteLibModule,

        // **โมดูลที่สร้างขึ้นเอง**
        SharedModule,
        Budget_Request_IncomeRoutingModule,

        // เอา module อื่นมาใช้
        BudgetFormModule,

    ],
    providers: [
        // **การตั้งค่า Dropzone**
        provideNgxMask(),
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class M2_BugetForm_Request_IncomeModule {
    constructor() {
        defineElement(lottie.loadAnimation);
    }
}
