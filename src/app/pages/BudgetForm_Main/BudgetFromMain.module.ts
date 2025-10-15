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

import { BudgetFormMainRountingModule } from './BudgetFromMain-rounting.module';
import { EmonitorModule } from '../emonitor/emonitor.module';
import { EmoIndicatorComponent } from '../emonitor/emoIndicator/emoIndicator.component';
import { BR_PersonalComponent } from './BR_Personal/BR_Personal.component';
import { BR_OperateComponent } from './BR_Operate/BR_Operate.component';
import { BR_InvestComponent } from './BR_Invest/BR_Invest.component';
import { BR_SubsidyComponent } from './BR_Subsidy/BR_Subsidy.component';
import { BR_OtherComponent } from './BR_Other/BR_Other.component';
import { BR_ProjectComponent } from './BR_Project/BR_Project.component';

import { Extra_Salary_Compensation_FormComponent } from './BR_Operate/Extra_Salary_Compensation_Form/Extra_Salary_Compensation_Form.component';
import { RentHome_FormComponent } from './BR_Operate/RentHome_Form/RentHome_Form.component';

import { Conference_Compensation_FormComponent } from './BR_Operate/Conference_Compensation_Form/Conference_Compensation_Form.component';
import { CarForPosition_Compensation_FormComponent } from './BR_Operate/CarForPosition_Compensation_Form/CarForPosition_Compensation_Form.component';
import { RiskSouth_Compensation_FormComponent } from './BR_Operate/RiskSouth_Compensation_Form/RiskSouth_Compensation_Form.component';
import { General_Compensation_FormComponent } from './BR_Operate/General_Compensation_Form/General_Compensation_Form.component';
import { Overtime_FormComponent } from './BR_Operate/Overtime_Form/Overtime_Form.component';
import { PublicHealth_Compensation_FormComponent } from './BR_Operate/PublicHealth_Compensation_Form/PublicHealth_Compensation_Form.component';
import { NoPrivate_Compensation_FormComponent } from './BR_Operate/NoPrivate_Compensation_Form/NoPrivate_Compensation_Form.component';
import { RentProperty_FormComponent } from './BR_Operate/RentProperty_Form/RentProperty_Form.component';
import { Salary_FormComponent } from './BR_Personal/Salary_Form/Salary_Form.component';
import { SocialSecurity_Contribution_FormComponent } from './BR_Operate/SocialSecurity_Contribution_Form/SocialSecurity_Contribution_Form.coponent';
import { TraningAndSeminors_FormComponent } from './BR_Operate/TraningAndSeminors_Form/TraningAndSeminors_Form.component';
import { General_Use_FormComponent } from './BR_Operate/General_Use_Form/General_Use_Form.component';
import { RentCar_FormComponent } from './BR_Operate/RentCar_Form/RentCar_Form.component';
import { NurseFee_AfternoonAndNight_FormComponent } from './BR_Operate/NurseFee_AfternoonAndNight_Form/NurseFee_AfternoonAndNight_Form.component';
import { Business_Travel_Form_Component } from './BR_Operate/Business_Travel_Form/Business_Travel_Form.component';
import { Other_Service_FormComponent } from './BR_Operate/Other_Service_Form/Other_Service_Form.component';
import { Repair_Vehicle_FormComponent } from './BR_Operate/Repair_Vehicle_Form/Repair_Vehicle_Form.component';
import { Repair_Buildings_FormComponent } from './BR_Operate/Repair_Buildings_Form/Repair_Buildings_Form.component';
import { Repair_Articles_FormComponent } from './BR_Operate/Repair_Articles_Form/Repair_Articles_Form.component';
import { Material_FormComponent } from './BR_Operate/Material_Form/Material_Form.component';
import { Utility_FormComponent } from './BR_Operate/Utility_Form/Utility_Form.component';
import { Subsidy_FormComponent } from './BR_Subsidy/Subsidy_Form/Subsidy_Form.component';
import { Consultant_Form_Component } from './BR_Other/Consultant_Form/Consultant_Form.component';
import { Abroad_FormComponent } from './BR_Other/Abroad_Form/Abroad_Form.component';
import { Project_FormComponent } from './BR_Project/Project_Form/Project_Form.component';
import { Articles_FormComponent } from './BR_Invest/Articles_Form/Articles_Form.component';
import { Request_Buildings_FormComponent } from './BR_Invest/Request_Buildings_Form/Request_Buildings_Form.coponent';
import { Buildings_FormComponent } from './BR_Invest/Buildings_Form/Buildings_Form.component';
import { Project_Development_FormComponent } from './BR_Project/Project_Development_Form/Project_Development_Form.component';






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
        BR_PersonalComponent,
        BR_OperateComponent,
        BR_InvestComponent,
        BR_SubsidyComponent,
        BR_OtherComponent,
        BR_ProjectComponent,

        //งบบุคลากร
        Salary_FormComponent,
        RentHome_FormComponent,
        Extra_Salary_Compensation_FormComponent,

        // งบดำเนินงาน
        Conference_Compensation_FormComponent,
        CarForPosition_Compensation_FormComponent,
        RiskSouth_Compensation_FormComponent,
        General_Compensation_FormComponent,
        Overtime_FormComponent,
        PublicHealth_Compensation_FormComponent,
        NoPrivate_Compensation_FormComponent,
        RentProperty_FormComponent,
        SocialSecurity_Contribution_FormComponent,
        TraningAndSeminors_FormComponent,
        General_Use_FormComponent,
        RentCar_FormComponent,
        NurseFee_AfternoonAndNight_FormComponent,
        Business_Travel_Form_Component,
        Other_Service_FormComponent,
        Repair_Vehicle_FormComponent,
        Repair_Buildings_FormComponent,
        Repair_Articles_FormComponent,
        Material_FormComponent,
        Utility_FormComponent,

        // งบลงทุน
        Articles_FormComponent,
        Request_Buildings_FormComponent,
        Buildings_FormComponent,

        //งบเงินอุดหนุน   
        Subsidy_FormComponent,

        // งบรายจ่ายอื่น
        Consultant_Form_Component,
        Abroad_FormComponent,

        //งบประมาณโครงการ
        Project_FormComponent, //จะไม่ใช้ละ ชื่อมันซํ้ากับเงินรายได้
        Project_Development_FormComponent

    ],
    exports: [
        //เอาไปใช้หน้า ฺ BG_Income คำขอเงินรายได้
        Overtime_FormComponent,
        Conference_Compensation_FormComponent,
        PublicHealth_Compensation_FormComponent,
        NoPrivate_Compensation_FormComponent,
        Other_Service_FormComponent,
        Repair_Vehicle_FormComponent,
        Repair_Articles_FormComponent,
        Repair_Buildings_FormComponent,
        RentCar_FormComponent,
        Articles_FormComponent,
        Buildings_FormComponent,
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
        FlatpickrModule,
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
        BudgetFormMainRountingModule,
        EmonitorModule,
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
export class BudgetFormModule {
    constructor() {
        defineElement(lottie.loadAnimation);
    }
}
