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
    selector: 'Overtime_Form',
    templateUrl: 'Overtime_Form.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    styleUrls: ['../BR_Operate.component.scss'],
})

export class Overtime_FormComponent implements OnInit {

    @Input() Form_Name: string = ''; // รับค่าจาก Component แม่
    @Input() Budget_Request_Detail_Item: any = {};
    @Input() List_Budget_Request_Detail_Item: any = [];
    BG_Income_List_Budget_Request_Detail_Item: any = [];
    @Input() Budget_Request: any = {};
    @Input() calculatedTotal_Front: string = ''; // รับค่าจาก Component แม่
    @Output() calculatedTotalChange = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่
    @Input() List_Mas_Expense_Cost_Rate: any = [];
    @Input() showAddButton: boolean = true; // ควบคุมการแสดงปุ่มเพิ่มข้อมูล

    @Input() Select_Form_Module: string = '';
    total$: Observable<number>;
    calculatedTotal: string = '';



    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef) {
        this.total$ = service.total$;
    }



    ngOnInit() {
        if (this.Select_Form_Module == 'BG_Income') {
            this.showAddButton = false;
        } else {
            this.showAddButton = true;
        }
    }

    add_form_detail() {
        this.List_Budget_Request_Detail_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Detail_Item)));
        this.BG_Income_List_Budget_Request_Detail_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Detail_Item)));
        console.log(this.List_Budget_Request_Detail_Item);
    }

    // เพิ่ม method เพื่อ restore ข้อมูลเมื่อ component ถูก re-render



    btn_del_Detail_item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Detail_Item.length) {
            this.List_Budget_Request_Detail_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };

    choose_ddl_cost_rate(index: number, data: any) {
        let c_item = this.List_Mas_Expense_Cost_Rate.filter((item: any) => item.Cost_Id == data.Fk_Cost_Id)
        data.Cost_Name = c_item[0].Cost_Name;

        data.Qty_Hour = 0; //clear value

        let rate_hour = c_item[0].Request_Rate; //ค่าตอบแทน/ชม.

        this.List_Budget_Request_Detail_Item[index].Cost_Amount = rate_hour;
    }

    Cal_Pay_Hour(index: number) {
        let Total = ((this.List_Budget_Request_Detail_Item[index].People * this.List_Budget_Request_Detail_Item[index].Qty_Day) * this.List_Budget_Request_Detail_Item[index].Qty_Hour) * this.List_Budget_Request_Detail_Item[index].Cost_Amount
        this.List_Budget_Request_Detail_Item[index].Total = Total;
        this.calTotal_item(); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมใหม่หลังจากการเปลี่ยนแปลงค่า
    }

    Chk_Hour(index: number, Fk_Cost_Id: number, Qty_Hour: number, item: any) {

        if (Fk_Cost_Id == 34 && Qty_Hour > 4) { //วันทำการ
            Swal.fire(
                'จำนวน ชม./วัน',
                'ไม่สามารถทำได้มากกว่า 4 ชั่วโมง',
                'error'
            )
            item.Qty_Hour = "";
            item.Total = "";
        } else if (Fk_Cost_Id == 35 && Qty_Hour > 8) { //วันหยุด
            Swal.fire(
                'จำนวน ชม./วัน',
                'ไม่สามารถทำได้มากกว่า 8 ชั่วโมง',
                'error'
            )
            item.Qty_Hour = "";
            item.Total = "";
        } else {
            var Total = ((this.List_Budget_Request_Detail_Item[index].People * this.List_Budget_Request_Detail_Item[index].Qty_Day) * Qty_Hour) * this.List_Budget_Request_Detail_Item[index].Cost_Amount
            this.List_Budget_Request_Detail_Item[index].Total = Total;
            this.calTotal_item(); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมใหม่หลังจากการเปลี่ยนแปลงค่า
        }


    }

    calTotal_item(): string {
        debugger;
        let total = 0;
        let len_item = this.List_Budget_Request_Detail_Item.length;
        for (let i = 0; i < len_item; i++) {
            total = total + (this.List_Budget_Request_Detail_Item[i].Total || 0);
        }

        this.Budget_Request.Total = total; // อัปเดตค่า Rent_Per_Year ใน Budget_Request ส่งไปยัง Component แม่
        this.calculatedTotal = this.MasterService.show_fix(total); // อัปเดตค่า calculatedTotal แสดงผลรวม Total
        this.calculatedTotalChange.emit(this.Budget_Request.Total); // ส่งค่าไปยัง Component แม่
        this.calculatedTotal_Front = ""; // รีเซ็ตค่า calculatedTotal_Front

        return this.calculatedTotal;
    }



}