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
import { MasterService } from 'src/app/core/services/master.service';


@Component({
    selector: 'Salary_Form',
    templateUrl: 'Salary_Form.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    // changeDetection: ChangeDetectionStrategy.OnPush
})

export class Salary_FormComponent {

    @Input() Form_Name: string = ''; // รับค่าจาก Component แม่
    @Input() Budget_Request_Detail_Item: any = {};
    @Input() List_Budget_Request_Detail_Item: any = [];
    @Input() List_Mas_Expense_Cost_Rate: any = [];
    @Input() Budget_Request: any = {};
    @Input() calculatedTotal_Front: string = ''; // รับค่าจาก Component แม่
    @Output() calculatedTotalChange = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่


    total$: Observable<number>;
    calculatedTotal: string = '';


    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef) {
        this.total$ = service.total$;

    }

    // ngOnInit(): void {
    //      this.calTotal_item();
    // }

    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes['List_Budget_Request_Detail_Item'] && changes['List_Budget_Request_Detail_Item'].currentValue) {
    //         // เรียกฟังก์ชัน calTotal_item() เมื่อ List_Budget_Request_Detail_Item เปลี่ยนแปลง
    //         this.calTotal_item();
    //     }
    // }



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

    choose_cost_rate(s1: any) {
        debugger;
        let item1 = this.List_Mas_Expense_Cost_Rate.filter((item: any) => item.Cost_Id == s1.Fk_Cost_Id);

        s1.Cost_Name = item1[0].Cost_Name;
        if (s1.Fk_Cost_Id != 70) {
            s1.Other_Name = null;
        }

        let c_operate = s1.Fk_Rate_Type || 0;
        if (c_operate == 0 || c_operate == 1) {
            c_operate = 1;
            s1.Fk_Rate_Type = 1;
        } else {
            c_operate = 2;
            s1.Fk_Rate_Type = 2;
        }
        if (c_operate == 2) {
            s1.Rate = item1[0].Request_Rate;
        } else {
            s1.Rate = item1[0].Request_Gov_Rate;
        }
        s1.IsRateOver = item1[0].Request_Rate_Over == true ? 1 : 0;

        let item2 = this.MasterService.list_type_pay.filter((item: any) => item.IDA == s1.Fk_Rate_Type)
        s1.Rate_Type_Name = item2[0].TYPE;
    }

    calTotal_item(): string {
        var total = 0;
        var len_item = this.List_Budget_Request_Detail_Item.length;
        for (var i = 0; i < len_item; i++) {
            total = total + (this.List_Budget_Request_Detail_Item[i].Total || 0);
        }
        this.Budget_Request.Total = total; // อัปเดตค่า Total ใน Budget_Request
        this.calculatedTotal = this.show_fix(total); // อัปเดตค่า calculatedTotal
        this.calculatedTotalChange.emit(this.calculatedTotal); // ส่งค่าไปยัง Component แม่
        // this.cdr.detectChanges(); // แจ้ง Angular ให้ตรวจสอบการเปลี่ยนแปลง

        // return this.show_fix(total); // แสดงผลรวมในรูปแบบที่จัดการแล้ว
        return this.calculatedTotal;
    }

    numberWithCommas(num: string): string {
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    show_fix(num: number): string {
        num = num || 0; // Default to 0 if num is null or undefined

        return this.numberWithCommas(num.toFixed(2));


    }



}