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

interface MonthPlan {
    name: string;
    number: string;
    year: number;
}

@Component({
    selector: 'Request_Income_Detail',
    templateUrl: 'Request_Income_Detail.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    styleUrls: ['../../M2_BugetForm_Request_Income.scss'],
})

export class Request_Income_DetailComponent implements OnInit {

    @Input() Sub_From_Name: string = ''; // รับค่าจาก Component แม่
    @Input() Budget_Request_Income_Multi_Item: any = {};
    @Input() List_Budget_Request_Income_Multi_Item: any = [];
    @Input() List_Mas_Request_Income_Detail: any = []; // รับค่าจาก Component แม่
    @Input() Budget_Request_Income: any = {};
    @Input() calculatedTotal_Front: string = ''; // รับค่าจาก Component แม่
    @Output() calculatedTotalChange = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่
    @Input() Bgyear: number = 0; // ปีงบประมาณที่เลือก
    @Input() Department_Id: number = 0; // รหัสหน่วยงานที่เลือก

    @Input() List_Budget_Request_Detail_Item: any = []; // รับค่าจาก Component แม่
    @Input() Budget_Request_Detail_Item: any = {}; // รับค่าจาก Component แม่
    // @Output() Income_Select_Sub_From_Name = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่

    List_Mas_Expense_Cost_Rate: any = []; //อัตราค่าตอบแทน
    total$: Observable<number>;
    calculatedTotal: string = '';

