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

interface YearData {
    year: number;
    amount: number;
    price: number;
    total: number;
}

@Component({
    selector: 'Request_Buildings_Form',
    templateUrl: 'Request_Buildings_Form.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    styleUrls: ['../BR_Invest.component.scss'],
})

export class Request_Buildings_FormComponent implements OnInit {

    @Input() Form_Name: string = ''; // รับค่าจาก Component แม่
    @Input() Budget_Request_Detail_Item: any = {};
    @Input() List_Budget_Request_Detail_Item: any = [];
    @Input() Budget_Request: any = {};
    @Input() calculatedTotal_Front: string = ''; // รับค่าจาก Component แม่
    @Output() calculatedTotalChange = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่
    @Input() List_Mas_Importance: any = [];
    @Input() List_Mas_Expense_Material_List: any = [];
    @Input() Bgyear: any = [];


    total$: Observable<number>;
    calculatedTotal: string = '';




    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef) {
        this.total$ = service.total$;
    }

    ngOnInit() {

    }

    generateYearRange(data: any): number[] {
        const years: number[] = [];

        if (data.Building_Type_Id === 1) {
            years.push(parseInt(this.Bgyear));
        } else if (data.Building_Type_Id === 2) {
            // สร้างช่วงปี 2568-2572 (5 ปี)
            for (let i = 0; i < 5; i++) {
                years.push(parseInt(this.Bgyear) + i);
            }
        }
        return years;
    }


    add_form_detail() {
        this.List_Budget_Request_Detail_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Detail_Item)));
    }


    btn_del_Detail_item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Detail_Item.length) {
            this.List_Budget_Request_Detail_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };


    Choose_ddl_Mas_Importance(data: any) {
        let c_item = this.List_Mas_Importance.filter((item: any) => item.Importance_Id == data.Importance_Id)
        data.Importance_Name = c_item[0].Importance_Name;
    }

    onChangeCheckBox_Building_Type(currentValue: number, selectedValue: number, data: any): void {
        if (currentValue !== selectedValue) {
            data.Building_Type_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                data.Building_Type_Name = "ปีเดียว";
            } else if (selectedValue == 2) {
                data.Building_Type_Name = "ผูกผัน";
            } else {
                data.Building_Type_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
            this.OnChange_calculateTotal_Year(data);
        }
    }



    OnChange_calculateTotal_Year(data: any) {
        // คำนวณ Total_Building_1 สำหรับปีเดียว
        if (data.Building_Type_Id === 1) {
            data.Total_Building_1 =
                (Number(data.Qty_Building_1) || 0) * (Number(data.Price_Building_1) || 0);
        }

        // คำนวณ Total_Building_1-4 สำหรับผูกผัน
        if (data.Building_Type_Id === 2) {
            for (let j = 1; j <= 4; j++) {
                data['Total_Building_' + j] =
                    (Number(data['Qty_Building_' + j]) || 0) * (Number(data['Price_Building_' + j]) || 0);
            }
        }

        // คำนวณยอดรวมทั้งหมด
        let total = 0;
        let len_item = this.List_Budget_Request_Detail_Item.length;
        for (let i = 0; i < len_item; i++) {
            const item = this.List_Budget_Request_Detail_Item[i];
            let itemTotal = 0;

            if (item.Building_Type_Id === 1) {
                itemTotal = Number(item.Total_Building_1) || 0;
            } else if (item.Building_Type_Id === 2) {
                for (let j = 1; j <= 4; j++) {
                    itemTotal += Number(item['Total_Building_' + j]) || 0;
                }
            }

            item.Total = itemTotal;
            total += itemTotal;
        }

        // อัปเดตค่าและส่งไปยัง Component แม่
        this.Budget_Request.Total = total;
        this.calculatedTotal = this.MasterService.show_fix(total); // สำหรับแสดงผล (string)
        this.calculatedTotalChange.emit(this.Budget_Request.Total); // ส่งค่า string ไป Main
        this.calculatedTotal_Front = "";
    }

    calTotal_item(): string {
        debugger;
        let total = 0;
        let len_item = this.List_Budget_Request_Detail_Item.length;
        for (let i = 0; i < len_item; i++) {
            const item = this.List_Budget_Request_Detail_Item[i];
            // รวม total ของแต่ละปี (รองรับทั้งปีเดียวและผูกพัน)
            const years = this.generateYearRange(item) || [];
            let itemTotal = 0;
            years.forEach(year => {
                itemTotal += Number(item[`total_${year}`]) || 0;
            });
            item.Total = itemTotal; // อัปเดต Total ของแต่ละรายการ
            total += itemTotal;
        }

        this.Budget_Request.Total = total; // อัปเดตค่า Rent_Per_Year ใน Budget_Request ส่งไปยัง Component แม่
        this.calculatedTotal = this.MasterService.show_fix(total); // อัปเดตค่า calculatedTotal แสดงผลรวม Total
        this.calculatedTotalChange.emit(this.Budget_Request.Total); // ส่งค่าไปยัง Component แม่
        this.calculatedTotal_Front = ""; // รีเซ็ตค่า calculatedTotal_Front

        return this.calculatedTotal;
    }



    cal_qty_item(data: any) {
        let Total = data.Quantity * data.Price
        data.Total = Total;
        this.calTotal_item(); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมใหม่หลังจากการเปลี่ยนแปลงค่า
    }






}