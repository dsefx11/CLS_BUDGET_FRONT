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
    selector: 'Plan_Project_Request_Detail_Form',
    templateUrl: 'Plan_Project_Request_Detail_Form.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    styleUrls: ['../../M_Planing.scss'],
})

export class Plan_Project_Request_Detail_FormComponent implements OnInit {

    @Input() Form_Name: string = ''; // รับค่าจาก Component แม่
    @Input() Bgyear: number = 0; // ปีงบประมาณที่เลือก
    @Input() Department_Id: number = 0; // รหัสหน่วยงานที่เลือก

    @Input() Budget_Request_Detail: any = []; // ข้อมูลทั้งหมด วางแผนโครงการ

    @Input() List_Mas_Project: any = []; // รับค่าจาก Component แม่

    @Input() add: string = ''; // รับค่าจาก Component แม่
    //Head
    @Input() Budget_Plan_Project: any = {}; // ข้อมูลทั้งหมด วางแผนโครงการ

    // Input DDL
    @Input() Budget_Plan_Project_Detail: any = {}; // รับค่าจาก Component แม่
    @Input() Budget_Request_Income_Strategy_Sub_Item: any = {}; // รับค่าจาก Component แม่
    @Input() Budget_Request_Income_Consistency_MS_Plan_Item: any = {}; // รับค่าจาก Component แม่
    @Input() List_Budget_Plan_Project_Strategy_Sub_Item: any = []; // รับค่าจาก Component แม่


    List_Mas_National_Strategy: any = [];
    List_Mas_Strategy_Head_Issue: any = [];
    List_Sub_Mas_Strategy_Head_Issue: any = [];
    Old_List_Mas_Strategy_Head_Issue: any = [];
    List_Mas_Strategy_Sub_Issue: any = [];
    Old_List_Mas_Strategy_Sub_Issue: any = [];

    List_Sec_Mas_National_Strategy: any = [];
    List_Sec_Sub_Mas_Strategy_Head_Issue: any = [];
    List_Sec_Strategy_Sub_Issue: any = [];

    List_Mas_Project_Consistency: any = [];
    List_Mas_Project_Consistency_Sub: any = [];
    Old_List_Mas_Project_Consistency_Sub: any = [];

    //2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
    List_Mas_MasterPlan_Under_Nationnal_Strategy: any = [];
    List_Mas_MasterPlan_Target: any = [];
    Old_List_Mas_MasterPlan_Target: any = [];
    List_Mas_Sub_MasterPlan: any = [];
    Old_List_Mas_Sub_MasterPlan: any = [];
    List_Mas_Sub_MasterPlan_Target: any = [];
    Old_List_Mas_Sub_MasterPlan_Target: any = [];
    List_Mas_Sub_MasterPlan_Develop: any = [];
    Old_List_Mas_Sub_MasterPlan_Develop: any = [];


    // ตัวแปรสำหรับเก็บช่วงวันที่
    // dateRange: Date[] = [];
    dateRange: { from: Date | null, to: Date | null } = { from: null, to: null };

    Show_Plan_Week: boolean = false;
    Show_Multi_Detail: boolean = false;
    Show_Multi_Detail_Map: { [key: number]: boolean } = {}; // เก็บสถานะการแสดงรายการตัวคูณสำหรับแต่ละ multi_id
    Show_Plan_Week_Map: { [key: string]: boolean } = {}; // เก็บสถานะการแสดงวางแผนรายสัปดาห์สำหรับแต่ละเดือน

    // เก็บ reference ของ modal ที่เปิดอยู่
    private weekPlanModal: any = null;
    private weekPlanModal_Sub: any = null;

    private weekPlanModalM10: any = null;
    private weekPlanModalM11: any = null;
    private weekPlanModalM12: any = null;
    private weekPlanModalM1: any = null;
    private weekPlanModalM2: any = null;
    private weekPlanModalM3: any = null;
    private weekPlanModalM4: any = null;
    private weekPlanModalM5: any = null;
    private weekPlanModalM6: any = null;
    private weekPlanModalM7: any = null;
    private weekPlanModalM8: any = null;
    private weekPlanModalM9: any = null;