    fiscalYear: number = 0; // ปีงบประมาณปัจจุบัน
    months: MonthPlan[] = [];
    Select_Form_Module: string = '';

    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef) {
        this.total$ = service.total$;
    }

    ngOnInit() {
        this.generateMonthPlan();
        const Dep_Id = this.Department_Id; //รหัสหน่วยงาน Get From User
        this.Select_Form_Module = "BG_Income";
        let Fk_Expense_Id = 0;

        if (this.Sub_From_Name == 'ค่าอาหารทำการล่วงเวลา') {
            Fk_Expense_Id = 20;
        }

        let model = {
            FUNC_CODE: "FUNC-GET_DATA-Sub_Form",
            Fk_Expense_Id: Fk_Expense_Id
        }
        var getData = this.serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            // debugger;
            if (response.RESULT == null) {
                this.List_Mas_Expense_Cost_Rate = response.List_Mas_Expense_Cost_Rate; // อัตราค่าตอบแทน
            } else {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: response.RESULT,
                    icon: 'warning',
                    //showCancelButton: true,
                    confirmButtonColor: 'rgb(3, 142, 220)',
                    // cancelButtonColor: 'rgb(243, 78, 78)',
                    confirmButtonText: 'OK'
                });
            }
        });
    }


    add_form_detail_overtime() {
        this.List_Budget_Request_Detail_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Detail_Item)));
    }


    add_form_detail() {
        this.List_Budget_Request_Income_Multi_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Income_Multi_Item)));
    }

    generateMonthPlan() {
        this.fiscalYear = this.Bgyear; // ใช้ปีงบประมาณที่รับเข้ามา
        const thaiMonths = ['ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค.', 'ก.พ.', 'มี.ค.',
            'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.'];
        const Number_Month = ['10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        // สร้างเดือนตามปีงบประมาณ
        for (let i = 0; i < 12; i++) {
            const year = i < 3 ? this.fiscalYear - 1 : this.fiscalYear;
            this.months.push({
                name: thaiMonths[i],
                number: Number_Month[i],
                year: year,
            });
        }
    }


    btn_del_Detail_item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Income_Multi_Item.length) {
            this.List_Budget_Request_Income_Multi_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };


    Choose_Mas_Request_Income_Detail(data: any) {
        let c_item = this.List_Mas_Request_Income_Detail.filter((item: any) => item.Request_Income_Detail_Id == data.List_Name_Id)
        data.List_Name = c_item[0].Request_Name;
    }

    cal_qty_plan(item: any) {
        // หาค่าใน item
        const qtys = [item.Plan1_Qty, item.Plan2_Qty, item.Plan3_Qty, item.Plan4_Qty]
            .filter(val => val !== null && val !== undefined && val !== '' && !isNaN(val));
        if (qtys.length === 0) {
            item.Month_Qty_Total = null;
        } else {
            // รวมแผนงาน
            item.Month_Qty_Total = qtys.reduce((acc, val) => acc * Number(val), 1);
        }
        // รวมรายการ
        item.Plan_Qty_Total = [item.Plan1_Qty, item.Plan2_Qty, item.Plan3_Qty, item.Plan4_Qty]
            .filter(val => val !== null && val !== undefined && val !== '' && !isNaN(val))
            .reduce((acc, val) => acc + Number(val), 0);
        console.log(item);
    }

    cal_qty_month(item: any) {
        const monthFields = [
            'Month10_Qty', 'Month11_Qty', 'Month12_Qty', 'Month1_Qty', 'Month2_Qty', 'Month3_Qty',
            'Month4_Qty', 'Month5_Qty', 'Month6_Qty', 'Month7_Qty', 'Month8_Qty', 'Month9_Qty'
        ];
        let total = 0;
        let prevTotal = 0;
        for (let field of monthFields) {
            let val = item[field];
            if (val !== null && val !== undefined && val !== '' && !isNaN(val)) {
                prevTotal = total;
                total += Number(val);
                if (total > item.Plan_Qty_Total) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'ผลรวมรายเดือน',
                        html: '<span style="color: red;">ยอดต้องไม่เกิน ' + item.Plan_Qty_Total + '</span>',
                        confirmButtonText: 'ตกลง'
                    });
                    item[field] = '';
                    total = prevTotal;
                    break;
                }
            }
        }
        item.Plan_Qty_Total = total === 0 ? null : total;
    }

    cal_qty_month_amount(item: any) {
        const monthFields = [
            'Month10_Amount', 'Month11_Amount', 'Month12_Amount', 'Month1_Amount', 'Month2_Amount', 'Month3_Amount',
            'Month4_Amount', 'Month5_Amount', 'Month6_Amount', 'Month7_Amount', 'Month8_Amount', 'Month9_Amount'
        ];
        let total = 0;
        let prevTotal = 0;
        for (let field of monthFields) {
            let val = item[field];
            if (val !== null && val !== undefined && val !== '' && !isNaN(val)) {
                total += Number(val);
                if (total > item.Month_Qty_Total) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'ผลรวมรายการ',
                        html: '<span style="color: red;">ยอดต้องไม่เกิน ' + this.MasterService.show_fix_nozero(item.Month_Qty_Total) + '</span>',
                        confirmButtonText: 'ตกลง'
                    });
                    item[field] = '';
                    total = prevTotal;
                    break;
                }
            }
            item.Month_Amount_Total = total === 0 ? null : total;
        }
        this.calTotal_item(); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมใหม่หลังจากการเปลี่ยนแปลงค่า
    }

    calTotal_item(): string {
        debugger;
        let total = 0;
        let len_item = this.List_Budget_Request_Income_Multi_Item.length;
        for (let i = 0; i < len_item; i++) {
            total = total + (this.List_Budget_Request_Income_Multi_Item[i].Month_Amount_Total || 0);
        }

        this.Budget_Request_Income.Total = total; // อัปเดตค่า Rent_Per_Year ใน Budget_Request ส่งไปยัง Component แม่
        this.calculatedTotal = this.MasterService.show_fix(total); // อัปเดตค่า calculatedTotal แสดงผลรวม Total
        this.calculatedTotalChange.emit(this.Budget_Request_Income.Total); // ส่งค่าไปยัง Component แม่
        this.calculatedTotal_Front = ""; // รีเซ็ตค่า calculatedTotal_Front

        return this.calculatedTotal;
    }



    cal_qty_item(data: any) {
        let Total = data.Quantity * data.Price
        data.Total = Total;
        // this.calTotal_item(); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมใหม่หลังจากการเปลี่ยนแปลงค่า
    }






}