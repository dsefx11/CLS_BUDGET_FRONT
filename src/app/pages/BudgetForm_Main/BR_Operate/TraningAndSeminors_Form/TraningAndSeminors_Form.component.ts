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
import { A, dE, el } from '@fullcalendar/core/internal-common';
import { MasterService } from 'src/app/core/services/master.service';


@Component({
    selector: 'TraningAndSeminors_Form',
    templateUrl: 'TraningAndSeminors_Form.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    styleUrls: ['../BR_Operate.component.scss'],
})

export class TraningAndSeminors_FormComponent implements OnInit {

    @Input() Form_Name: string = ''; // รับค่าจาก Component แม่
    @Input() Budget_Request_Detail: any = {}; // รับค่าจาก Component แม่
    @Input() Budget_Request_Detail_Item: any = {};
    @Input() List_Budget_Request_Detail_Item: any = [];
    @Input() Budget_Request: any = {};
    @Input() calculatedTotal_Front: string = ''; // รับค่าจาก Component แม่
    @Output() calculatedTotalChange = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่
    @Input() List_Mas_Expense_Cost_Rate: any = []; // รับค่าจาก Component แม่
    @Input() List_Mas_Department: any = [];
    @Input() List_Mas_Unit: any = [];   // รับค่าจาก Component แม่
    @Input() List_Type_Pay: any = []; // รับค่าจาก Component แม่


    total$: Observable<number>;
    calculatedTotal: string = '';


    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef) {
        this.total$ = service.total$;
    }


    ngOnInit() {

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

    onChangeCheckBox_Place_Operation(currentValue: number, selectedValue: number): void {
        if (currentValue !== selectedValue) {
            this.Budget_Request_Detail.Place_Operation = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                this.Budget_Request_Detail.Place_Operation_Name = "ราชการ";
            } else if (selectedValue == 2) {
                this.Budget_Request_Detail.Place_Operation_Name = "เอกชน";
            }
        } else {
            this.Budget_Request_Detail.Place_Operation = null; // ยกเลิกการเลือกหากคลิกซ้ำ
        }
    }

    choose_cost_rate(data: any) {

        let item1 = this.List_Mas_Expense_Cost_Rate.filter((item: any) => item.Cost_Id == data.Fk_Cost_Id);

        data.Cost_Name = item1[0].Cost_Name;
        if (data.Fk_Cost_Id != 70) {
            data.Other_Name = null;
        }

        let c_operate = data.Fk_Rate_Type || 0;
        if (c_operate == 0 || c_operate == 1) {
            c_operate = 1;
            data.Fk_Rate_Type = 1;
        } else {
            c_operate = 2;
            data.Fk_Rate_Type = 2;
        }
        if (c_operate == 2) {
            data.Rate = item1[0].Request_Rate;
        } else {
            data.Rate = item1[0].Request_Gov_Rate;
        }
        data.IsRateOver = item1[0].Request_Rate_Over == true ? 1 : 0;

        let item2 = this.MasterService.list_type_pay.filter((item: any) => item.IDA == data.Fk_Rate_Type)
        data.Rate_Type_Name = item2[0].TYPE;
    }

    choose_unit(data: any) {
        let c_item = this.List_Mas_Unit.filter((item: any) => item.Unit_Id == data.Fk_Unit_Id)
        data.Unit_Name = c_item[0].Unit_Name;
    }

    choose_ddl_department(data: any) {
        let c_item = this.List_Type_Pay.filter((item: any) => item.Department_Id == data.Department_Id)
        data.Department_Name = c_item[0].Department_Name;
    }

    calTotal_item(): string {
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

    cal_SumPeople(data: any) {
        // data.Sum_People = (this.List_Budget_Request_Detail_Item[index].People_Type_A || 0) + (this.List_Budget_Request_Detail_Item[index].People_Type_B || 0) + (this.List_Budget_Request_Detail_Item[index].People_Type_C || 0);
        data.Sum_People = (data.People_Type_A || 0) + (data.People_Type_B || 0) + (data.People_Type_C || 0);
        // return this.MasterService.show_fix(data.Sum_People);
    }

    cal_SumTotal(data: any) {
        // data.Total = (this.List_Budget_Request_Detail_Item[index].Times || 0) * (this.List_Budget_Request_Detail_Item[index].Sum_People || 0) * (this.List_Budget_Request_Detail_Item[index].Quantity || 0) * (this.List_Budget_Request_Detail_Item[index].Rate || 0);
        data.Total = (data.Times || 0) * (data.Sum_People || 0) * (data.Quantity || 0) * (data.Rate || 0);
        // return this.MasterService.show_fix(data.Total);

        this.calTotal_item(); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมใหม่หลังจากการเปลี่ยนแปลงค่า
    }






}