    weeklyData: any = []; //เก็บข้อมูลวางแผนรายสัปดาห์ (กิจกรรมหลัก)
    weeklyData_Sub: any = []; //เก็บข้อมูลวางแผนรายสัปดาห์ (กิจกรรมย่อย)


    private multiPlanModal: any = null;
    private multiPlanModal_Sub: any = null;

    total$: Observable<number>;
    calculatedTotal: string = '';


    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef) {
        this.total$ = service.total$;
    }

    ngOnInit() {
        const Dep_Id = this.Department_Id; //รหัสหน่วยงาน Get From User

        let model = {
            FUNC_CODE: "FUNC-Get_Data-BF_Plan_Project_Detail_Form",
        }
        var getData = this.serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            // debugger;
            if (response.RESULT == null) {
                // this.old_Budget_Request_Income = JSON.parse(JSON.stringify(response.Budget_Request_Income)); //เอาไปใช้เคลีย Table->BG_Request_Income *ต้องเรียกใช้จาก this อันนี้ เรียกขึ้นมาแต่ยังไม่ได้เคลีย
                //1.1 ยุทธศาสตร์ชาติที่เกี่ยวข้องโดยตรง (Z)
                this.List_Mas_National_Strategy = response.List_Mas_National_Strategy; //ยุทธศาสตร์ชาติ

                this.Old_List_Mas_Strategy_Head_Issue = response.List_Mas_Strategy_Head_Issue; //ประเด็นยุทธศาสตร์
                this.Old_List_Mas_Strategy_Sub_Issue = response.List_Mas_Strategy_Sub_Issue; //ประเด็นยุทธศาสตร์ย่อย

                // 1.2 ยุทธศาสตร์ชาติที่เกี่ยวข้องในระดับรอง (Z)
                this.List_Sec_Mas_National_Strategy = response.List_Mas_National_Strategy; //ยุทธศาสตร์ชาติย่อย

                this.List_Mas_Project_Consistency = response.List_Mas_Project_Consistency; //ความสอดคล้องกับนโยบายรัฐบาล
                this.List_Mas_Project_Consistency_Sub = response.List_Mas_Project_Consistency_Sub; //ความสอดคล้องกับนโยบายรัฐบาลย่อย
                this.Old_List_Mas_Project_Consistency_Sub = response.List_Mas_Project_Consistency_Sub; //ความสอดคล้องกับนโยบายรัฐบาลย่อย

                //2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
                //ประเด็น
                this.List_Mas_MasterPlan_Under_Nationnal_Strategy = response.List_Mas_MasterPlan_Under_Nationnal_Strategy;
                //เป้าหมายระดับประเด็น (Y2)
                this.Old_List_Mas_MasterPlan_Target = response.List_Mas_MasterPlan_Target;
                //แผนย่อยของแผนแม่บทฯ	
                this.Old_List_Mas_Sub_MasterPlan = response.List_Mas_Sub_MasterPlan;
                //เป้าหมายแผนแม่บทย่อย (Y1)
                this.Old_List_Mas_Sub_MasterPlan_Target = response.List_Mas_Sub_MasterPlan_Target;
                //แนวทางการพัฒนาภายใต้แผนย่อย
                this.Old_List_Mas_Sub_MasterPlan_Develop = response.List_Mas_Sub_MasterPlan_Develop;

                if (this.add == "new") {

                } else {
                    //1.1 ยุทธศาสตร์ชาติที่เกี่ยวข้องโดยตรง(Z)
                    this.Choose_Mas_National_Strategy_Detail();
                    this.Choose_Mas_Strategy_Head_Issue_Detail();
                    this.Choose_Mas_Strategy_Sub_Issue_Detail();


                    // เรียกใช้เฉพาะเมื่อ List_Budget_Plan_Project_Strategy_Sub_Item มี length > 0
                    if (this.List_Budget_Plan_Project_Strategy_Sub_Item && this.List_Budget_Plan_Project_Strategy_Sub_Item.length > 0) {
                        this.Choose_Sub_Mas_National_Strategy_Detail(this.List_Budget_Plan_Project_Strategy_Sub_Item);
                        this.Choose_Sub_Mas_Strategy_Head_Issue_Detail(this.List_Budget_Plan_Project_Strategy_Sub_Item);
                        this.Choose_Sub_Mas_Strategy_Sub_Issue_Detail(this.List_Budget_Plan_Project_Strategy_Sub_Item);
                    }
                    //2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
                    // if (this.List_Budget_Request_Income_Consistency_MS_Plan_Item && this.List_Budget_Request_Income_Consistency_MS_Plan_Item.length > 0) {
                    //     this.Choose_Mas_MasterPlan_Under_Nationnal_Strategy_Detail(this.List_Budget_Request_Income_Consistency_MS_Plan_Item);
                    //     this.Choose_Mas_MasterPlan_Target_Detail(this.List_Budget_Request_Income_Consistency_MS_Plan_Item);
                    //     this.Choose_Mas_Sub_MasterPlan_Detail(this.List_Budget_Request_Income_Consistency_MS_Plan_Item);
                    //     this.Choose_Mas_Sub_MasterPlan_Target_Detail(this.List_Budget_Request_Income_Consistency_MS_Plan_Item);
                    //     this.Choose_Mas_Sub_MasterPlan_Develop_Detail(this.List_Budget_Request_Income_Consistency_MS_Plan_Item);
                    // }

                    //ส่วนที่ 3
                    // let date_start = this.Budget_Request_Income_Project_Detial.SS_Start_Date;
                    // let date_end = this.Budget_Request_Income_Project_Detial.SS_End_Date;

                    // // แปลงวันที่ให้อยู่ในรูปแบบที่ต้องการสำหรับ flatpickr
                    // if (date_start && date_end) {
                    //     // แปลง string เป็น Date object สำหรับ flatpickr
                    //     const startDate = this.parseDateFromString(date_start);
                    //     const endDate = this.parseDateFromString(date_end);
                    //     if (startDate && endDate) {
                    //         const dateRange = {
                    //             from: startDate,
                    //             to: endDate
                    //         }
                    //         this.dateRange = dateRange;
                    //     } else {
                    //         this.dateRange = { from: null, to: null };
                    //     }
                    // } else {
                    //     this.dateRange = { from: null, to: null };
                    // }
                    // console.log('dateRange:', this.dateRange);

                }
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


    Cal_Proceed_Qty(proceed_qty: number) { //ดำเนินการเอง
        const Max_Qty = 100;

        // ตรวจสอบว่าค่าที่ใส่เข้ามาไม่เกิน 100
        if (proceed_qty > Max_Qty) {
            Swal.fire({
                icon: 'warning',
                title: 'คำขอโครงการ',
                html: '<span style="color: red;">ดำเนินการเอง ต้องไม่เกิน ' + Max_Qty + '</span>',
                confirmButtonText: 'ตกลง'
            });
            this.Budget_Plan_Project.Proceed_Qty = "";
            return;
        }

        // ถ้า Proceed_Qty มีค่า ให้คำนวณ Po_Qty อัตโนมัติ
        if (proceed_qty && proceed_qty > 0) {
            this.Budget_Plan_Project.Proceed_Qty = proceed_qty;
            this.Budget_Plan_Project.Po_Qty = Max_Qty - proceed_qty;
        }
    }

    Cal_Po_Qty(po_qty: number) { //จัดจ้าง
        const Max_Qty = 100;

        // ตรวจสอบว่าค่าที่ใส่เข้ามาไม่เกิน 100
        if (po_qty > Max_Qty) {
            Swal.fire({
                icon: 'warning',
                title: 'คำขอโครงการ',
                html: '<span style="color: red;">จัดจ้าง ต้องไม่เกิน ' + Max_Qty + '</span>',
                confirmButtonText: 'ตกลง'
            });
            this.Budget_Plan_Project.Po_Qty = "";
            return;
        }

        // ถ้า Po_Qty มีค่า ให้คำนวณ Proceed_Qty อัตโนมัติ
        if (po_qty && po_qty > 0) {
            this.Budget_Plan_Project.Po_Qty = po_qty;
            this.Budget_Plan_Project.Proceed_Qty = Max_Qty - po_qty;
        }
    }

    Choose_Used_BG(currentValue: number, selectedValue: number) {//ประเภทโครงการ
        if (currentValue !== selectedValue) {
            this.Budget_Plan_Project.Used_BG = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                this.Budget_Plan_Project.Used_BG_Name = "ใช้งบประมาณ";
            } else if (selectedValue == 2) {
                this.Budget_Plan_Project.Used_BG_Name = "ไม่ใช้งบประมาณ";
            } else {
                this.Budget_Plan_Project.Used_BG = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }

    Choose_Project_Type_Id(currentValue: number, selectedValue: number) {//ประเภทโครงการ
        if (currentValue !== selectedValue) {
            this.Budget_Plan_Project.Project_Type_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                this.Budget_Plan_Project.Project_Type_Name = "ใหม่";
            } else if (selectedValue == 2) {
                this.Budget_Plan_Project.Project_Type_Name = "ต่อเนื่อง";
            } else {
                this.Budget_Plan_Project.Project_Type_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }


    Choose_Project_Status_Id(currentValue: number, selectedValue: number) { //สถานะโครงการ
        if (currentValue !== selectedValue) {
            this.Budget_Plan_Project.Project_Status_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                this.Budget_Plan_Project.Project_Status_Name = "อยู่ระหว่างดำเนินการ";
            } else if (selectedValue == 2) {
                this.Budget_Plan_Project.Project_Status_Name = "ยังไม่ดำเนินการ";
            } else {
                this.Budget_Plan_Project.Project_Status_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }

    Choose_Mas_Project_Detail() {
        const Project_Id = this.Budget_Plan_Project.Project_Id;
        if (Project_Id != null && Project_Id != undefined && Project_Id != "") {
            let c_item = this.List_Mas_Project.filter((item_old: any) => item_old.Project_Id == Project_Id)
            if (c_item && c_item.length > 0) {
                this.Budget_Plan_Project.Project_Name = c_item[0].Project_Name;
            }
        }
    }

    select_year_count(type: string) {
        if (type == 'New') {
            const start = Number(this.Bgyear);
            let count = Number(this.Budget_Plan_Project.Project_Year_Count);

            // เคสไม่กรอก/กรอกไม่ถูกต้อง
            if (!Number.isFinite(count) || count < 1) {
                this.Budget_Plan_Project.Project_Year_Count = null;
                this.Budget_Plan_Project.Project_Year_Start = null;
                this.Budget_Plan_Project.Project_Year_End = null;
                this.cdr.detectChanges(); // บังคับให้ Angular อัปเดต UI
                return;
            }

            // จำกัดไม่เกิน 5 ปี
            if (count > 5) {
                // เคลียร์ข้อมูลทั้งหมดก่อน
                this.Budget_Plan_Project.Project_Year_Count = null;
                this.Budget_Plan_Project.Project_Year_Start = null;
                this.Budget_Plan_Project.Project_Year_End = null;
                Swal.fire({
                    title: 'กรุณากรอกจำนวนปีที่ดำเนินโครงการไม่เกิน 5 ปี',
                    icon: 'warning',
                    confirmButtonColor: 'rgb(3, 142, 220)',
                    confirmButtonText: 'OK'
                });

                return; // ออกจากฟังก์ชันทันที
            } else {
                // ตั้งค่าเริ่ม/สิ้นสุด
                this.Budget_Plan_Project.Project_Year_Start = start;
                this.Budget_Plan_Project.Project_Year_End = start + count - 1;

                // this.getProjectYears(count);
            }
        }
        // this.fiscalYears();
    }


    // #region 1.1 ยุทธศาสตร์ชาติที่เกี่ยวข้องโดยตรง (Z)
    Choose_Mas_National_Strategy_Detail() {

        const Strategy_Id = this.Budget_Plan_Project_Detail.Strategy_Id;
        //clear ยุทธศาสตร์ชาติ-ประเด็น
        // this.Budget_Plan_Project_Detail.Issues_Id = "";
        // this.Budget_Plan_Project_Detail.Sub_Issues_Id = "";
        if (Strategy_Id != null && Strategy_Id != undefined && Strategy_Id != "") {
            let c_item = this.List_Mas_National_Strategy.filter((item_old: any) => item_old.Strategy_Id == Strategy_Id)
            if (c_item && c_item.length > 0) {
                this.Budget_Plan_Project_Detail.Strategy_Name = c_item[0].Strategy_Name;
            }
        }
        this.List_Mas_Strategy_Head_Issue = this.Old_List_Mas_Strategy_Head_Issue.filter((item: any) => item.Fk_Strategy_Id == Strategy_Id)
    }

    Choose_Mas_Strategy_Head_Issue_Detail() {
        const Issues_Id = this.Budget_Plan_Project_Detail.Issues_Id;
        //clear ประเด็นยุทธศาสตร์-ประเด็นย่อย   
        // this.Budget_Request_Income.Sub_Issues_Id = "";

        if (Issues_Id != null && Issues_Id != undefined && Issues_Id != "") {
            let c_item = this.List_Mas_Strategy_Head_Issue.filter((item: any) => item.Issues_Id == Issues_Id)
            if (c_item && c_item.length > 0) {
                this.Budget_Plan_Project_Detail.Issues_Name = c_item[0].Issues_Name;
            }
        }

        this.List_Mas_Strategy_Sub_Issue = this.Old_List_Mas_Strategy_Sub_Issue.filter((item: any) => item.Fk_Issues_Id == Issues_Id)
    }

    Choose_Mas_Strategy_Sub_Issue_Detail() {
        const Sub_Issues_Id = this.Budget_Plan_Project_Detail.Sub_Issues_Id;
        if (Sub_Issues_Id != null && Sub_Issues_Id != undefined && Sub_Issues_Id != "") {
            let c_item = this.List_Mas_Strategy_Sub_Issue.filter((item: any) => item.Sub_Issues_Id == Sub_Issues_Id)
            if (c_item && c_item.length > 0) {
                this.Budget_Plan_Project_Detail.Sub_Issues_Name = c_item[0].Sub_Issues_Name;
            }
        }
    }

    //เพิ่ม Row ของ 1.1 ยุทธศาสตร์ชาติที่เกี่ยวข้องโดยตรง (Z)
    add_form_Strategy_Sub_Item_detail() {
        this.List_Budget_Plan_Project_Strategy_Sub_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Income_Strategy_Sub_Item)));
    }
    // #endregion

    // #region 1.2 ยุทธศาสตร์ชาติที่เกี่ยวข้องในระดับรอง (Z)
    Choose_Sub_Mas_National_Strategy_Detail(data: any) {
        //clear ยุทธศาสตร์ชาติ-ประเด็น
        // data.Issues_Id = "";
        // data.Sub_Issues_Id = "";

        // เช็คว่า data เป็น array หรือ object
        if (Array.isArray(data)) {
            // ถ้าเป็น array วนลูปทีละ item
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (item.Strategy_Id != null && item.Strategy_Id != undefined && item.Strategy_Id != "") {
                    let c_item = this.List_Sec_Mas_National_Strategy.filter((x: any) => x.Strategy_Id == item.Strategy_Id)
                    if (c_item && c_item.length > 0) {
                        item.Strategy_Name = c_item[0].Strategy_Name;
                    }
                }
                item.List_Sec_Sub_Mas_Strategy_Head_Issue = this.Old_List_Mas_Strategy_Head_Issue.filter(
                    (issue: any) => issue.Fk_Strategy_Id == item.Strategy_Id
                );
            }
        } else {
            // ถ้าเป็น object เดี่ยว (จาก dropdown select)
            if (data.Strategy_Id != null && data.Strategy_Id != undefined && data.Strategy_Id != "") {
                let c_item = this.List_Sec_Mas_National_Strategy.filter((item: any) => item.Strategy_Id == data.Strategy_Id)
                if (c_item && c_item.length > 0) {
                    data.Strategy_Name = c_item[0].Strategy_Name;
                }
            }
            // ดึง List_Mas_ประเด็น ->เปลี่ยนจากตัวแปรกลาง เป็น property ของแต่ละ object
            data.List_Sec_Sub_Mas_Strategy_Head_Issue = this.Old_List_Mas_Strategy_Head_Issue.filter((item_old: any) => item_old.Fk_Strategy_Id == data.Strategy_Id);
        }
    }
    Choose_Sub_Mas_Strategy_Head_Issue_Detail(data: any) {
        // เช็คว่า data เป็น array หรือ object
        if (Array.isArray(data)) {
            // ถ้าเป็น array วนลูปทีละ item
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                if (item.Issues_Id != null && item.Issues_Id != undefined && item.Issues_Id != "") {
                    let c_item = this.List_Sec_Sub_Mas_Strategy_Head_Issue.filter((x: any) => x.Issues_Id == item.Issues_Id)
                    if (c_item && c_item.length > 0) {
                        item.Issues_Name = c_item[0].Issues_Name;
                    }
                }
                item.List_Sec_Strategy_Sub_Issue = this.Old_List_Mas_Strategy_Sub_Issue.filter(
                    (issue: any) => issue.Fk_Issues_Id == item.Issues_Id
                );
            }
        } else {
            // ถ้าเป็น object เดี่ยว (จาก dropdown select)
            const Issues_Id = data.Issues_Id;
            if (Issues_Id != null && Issues_Id != undefined && Issues_Id != "") {
                let c_item = this.List_Sec_Sub_Mas_Strategy_Head_Issue.filter((item: any) => item.Issues_Id == Issues_Id)
                if (c_item && c_item.length > 0) {
                    data.Issues_Name = c_item[0].Issues_Name;
                }
            }
            data.List_Sec_Strategy_Sub_Issue = this.Old_List_Mas_Strategy_Sub_Issue.filter((item_old: any) => item_old.Fk_Issues_Id == data.Issues_Id)
        }
    }

    Choose_Sub_Mas_Strategy_Sub_Issue_Detail(data: any) {
        let list_detail = this.List_Sec_Strategy_Sub_Issue.length; //type-edit
        for (let i = 0; i < list_detail; i++) {
            data.Sub_Issues_Id = this.List_Sec_Strategy_Sub_Issue[i].Sub_Issues_Id
        }
        if (data.Sub_Issues_Id != null && data.Sub_Issues_Id != undefined && data.Sub_Issues_Id != "") {
            let c_item = this.List_Sec_Strategy_Sub_Issue.filter((item_old: any) => item_old.Sub_Issues_Id == data.Sub_Issues_Id)
            if (c_item && c_item.length > 0) {
                data.Sub_Issues_Name = c_item[0].Sub_Issues_Name;
            }
        }
    }

    btn_del_Strategy_Sub_Item_Detail_item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Plan_Project_Strategy_Sub_Item.length) {
            this.List_Budget_Plan_Project_Strategy_Sub_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };
    // #endregion







}