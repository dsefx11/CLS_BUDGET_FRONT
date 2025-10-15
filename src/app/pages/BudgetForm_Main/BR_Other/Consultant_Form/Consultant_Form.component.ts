import { SimpleChanges, Component, Input, Output, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, OnInit, ChangeDetectionStrategy, EventEmitter, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, FormControl, FormControlName, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridJsService } from '../../../tables/gridjs/gridjs.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { GridJsModel } from '../../../tables/gridjs/gridjs.model';
import { DecimalPipe } from '@angular/common';
import { get } from 'lodash';
import Swal from 'sweetalert2';
import { EbudgetService } from 'src/app/core/services/ebudget.service';
import { e } from 'mathjs';
import { number } from 'echarts';
import { ChangeDetectorRef } from '@angular/core';
import { dE } from '@fullcalendar/core/internal-common';
import { MasterService } from 'src/app/core/services/master.service';


@Component({
    selector: 'Consultant_Form',
    templateUrl: 'Consultant_Form.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    styleUrls: ['../BR_Other.component.scss'],
})

export class Consultant_Form_Component {

    @Input() Form_Name: string = ''; // รับค่าจาก Component แม่
    @Input() Budget_Request_Detail_Item: any = {};
    @Input() List_Budget_Request_Detail_Item: any = [];
    @Input() Budget_Request: any = {};
    @Input() calculatedTotal_Front: string = ''; // รับค่าจาก Component แม่
    @Output() calculatedTotalChange = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่
    @Input() List_Mas_Expense_Material_List: any = [];// รับค่าจาก Component แม่
    @Input() List_All: any = [];// รับค่าจาก Component แม่


    total$: Observable<number>;
    calculatedTotal: string = '';


    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef) {
        this.total$ = service.total$;
    }



    add_new_Form() { //เพิ่มโครงการ

        let mock = {
            Fk_Request_Detail_Id: 0,
            Project_Name: "",
            List_Budget_Request_Detail_Item: [],
        }
        this.List_All.push(mock);
    }

    del_Form(index: number) {  //ลบ Form
        this.List_All.splice(index, 1);
    };

    add_form_detail(Form_data: any) {
        Form_data.List_Budget_Request_Detail_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Detail_Item)));
    }


    btn_del_Detail_item = (index: number, Form_item: any): void => {
        Form_item.List_Budget_Request_Detail_Item.splice(index, 1);
        this.Cal_Total_All_Form(); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมทั้งหมดของ Form ทั้งหมด
    };

    allowDecimal(event: KeyboardEvent): boolean {
        const charCode = event.which ? event.which : event.keyCode;

        // อนุญาตเฉพาะตัวเลข (0-9), จุดทศนิยม (.)
        if (
            (charCode >= 48 && charCode <= 57) || // ตัวเลข 0-9
            charCode === 46 // จุดทศนิยม
        ) {
            return true;
        }

        // ป้องกันการป้อนตัวอักษรหรือสัญลักษณ์อื่น ๆ
        event.preventDefault();
        return false;
    }

    choose_ddl_Expense_Material_List(data: any) {
        let c_item = this.List_Mas_Expense_Material_List.filter((item: any) => item.Material_Id == data.Material_Id)
        data.Material_Name = c_item[0].Material_Name;
    }

    onChangeCheckBox_Level_Edu(currentValue: number, selectedValue: number, data: any): void {
        if (currentValue !== selectedValue) {
            data.Level_Edu_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                data.Level_Edu_Name = "ป.ตรี";
            } else if (selectedValue == 2) {
                data.Level_Edu_Name = "ป.โท";
            } else if (selectedValue == 3) {
                data.Level_Edu_Name = "ป.เอก";
            }
        } else {
            data.Level_Edu_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
        }
    }



    Cal_Total_All_Form() { // คำนวณผลรวมทั้งหมดของ Form ทั้งหมด
        let total = 0;
        let total_detial = 0;
        let len_item = this.List_All.length;
        for (let i = 0; i < len_item; i++) {
            let len_item_detial = this.List_All[i].List_Budget_Request_Detail_Item.length;
            for (let i2 = 0; i2 < len_item_detial; i2++) {
                total_detial = total_detial + this.List_All[i].List_Budget_Request_Detail_Item[i2].Total;
            }
        }

        this.Budget_Request.Total = total_detial; // อัปเดตค่า Total ใน Budget_Request ส่งไปยัง Component แม่
        this.calculatedTotalChange.emit(this.Budget_Request.Total); // ส่งค่าไปยัง Component แม่
        this.calculatedTotal_Front = ""; // รีเซ็ตค่า calculatedTotal_Front
    }

    calculateTotalForForm(form: any): number {
        let total = 0;
        form.List_Budget_Request_Detail_Item.forEach((item: any) => {
            total += item.Total || 0; // ตรวจสอบว่ามีค่า Total หรือไม่
        });
        return total;
    }

    cal_qty_item(data: any, Form_data: any) { // คำนวณผลรวม Total Item
        let Total = data.Quantity * data.Qty_Month * data.Cost_Amount
        data.Total = Total;

        // this.calTotal_item(Form_data); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมใหม่หลังจากการเปลี่ยนแปลงค่า
        Form_data.calculatedTotal = this.calculateTotalForForm(Form_data); // อัปเดตผลรวมของฟอร์ม

        this.Cal_Total_All_Form(); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมทั้งหมดของ Form ทั้งหมด
    }










}