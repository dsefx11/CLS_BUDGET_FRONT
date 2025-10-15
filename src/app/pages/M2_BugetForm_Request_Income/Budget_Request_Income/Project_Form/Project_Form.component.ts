import { SimpleChanges, Component, Input, Output, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, OnInit, ChangeDetectionStrategy, EventEmitter, OnChanges } from '@angular/core';
import flatpickr from 'flatpickr';
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
    selector: 'Project_Form',
    templateUrl: 'Project_Form.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    styleUrls: ['../../M2_BugetForm_Request_Income.scss'],
})

export class Project_Form_Component {

    // @Input() Form_Name: string = ''; // รับค่าจาก Component แม่
    @Input() Budget_Request_Income_Multi_Item: any = {}; // รับค่าจาก Component แม่
    @Input() List_Budget_Request_Income_Multi_Item: any = [];// รับค่าจาก Component แม่
    @Input() Budget_Request_Income_Strategy_Sub_Item: any = {}; // 1.1 ยุทธศาสตร์ชาติที่เกี่ยวข้องโดยตรง (Z)
    @Input() List_Budget_Request_Income_Strategy_Sub_Item: any = [];// รับค่าจาก Component แม่
    @Input() Budget_Request_Income_Consistency_MS_Plan_Item: any = {}; // รับค่าจาก Component แม่ //2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
    @Input() List_Budget_Request_Income_Consistency_MS_Plan_Item: any = [];// รับค่าจาก Component แม่ //2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
    @Input() Budget_Request_Income_Consistent_Plan_Nation_Item: any = {}; // 2.5 ความสอดคล้องกับแผนความมั่นคงชาติ
    @Input() List_Budget_Request_Income_Consistent_Plan_Nation_Item: any = []; // 2.5 ความสอดคล้องกับแผนความมั่นคงชาติ
    @Input() Budget_Request_Income_Consistent_Plan_Item: any = {}; // 3.1 ตามมติ ครม. วันที่ 4 ธันวาคม 2560
    @Input() List_Budget_Request_Income_Consistent_Plan_Item: any = []; // 3.1 ตามมติ ครม. วันที่ 4 ธันวาคม 2560
    @Input() Budget_Request_Income_Law_Relate_Item: any = {}; // 3.4 กฏหมายที่เกี่ยวข้อง
    @Input() List_Budget_Request_Income_Law_Relate_Item: any = []; // 3.4 กฏหมายที่เกี่ยวข้อง
    @Input() Budget_Request_Income_Cabinet_Resolution_Item: any = {}; // 3.5 มติคณะรัฐมนตรีที่เกี่ยวข้อง
    @Input() List_Budget_Request_Income_Cabinet_Resolution_Item: any = []; // รับค่าจาก Component แม่ //3.5 มติคณะรัฐมนตรีที่เกี่ยวข้อง
    @Input() List_Budget_Request_Income_Project_Consistency_Item: any = []; //3.2/3.3/3.6/3.7/3.8
    @Input() Old_List_Budget_Request_Income_Project_Consistency_Item: any = []; //3.2/3.3/3.6/3.7/3.8
    //ส่วนที่ 3
    @Input() List_Budget_Request_Income_Project_Detial_Item: any = []; //ส่วนที่ 3
    @Input() Budget_Request_Income_Project_Detial_Item: any = {}; //ส่วนที่ 3
    //ส่วนที่ 4
    @Input() List_Budget_Request_Income_Multi_Week_Plan_Item: any = []; //ส่วนที่ 4 วางแผนรายสัปดาห์
    @Input() List_Budget_Request_Income_Multi_Week_Plan_Item_Month10: any = []; //ส่วนที่ 4 วางแผนรายสัปดาห์-ตุลาคม
    @Input() List_Budget_Request_Income_Multi_Week_Plan_Item_Month1: any = []; //ส่วนที่ 4 วางแผนรายสัปดาห์-มกราคม
    @Input() Budget_Request_Income_Multi_Week_Plan_Item: any = {}; //ส่วนที่ 4 วางแผนรายสัปดาห์
    @Input() List_Budget_Request_Income_Multi_Plan_Item: any = []; //ส่วนที่ 4 วางแผนรายการตัวคูณ
    @Input() List_Budget_Request_Income_Multi_Sub_Item: any = []; //ส่วนที่ 4 กิจกรรม(ย่อย)
    @Input() List_Budget_Request_Income_Multi_Week_Plan_Item_Multi_Sub: any = []; //ส่วนที่ 4 วางแผนรายสัปดาห์(ย่อย)
    @Input() List_Budget_Request_Income_Multi_Plan_Item_Multi_Sub: any = []; //ส่วนที่ 4 วางแผนรายการตัวคูณ(ย่อย)
    @Input() List_Budget_Request_Income_Multi_Month_Plan_Item: any = []; //ส่วนที่ 4 วางแผนไตรมาส (หลัก)
    @Input() List_Mas_Request_Income_Detail: any = []; // รับค่าจาก Component แม่
    @Input() Budget_Request_Income: any = {}; // รับค่าจาก Component แม่
    @Input() Budget_Request_Income_Detail: any = {}; // รับค่าจาก Component แม่
    @Input() Budget_Request_Income_Project_Detial: any = {}; // รับค่าจาก Component แม่ //Small Success
    @Input() List_Budget_Request_Income_Multi_Item_Sub: any = []; //ส่วนที่ 4 กิจกรรม(ย่อย)

    @Input() calculatedTotal_Front: string = ''; // รับค่าจาก Component แม่
    @Output() calculatedTotalChange = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่
    @Output() multiItemSubChange = new EventEmitter<any[]>(); // ส่งข้อมูล List_Budget_Request_Income_Multi_Item_Sub ไปยัง Component แม่
    @Output() multiMonthPlanItemChange = new EventEmitter<any[]>(); // ส่งข้อมูล List_Budget_Request_Income_Multi_Month_Plan_Item ไปยัง Component แม่
    @Input() Bgyear: number = 0; // ปีงบประมาณที่เลือก
    @Input() Department_Id: number = 0; // รหัสหน่วยงานที่เลือก
    @Input() List_Mas_Project: any = []; // รับค่าจาก Component แม่
    @Input() add: string = ''; // รับค่าจาก Component แม่

    total$: Observable<number>;
    calculatedTotal: string = '';

    fiscalYear: number = 0; // ปีงบประมาณปัจจุบัน
    months: MonthPlan[] = [];

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


    // ฟังก์ชันสำหรับ ngModelChange ของ dateRange
    // onDateRangeChange(dateRange: Date[]) {
    //     this.Budget_Request_Income_Project_Detial.SS_Start_Date = dateRange[0];
    //     this.Budget_Request_Income_Project_Detial.SS_End_Date = dateRange[1];
    // }

    onDateRangeChange(dateRange: any) {
        console.log('dateRange:', dateRange);
        if (dateRange && dateRange.from && dateRange.to) {
            this.Budget_Request_Income_Project_Detial.SS_Start_Date = dateRange.from;
            this.Budget_Request_Income_Project_Detial.SS_End_Date = dateRange.to;
        } else if (dateRange && dateRange.from) {
            this.Budget_Request_Income_Project_Detial.SS_Start_Date = dateRange.from;
        }
        // else {
        //     this.Budget_Request_Income_Project_Detial.SS_Start_Date = null;
        //     this.Budget_Request_Income_Project_Detial.SS_End_Date = null;
        // }
    }

    //ใช้แปลง DatePicker ตัวนี้ แล้วใส่ root->Thai ที่ Module ของตัวเอง
    datePickerOptions: any = {
        locale: 'th',
        mode: 'range',
        altInput: true,
        altFormat: 'd/m/Y',
        dateFormat: 'd/m/Y',
        formatDate: (date: Date) => {
            const d = ('0' + date.getDate()).slice(-2);
            const m = ('0' + (date.getMonth() + 1)).slice(-2);
            const y = date.getFullYear() + 543;
            return `${d}/${m}/${y}`;
        },
        parseDate: (datestr: string) => {
            const [d, m, y] = datestr.split('/');
            return new Date(+y - 543, +m - 1, +d);
        }
    }







    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef) {
        this.total$ = service.total$;
    }

    ngOnInit() {
        const Dep_Id = this.Department_Id; //รหัสหน่วยงาน Get From User

        let model = {
            FUNC_CODE: "FUNC-GET_DATA-Project_Form",
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


                    // เรียกใช้เฉพาะเมื่อ List_Budget_Request_Income_Strategy_Sub_Item มี length > 0
                    if (this.List_Budget_Request_Income_Strategy_Sub_Item && this.List_Budget_Request_Income_Strategy_Sub_Item.length > 0) {
                        this.Choose_Sub_Mas_National_Strategy_Detail(this.List_Budget_Request_Income_Strategy_Sub_Item);
                        this.Choose_Sub_Mas_Strategy_Head_Issue_Detail(this.List_Budget_Request_Income_Strategy_Sub_Item);
                        this.Choose_Sub_Mas_Strategy_Sub_Issue_Detail(this.List_Budget_Request_Income_Strategy_Sub_Item);
                    }
                    //2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
                    if (this.List_Budget_Request_Income_Consistency_MS_Plan_Item && this.List_Budget_Request_Income_Consistency_MS_Plan_Item.length > 0) {
                        this.Choose_Mas_MasterPlan_Under_Nationnal_Strategy_Detail(this.List_Budget_Request_Income_Consistency_MS_Plan_Item);
                        this.Choose_Mas_MasterPlan_Target_Detail(this.List_Budget_Request_Income_Consistency_MS_Plan_Item);
                        this.Choose_Mas_Sub_MasterPlan_Detail(this.List_Budget_Request_Income_Consistency_MS_Plan_Item);
                        this.Choose_Mas_Sub_MasterPlan_Target_Detail(this.List_Budget_Request_Income_Consistency_MS_Plan_Item);
                        this.Choose_Mas_Sub_MasterPlan_Develop_Detail(this.List_Budget_Request_Income_Consistency_MS_Plan_Item);
                    }

                    //ส่วนที่ 3
                    let date_start = this.Budget_Request_Income_Project_Detial.SS_Start_Date;
                    let date_end = this.Budget_Request_Income_Project_Detial.SS_End_Date;

                    // แปลงวันที่ให้อยู่ในรูปแบบที่ต้องการสำหรับ flatpickr
                    if (date_start && date_end) {
                        // แปลง string เป็น Date object สำหรับ flatpickr
                        const startDate = this.parseDateFromString(date_start);
                        const endDate = this.parseDateFromString(date_end);
                        if (startDate && endDate) {
                            const dateRange = {
                                from: startDate,
                                to: endDate
                            }
                            this.dateRange = dateRange;
                        } else {
                            this.dateRange = { from: null, to: null };
                        }
                    } else {
                        this.dateRange = { from: null, to: null };
                    }
                    console.log('dateRange:', this.dateRange);

                    // const startDate = this.MasterService.getDateIfDate_Short(date_start);
                    // const endDate = this.MasterService.getDateIfDate_Short(date_end);
                    // const dateRange = {
                    //     from: startDate,
                    //     to: endDate
                    // };
                    // ส่งเข้า onDateRangeChange

                    //var List_Budget_Request_Income_Project_Detial_Item = $scope.List_Budget_Request_Income_Project_Detial_Item.length; 
                    //for (var i = 0; i < List_Budget_Request_Income_Project_Detial_Item; i++) {
                    //    if ($scope.List_Budget_Request_Income_Project_Detial_Item[i].SS_Start_Date == '' || $scope.List_Budget_Request_Income_Project_Detial_Item[i].SS_Start_Date == null || $scope.List_Budget_Request_Income_Project_Detial_Item[i].SS_Start_Date == undefined) {
                    //        $scope.List_Budget_Request_Income_Project_Detial_Item[i].SS_Start_Date = '';
                    //    }
                    //    else {
                    //        $scope.List_M6_User_Walked_In[i].Walk_In_Date = $scope.getDateIfDate_Short($scope.List_M6_User_Walked_In[i].Walk_In_Date);
                    //    }

                    //    if ($scope.List_M6_User_Walked_In[i].Payment_Balance == undefined || $scope.List_M6_User_Walked_In[i].Payment_Balance == null) {
                    //        $scope.List_M6_User_Walked_In[i].Payment_Balance = $scope.FormatCurrency(0.00);
                    //    } else {
                    //        $scope.List_M6_User_Walked_In[i].Payment_Balance = $scope.FormatCurrency($scope.List_M6_User_Walked_In[i].Payment_Balance); //มี คอมมาท(,)
                    //    }


                    //}
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

        // สร้างรายการเดือน
        this.generateMonths();
    }

    // สร้างรายการเดือนสำหรับปีงบประมาณ
    generateMonths() {
        this.months = [
            { name: 'ต.ค.', number: '10', year: this.Bgyear },
            { name: 'พ.ย.', number: '11', year: this.Bgyear },
            { name: 'ธ.ค.', number: '12', year: this.Bgyear },
            { name: 'ม.ค.', number: '01', year: this.Bgyear + 1 },
            { name: 'ก.พ.', number: '02', year: this.Bgyear + 1 },
            { name: 'มี.ค.', number: '03', year: this.Bgyear + 1 },
            { name: 'เม.ย.', number: '04', year: this.Bgyear + 1 },
            { name: 'พ.ค.', number: '05', year: this.Bgyear + 1 },
            { name: 'มิ.ย.', number: '06', year: this.Bgyear + 1 },
            { name: 'ก.ค.', number: '07', year: this.Bgyear + 1 },
            { name: 'ส.ค.', number: '08', year: this.Bgyear + 1 },
            { name: 'ก.ย.', number: '09', year: this.Bgyear + 1 }
        ];
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




    select_year_count(type: string) {
        if (type == 'New') {
            this.List_Budget_Request_Income_Multi_Item.length = 0; // Clear array without changing reference

            const start = Number(this.Bgyear);
            let count = Number(this.Budget_Request_Income.Project_Year_Count);

            // เคสไม่กรอก/กรอกไม่ถูกต้อง
            if (!Number.isFinite(count) || count < 1) {
                this.Budget_Request_Income.Project_Year_Count = null;
                this.Budget_Request_Income.Project_Year_Start = null;
                this.Budget_Request_Income.Project_Year_End = null;
                this.cdr.detectChanges(); // บังคับให้ Angular อัปเดต UI
                return;
            }

            // จำกัดไม่เกิน 5 ปี
            if (count > 5) {
                // เคลียร์ข้อมูลทั้งหมดก่อน
                this.Budget_Request_Income.Project_Year_Count = null;
                this.Budget_Request_Income.Project_Year_Start = null;
                this.Budget_Request_Income.Project_Year_End = null;
                this.List_Budget_Request_Income_Multi_Item.length = 0; // Clear array without changing reference

                Swal.fire({
                    title: 'กรุณากรอกจำนวนปีที่ดำเนินโครงการไม่เกิน 5 ปี',
                    icon: 'warning',
                    confirmButtonColor: 'rgb(3, 142, 220)',
                    confirmButtonText: 'OK'
                });

                return; // ออกจากฟังก์ชันทันที
            } else {
                // ตั้งค่าเริ่ม/สิ้นสุด
                this.Budget_Request_Income.Project_Year_Start = start;
                this.Budget_Request_Income.Project_Year_End = start + count - 1;

                this.getProjectYears(count);
            }
        }
        // this.fiscalYears();
    }

    // ปี พ.ศ. เริ่ม และจำนวนปีที่ดำเนินโครงการ (กำหนดจากฟอร์มของคุณ)
    startYear = 2568;
    numYears = 2;

    // ป้ายเดือน (ไทย)
    monthLabel: Record<number, string> = {
        1: 'ม.ค.', 2: 'ก.พ.', 3: 'มี.ค.', 4: 'เม.ย.', 5: 'พ.ค.', 6: 'มิ.ย.',
        7: 'ก.ค.', 8: 'ส.ค.', 9: 'ก.ย.', 10: 'ต.ค.', 11: 'พ.ย.', 12: 'ธ.ค.'
    };

    // ลำดับฟิสคอล (ต.ค.→ก.ย.) จัดเป็น 3 แถว × 4 คอลัมน์ (ไตรมาส)
    rowMonths = [
        [10, 1, 4, 7],  // แถวบนสุดของแต่ละไตรมาส
        [11, 2, 5, 8],  // แถวกลาง
        [12, 3, 6, 9],  // แถวล่าง
    ];

    // ลำดับเดือนงบประมาณ
    budgetMonths = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    // เก็บข้อมูลเป็นราย "ปี" แยกจากกัน
    formData: { [year: number]: { [k: string]: any } } = {};

    pre_save_detial_input() {
        console.log('List_Budget_Request_Income_Multi_Item:', this.List_Budget_Request_Income_Multi_Item);
        console.log('List_Budget_Request_Income_Multi_Month_Plan_Item:', this.List_Budget_Request_Income_Multi_Month_Plan_Item);
        console.log('List_Budget_Request_Income_Multi_Plan_Item:', this.List_Budget_Request_Income_Multi_Plan_Item);
        console.log('List_Budget_Request_Income_Multi_Week_Plan_Item:', this.List_Budget_Request_Income_Multi_Week_Plan_Item);

        console.log('กิจกรรม (ย่อย):List_Budget_Request_Income_Multi_Item_Sub:', this.List_Budget_Request_Income_Multi_Item_Sub);
    }

    getProjectYears(count_year: number): number[] {
        const years: number[] = [];
        for (let i = 0; i < count_year; i++) years.push(Number(this.Bgyear) + i);

        // this.add_form_Multi_Month_Plan_Item_detail(this.Budget_Request_Income.Request_Income_Multi_Id, year, this.Budget_Request_Income.List_Name);

        return years;
    }

    //สร้างโครงสำหรับปีที่ยังไม่มีใน formData (เรียกจาก template ได้)
    ensureYear(year: number) {
        if (!this.formData[year]) this.formData[year] = {};

        // this.getList_Multi_Month_Plan_Item_detail(this.Budget_Request_Income.Request_Income_Multi_Id, year, this.Budget_Request_Income.List_Name);
        return true; // ให้ใช้กับ *ngIf ได้
    }

    //ส่วนที่ 4 (รายการไตรมาส)- Filter รายการวางแผนไตรมาส multi_id
    getList_Multi_Month_Plan_Item_detail(type_multi: string, fk_multi_id: number, year_plan: number, list_name: string, Main_index: number) {
        if (type_multi == 'Main') {
            let list_multi_month_plan_item = [];
            //type-edit-มี fk_multi_id
            if (fk_multi_id == null || fk_multi_id == undefined || fk_multi_id == 0) { //new
                list_multi_month_plan_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Type_Multi == 'Main' && item.Bgyear_Plan === year_plan && item.Main_Index === Main_index);
            } else {
                list_multi_month_plan_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Fk_Request_Income_Multi_Id === fk_multi_id && item.Bgyear_Plan === year_plan);
            }

            // list_multi_month_plan_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Fk_Request_Income_Multi_Id === fk_multi_id && item.Bgyear_Plan === year_plan);

            if (list_multi_month_plan_item.length === 0) { //new ถ้าครั้งแรกไม่มีข้อมูล
                const List_Month_Plan_Item_New = {
                    Fk_Request_Income_Multi_Id: fk_multi_id,
                    Fk_Multi_Parent_Id: null,
                    Bgyear_Plan: year_plan,
                    Type_Multi: type_multi,
                    Main_Index: Main_index,
                    List_Name: list_name,
                    Is_Month10: null,
                    Month10_Amount: null,
                    Is_Month11: null,
                    Month11_Amount: null,
                    Is_Month12: null,
                    Month12_Amount: null,
                    Is_Month1: null,
                    Month1_Amount: null,
                    Is_Month2: null,
                    Month2_Amount: null,
                    Is_Month3: null,
                    Month3_Amount: null,
                    Is_Month4: null,
                    Month4_Amount: null,
                    Is_Month5: null,
                    Month5_Amount: null,
                    Is_Month6: null,
                    Month6_Amount: null,
                    Is_Month7: null,
                    Month7_Amount: null,
                    Is_Month8: null,
                    Month8_Amount: null,
                    Is_Month9: null,
                    Month9_Amount: null,
                };
                this.List_Budget_Request_Income_Multi_Month_Plan_Item.push(List_Month_Plan_Item_New);
                return [List_Month_Plan_Item_New];
            } else {
                return list_multi_month_plan_item;
            }
        }
    }

    getList_Multi_Month_Plan_Item_detail_Sub(fk_multi_id: number, year_plan: number, main_index: number, sub_index: number, list_name_parent: string) {
        let list_multi_month_plan_item_sub = [];
        if (fk_multi_id == null || fk_multi_id == undefined || fk_multi_id == 0) { //new
            list_multi_month_plan_item_sub = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Main_Index === main_index && item.Sub_Index === sub_index && item.Type_Multi == 'Sub' && item.Bgyear_Plan === year_plan);
        } else {
            list_multi_month_plan_item_sub = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Fk_Multi_Parent_Id === fk_multi_id && item.Bgyear_Plan === year_plan);
        }
        if (list_multi_month_plan_item_sub.length === 0) { //new ถ้าครั้งแรกไม่มีข้อมูล
            const List_Month_Plan_Item_New_Sub = {
                Fk_Multi_Parent_Id: 0,
                Main_Index: main_index, //index ของกิจกรรม (หลัก)
                Sub_Index: sub_index, //index ของกิจกรรม (ย่อย)
                Type_Multi: 'Sub',
                Bgyear_Plan: year_plan,
                Parent_List_Name: list_name_parent, // ชื่อกิจกรรมหลัก
                List_Name: '', //ชื่อกิจกรรม (ย่อย)
                Is_Month10: null,
                Month10_Amount: null,
                Is_Month11: null,
                Month11_Amount: null,
                Is_Month12: null,
                Month12_Amount: null,
                Is_Month1: null,
                Month1_Amount: null,
                Is_Month2: null,
                Month2_Amount: null,
                Is_Month3: null,
                Month3_Amount: null,
                Is_Month4: null,
                Month4_Amount: null,
                Is_Month5: null,
                Month5_Amount: null,
                Is_Month6: null,
                Month6_Amount: null,
                Is_Month7: null,
                Month7_Amount: null,
                Is_Month8: null,
                Month8_Amount: null,
                Is_Month9: null,
                Month9_Amount: null,
            };
            this.List_Budget_Request_Income_Multi_Month_Plan_Item.push(List_Month_Plan_Item_New_Sub);
            return [List_Month_Plan_Item_New_Sub];
        } else {
            return list_multi_month_plan_item_sub;
        }
    }



    //เพิ่ม Row ของ 1.1 ยุทธศาสตร์ชาติที่เกี่ยวข้องโดยตรง (Z)
    add_form_Strategy_Sub_Item_detail() {
        this.List_Budget_Request_Income_Strategy_Sub_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Income_Strategy_Sub_Item)));
    }
    //เพิ่ม Row ของ 2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
    add_form_Consistency_MS_Plan_Item_detail() {
        this.List_Budget_Request_Income_Consistency_MS_Plan_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Income_Consistency_MS_Plan_Item)));
    }

    //เพิ่ม Row ของ 2.5 ความสอดคล้องกับแผนความมั่นคงชาติ
    add_form_Consistent_Plan_Nation_Item_detail() {
        this.List_Budget_Request_Income_Consistent_Plan_Nation_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Income_Consistent_Plan_Nation_Item)));
    }

    //เพิ่ม Row 3.1 ตามมติ ครม. วันที่ 4 ธันวาคม 2560
    add_form_Consistent_Plan_Item_detail() {
        this.List_Budget_Request_Income_Consistent_Plan_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Income_Consistent_Plan_Item)));
    }

    //เพิ่ม Row 3.4 กฏหมายที่เกี่ยวข้อง
    add_form_Law_Relate_Item_detail() {
        this.List_Budget_Request_Income_Law_Relate_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Income_Law_Relate_Item)));
    }

    //เพิ่ม Row 3.5 มติคณะรัฐมนตรีที่เกี่ยวข้อง
    add_form_Cabinet_Resolution_Item_detail() {
        this.List_Budget_Request_Income_Cabinet_Resolution_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Income_Cabinet_Resolution_Item)));
    }

    //เพิ่ม Small Success //ส่วนที่ 3
    add_form_Project_Detial_Item_detail() {
        this.List_Budget_Request_Income_Project_Detial_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Income_Project_Detial_Item)));
    }

    Bgyear_Name: string = '';
    //เพิ่ม เพิ่มกิจกรรม //ส่วนที่ 4
    add_form_Income_Multi_Item_detail(type_form: string, parent_index?: number) {

        //สร้าง Main_Index ตามจำนวนกิจกรรม (หลัก)
        let Main_Index = 0;
        let List_multi_item = this.List_Budget_Request_Income_Multi_Item.length;

        if (List_multi_item == 0) {
            Main_Index = 0;
        } else if (List_multi_item > 0) {
            Main_Index = List_multi_item;
        }

        let year_select = 0;
        // ตรวจสอบจำนวนปีที่ดำเนินโครงการ
        if (!this.Budget_Request_Income.Project_Year_Count || this.Budget_Request_Income.Project_Year_Count === '') {
            Swal.fire({
                title: 'กรุณากรอกจำนวนปีที่ดำเนินโครงการ',
                icon: 'warning',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
            return;
        } else {
            //กิจกรรมหลัก
            if (type_form == 'Main') { //กิจกรรมหลัก
                // this.List_Budget_Request_Income_Multi_Item = [];
                year_select = this.Budget_Request_Income.Project_Year_Count;
                let newMultiItem = {};
                newMultiItem = {
                    Request_Income_Multi_Plan_Id: 0,
                    Fk_Request_Income_Id: null,
                    Bgyear: this.Bgyear,
                    List_Name: '',
                    Respon_Name: '',
                    Main_Index: Main_Index,
                    Type_Multi: 'Main',
                    Is_Used_BG: null,
                    Plan_Amount_Total: null,
                    Month_Amount_Total: null
                };
                // เพิ่มเข้าไปใน array
                this.List_Budget_Request_Income_Multi_Item.push(newMultiItem);
            }
            // else if (type_form == 'Sub') { //เพิ่มกิจกรรมย่อย
            //     if(parent_index == null || parent_index == undefined || parent_index == 0){
            //         Swal.fire({
            //             title: 'กรุณากรอกชื่อกิจกรรมหลัก',
            //             icon: 'warning',
            //             confirmButtonColor: 'rgb(3, 142, 220)',
            //             confirmButtonText: 'OK'
            //         });
            //         return;
            //     }
            //     let newMultiItem_Sub = {};
            //     newMultiItem_Sub = {
            //         Request_Income_Multi_Plan_Id: 0,
            //         Fk_Request_Income_Id: null,
            //         Parent_Index: parent_index || 0, // เพิ่ม index ของ parent item
            //         Bgyear_Name: this.Bgyear,
            //         List_Name: '',
            //         Respon_Name: '',
            //         Is_Used_BG: null,
            //         Plan_Amount_Total: null,
            //         Month_Amount_Total: null
            //     };
            //     this.List_Budget_Request_Income_Multi_Item_Sub.push(newMultiItem_Sub);
            // }
        }

    }

    //เพิ่ม Row กิจกรรม (ย่อย)
    add_form_Income_Multi_Item_detail_sub(Main_index: number, list_name_parent: string) {

        //สร้าง Sub_Index ตามจำนวนกิจกรรม (ย่อย)
        let Sub_Index = 0;
        let list_detail = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Main_Index === Main_index);
        let Count_Sub_Index = list_detail.length;
        if (Count_Sub_Index == 0) {
            Sub_Index = 0;
        } else if (Count_Sub_Index > 0) {
            Sub_Index = Count_Sub_Index;
        }

        if (list_name_parent == null || list_name_parent == undefined || list_name_parent == '') {
            Swal.fire({
                title: 'กรุณาระบุชื่อกิจกรรมหลัก',
                icon: 'warning',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
            return;
        } else {
            //ปิดการวางแผนตัวคูณ (กิจกรรมหลัก)
            this.List_Budget_Request_Income_Multi_Item[Main_index].Is_Used_BG = 1;
            // update ชื่อกิจกรรมหลัก ของ วางแผนไตรมาส
            // this.List_Budget_Request_Income_Multi_Month_Plan_Item[Main_index].List_Name = list_name_parent;
            let list_multi_month_plan_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Main_Index === Main_index);
            list_multi_month_plan_item.forEach((item: any) => { //update ปีของทุกไตรมาสที่มี
                item.List_Name = list_name_parent;
            });
            //เพิ่มไตรมาสของกิจกรรม (ย่อย)
            let newMultiItem_Sub = {};
            let Fk_Request_Income_Multi_Id;
            try {
                Fk_Request_Income_Multi_Id = this.List_Budget_Request_Income_Multi_Item[Main_index].Request_Income_Multi_Id; //เอาไว้ใช้ ในกรณีเคยมีตัวย่อยแต่ ลบออกหมด แล้วกดเพิ่ม ตัวย่อยใหม่
            } catch (err) {
                Fk_Request_Income_Multi_Id = null;
            }
            let Fk_Multi_Parent_Id;
            try {
                Fk_Multi_Parent_Id = list_multi_month_plan_item[0].Fk_Multi_Parent_Id; //เอาไว้ใช้ ในกรณีเคยมีตัวย่อยตัวย่อย แล้วเพิ่มใหม่อีกแถว
            } catch (err) {
                Fk_Multi_Parent_Id = null;
            }

            let set_Fk_Multi_Parent_Id;
            if (Fk_Request_Income_Multi_Id != null && Fk_Request_Income_Multi_Id != undefined && Fk_Request_Income_Multi_Id != 0) {
                set_Fk_Multi_Parent_Id = Fk_Request_Income_Multi_Id; //เอาไว้ใช้ ในกรณีเคยมีตัวย่อยแต่ ลบออกหมด แล้วกดเพิ่ม ตัวย่อยใหม่
            } else {
                if (Fk_Multi_Parent_Id != null && Fk_Multi_Parent_Id != undefined && Fk_Multi_Parent_Id != 0) {
                    set_Fk_Multi_Parent_Id = Fk_Multi_Parent_Id; //เอาไว้ใช้ ในกรณีเคยมีตัวย่อยตัวย่อย แล้วเพิ่มใหม่อีกแถว
                } else {
                    set_Fk_Multi_Parent_Id = null;
                }
            }

            newMultiItem_Sub = {
                Request_Income_Multi_Plan_Id: 0,
                Fk_Multi_Parent_Id: set_Fk_Multi_Parent_Id,
                Main_Index: Main_index || 0, //รับค่า index ของกิจกรรม (หลัก)
                Sub_Index: Sub_Index, //รับค่า index ของกิจกรรม (ย่อย)
                Type_Multi: 'Sub',
                Bgyear: this.Bgyear,
                Parent_List_Name: list_name_parent, //เซฟ ชื่อกิจกรรมหลัก เอาไว้อ้างอิงกิจกรรมย่อย
                List_Name: '', //ชื่อกิจกรรม (ย่อย)
                Respon_Name: '',
                Is_Used_BG: null,
                Plan_Amount_Total: null,
                Month_Amount_Total: null
            };
            this.List_Budget_Request_Income_Multi_Item_Sub.push(newMultiItem_Sub);
            // ส่งข้อมูลที่อัปเดตไปยัง parent component
            this.multiItemSubChange.emit(this.List_Budget_Request_Income_Multi_Item_Sub);
            // บังคับให้ Angular update UI
            this.cdr.detectChanges();
        }
    }

    // Function สำหรับกรองแสดง Sub items ตาม parent index //เรียก list-multi_item_sub กิจกรรม (ย่อย)
    getMulti_Item_Sub_By_ParentIndex(parentIndex: number, multi_id: number) {
        let list_multi_sub_item = []
        // ตรวจสอบว่า List_Budget_Request_Income_Multi_Item_Sub มีข้อมูลหรือไม่
        if (!this.List_Budget_Request_Income_Multi_Item_Sub || this.List_Budget_Request_Income_Multi_Item_Sub.length === 0) {
            // console.log('List_Budget_Request_Income_Multi_Item_Sub is empty or undefined');
            return [];
        }

        // console.log(`getMulti_Item_Sub_By_ParentIndex called with parentIndex: ${parentIndex}, multi_id: ${multi_id}`);
        // console.log('Current List_Budget_Request_Income_Multi_Item_Sub:', this.List_Budget_Request_Income_Multi_Item_Sub);

        if (multi_id == null || multi_id == undefined || multi_id == 0) {
            list_multi_sub_item = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Main_Index === parentIndex);
            return list_multi_sub_item;
        } else {
            list_multi_sub_item = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Fk_Multi_Parent_Id === multi_id);
            return list_multi_sub_item;
        }
    }

    // Function สำหรับลบ Sub item โดยใช้ parent index และ sub index
    DeleteSubItemByParentAndSubIndex(parentIndex: number, subIndex: number, multi_id: number) {
        let subItems = this.getMulti_Item_Sub_By_ParentIndex(parentIndex, multi_id);

        if (subIndex >= 0 && subIndex < subItems.length) {
            const targetItem = subItems[subIndex];
            const Index_Multi_Sub = this.List_Budget_Request_Income_Multi_Item_Sub.findIndex((item: any) => item === targetItem);
            if (Index_Multi_Sub !== -1) {//ลบรายการกิจกรรมย่อย
                let multi_item = this.List_Budget_Request_Income_Multi_Item[parentIndex];

                //ลบวางแผนรายสัปดาห์ของกิจกรรมย่อย

                this.List_Budget_Request_Income_Multi_Week_Plan_Item =
                    this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter( //มีกี่ Row ลบให้หมดทุก Row
                        (item: any) => !(item.Main_Index === parentIndex && item.Sub_Index === subIndex && item.Type_Multi == 'Sub')
                    );
                //ลบแล้วอัพเดท Week ของกิจกรรมหลัก
                let list_multi_sub_week = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) => item.Main_Index === parentIndex && item.Fk_Multi_Parent_Id != null && item.Type_Multi == 'Sub');

                //update รวมแผนงานของกิจกรรม (หลัก)
                let Sum_Month_Total_Sub = 0;
                list_multi_sub_week.forEach((item: any) => {
                    Sum_Month_Total_Sub += item.Total_Week;
                });
                multi_item.Month_Amount_Total = Sum_Month_Total_Sub; //update


                //ลบวางแผนตัวคูณของกิจกรรมย่อย
                this.List_Budget_Request_Income_Multi_Plan_Item =
                    this.List_Budget_Request_Income_Multi_Plan_Item.filter( //มีกี่ Row ลบให้หมดทุก Row
                        (item: any) => !(item.Main_Index === parentIndex && item.Sub_Index === subIndex && item.Type_Multi == 'Sub')
                    );

                //ลบวางแผนไตรมาสของกิจกรรมย่อย
                this.List_Budget_Request_Income_Multi_Month_Plan_Item =
                    this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter( //มีกี่ Row ลบให้หมดทุก Row
                        (item: any) => !(item.Main_Index === parentIndex && item.Sub_Index === subIndex && item.Type_Multi == 'Sub')
                    );

                this.List_Budget_Request_Income_Multi_Item_Sub.splice(Index_Multi_Sub, 1); //ลบรายการกิจกรรมย่อย
                let chk_list_multi_item_sub = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Main_Index === parentIndex && item.Type_Multi == 'Sub');
                if (chk_list_multi_item_sub.length == 0) {
                    this.List_Budget_Request_Income_Multi_Item[parentIndex].Is_Used_BG = null; //ลบค่า Is_Used_BG ของกิจกรรมหลัก
                }
                //ลบแล้ว Update Index ของ Sub ที่เหลือ - multi_sub
                let list_update_multi_item_sub = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Main_Index === parentIndex && item.Type_Multi == 'Sub');
                list_update_multi_item_sub.forEach((item: any, index: number) => {
                    // Main_Index ใช้ตัวเดิม
                    // Sub_Index ให้ลดลง 1 จากตัวเดิม
                    if (item.Sub_Index > subIndex) {
                        item.Sub_Index = item.Sub_Index - 1;
                    }
                });

                //update รวมตัวคูณของกิจกรรม (หลัก)
                let Sum_Plan_Amount_Total_Sub = 0;
                let list_update_multi_sub_item = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Main_Index === parentIndex && item.Type_Multi == 'Sub');
                list_update_multi_sub_item.forEach((item: any) => {
                    Sum_Plan_Amount_Total_Sub += item.Plan_Amount_Total;
                });
                multi_item.Plan_Amount_Total = Sum_Plan_Amount_Total_Sub; //update 
                //Update Index ของ Sub ที่เหลือ - Week
                let list_update_index_multi_week_plan_sub_item = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) => item.Main_Index === parentIndex && item.Type_Multi == 'Sub');
                list_update_index_multi_week_plan_sub_item.forEach((item: any, index: number) => {
                    // Main_Index ใช้ตัวเดิม
                    // Sub_Index ให้ลดลง 1 จากตัวเดิม
                    if (item.Sub_Index > subIndex) {
                        item.Sub_Index = item.Sub_Index - 1;
                    }
                });
                //Update Index ของ Sub ที่เหลือ - Plan
                let list_update_index_multi_plan_sub_item = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Main_Index === parentIndex && item.Type_Multi == 'Sub');
                list_update_index_multi_plan_sub_item.forEach((item: any, index: number) => {
                    // Main_Index ใช้ตัวเดิม
                    // Sub_Index ให้ลดลง 1 จากตัวเดิม
                    if (item.Sub_Index > subIndex) {
                        item.Sub_Index = item.Sub_Index - 1;
                    }
                });
                //Update Index ของ Sub ที่เหลือ - Month_Plan
                let list_update_index_multi_month_plan_sub_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Main_Index === parentIndex && item.Type_Multi == 'Sub');
                list_update_index_multi_month_plan_sub_item.forEach((item: any, index: number) => {
                    // Main_Index ใช้ตัวเดิม
                    // Sub_Index ให้ลดลง 1 จากตัวเดิม
                    if (item.Sub_Index > subIndex) {
                        item.Sub_Index = item.Sub_Index - 1;
                    }
                });

                //Update Week แต่ละเดือนของกิจกรรมหลัก กับ Month_Plan ของกิจกรรมหลัก
                //update month_plan ของกิจกรรม (หลัก)
                let get_main_list_month_plan_main: any[] = [];
                if (multi_id != null && multi_id != undefined && multi_id != 0) {
                    get_main_list_month_plan_main = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Fk_Request_Income_Multi_Id === multi_id && item.Type_Multi == 'Main');
                } else {
                    // เลือกเฉพาะรายการตัวหลักทั้งหมดของ parent นี้ (ไม่ขึ้นกับ Sub_Index ที่ถูกลบ)
                    get_main_list_month_plan_main = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Main_Index === parentIndex && item.Type_Multi == 'Main');
                }

                let get_list_month_plan_Sub_All = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Main_Index === parentIndex && item.Fk_Multi_Parent_Id != null && item.Type_Multi == 'Sub');

                // รีเซ็ตค่า Main item ก่อน
                get_main_list_month_plan_main.forEach((item_main_month_plan: any) => {
                    item_main_month_plan.Month1_Amount = null;
                    item_main_month_plan.Month2_Amount = null;
                    item_main_month_plan.Month3_Amount = null;
                    item_main_month_plan.Month4_Amount = null;
                    item_main_month_plan.Is_Month1 = null;
                    item_main_month_plan.Is_Month2 = null;
                    item_main_month_plan.Is_Month3 = null;
                    item_main_month_plan.Is_Month4 = null;
                });

                // คำนวณค่าใหม่จาก Sub items ที่เหลือ
                get_main_list_month_plan_main.forEach((item_main_month_plan: any) => {
                    let total_Month1_Amount = 0;
                    let total_Month2_Amount = 0;
                    let total_Month3_Amount = 0;
                    let total_Month4_Amount = 0;
                    let has_Month1 = false;
                    let has_Month2 = false;
                    let has_Month3 = false;
                    let has_Month4 = false;

                    // รวมค่า Sub items ที่มี Bgyear_Plan เดียวกัน
                    get_list_month_plan_Sub_All.forEach((item_sub_month_plan: any) => {
                        if (item_main_month_plan.Bgyear_Plan === item_sub_month_plan.Bgyear_Plan) {
                            // รวม Amount
                            total_Month1_Amount += (item_sub_month_plan.Month1_Amount || 0);
                            total_Month2_Amount += (item_sub_month_plan.Month2_Amount || 0);
                            total_Month3_Amount += (item_sub_month_plan.Month3_Amount || 0);
                            total_Month4_Amount += (item_sub_month_plan.Month4_Amount || 0);

                            // ตรวจสอบ Is_Month
                            if (item_sub_month_plan.Is_Month1 === 1) has_Month1 = true;
                            if (item_sub_month_plan.Is_Month2 === 1) has_Month2 = true;
                            if (item_sub_month_plan.Is_Month3 === 1) has_Month3 = true;
                            if (item_sub_month_plan.Is_Month4 === 1) has_Month4 = true;
                        }
                    });

                    // อัพเดท Main item ด้วยค่าใหม่ที่คำนวณแล้ว
                    item_main_month_plan.Month1_Amount = (total_Month1_Amount && total_Month1_Amount > 0) ? total_Month1_Amount : null;
                    item_main_month_plan.Month2_Amount = (total_Month2_Amount && total_Month2_Amount > 0) ? total_Month2_Amount : null;
                    item_main_month_plan.Month3_Amount = (total_Month3_Amount && total_Month3_Amount > 0) ? total_Month3_Amount : null;
                    item_main_month_plan.Month4_Amount = (total_Month4_Amount && total_Month4_Amount > 0) ? total_Month4_Amount : null;

                    // อัพเดท Is_Month ตามค่าที่คำนวณใหม่
                    item_main_month_plan.Is_Month1 = has_Month1 ? 1 : null;
                    item_main_month_plan.Is_Month2 = has_Month2 ? 1 : null;
                    item_main_month_plan.Is_Month3 = has_Month3 ? 1 : null;
                    item_main_month_plan.Is_Month4 = has_Month4 ? 1 : null;
                });


                //update Week ของกิจกรรม (หลัก)

                let list_week_main: any[] = [];
                if (multi_id != null && multi_id != undefined && multi_id != 0) {
                    list_week_main = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) => item.Main_Index === parentIndex && item.Type_Multi == 'Main' && item.Fk_Request_Income_Multi_Id == multi_id);
                } else {
                    list_week_main = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) => item.Main_Index === parentIndex && item.Type_Multi == 'Main');
                }
                let list_week_sub_all = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) => item.Main_Index === parentIndex && item.Type_Multi == 'Sub');

                // อัปเดตค่าของตัวหลักแบบรายเดือน/รายปีให้ตรงกับตัวย่อยที่เหลืออยู่
                list_week_main.forEach((item_week_main: any) => {
                    // คำนวณรวมเฉพาะตัวย่อยที่อยู่ในเดือนและปีเดียวกัน
                    let total_Week1_Amount = 0;
                    let total_Week2_Amount = 0;
                    let total_Week3_Amount = 0;
                    let total_Week4_Amount = 0;
                    let Sum_TotalWeek_Amount = 0;

                    const sub_weeks_same_month_year = list_week_sub_all.filter((item_sub: any) =>
                        item_sub.Bgyear_Plan === item_week_main.Bgyear_Plan && item_sub.Fk_Month_Id === item_week_main.Fk_Month_Id
                    );

                    sub_weeks_same_month_year.forEach((item_week_sub: any) => {
                        total_Week1_Amount += item_week_sub.Week1_Amount || 0;
                        total_Week2_Amount += item_week_sub.Week2_Amount || 0;
                        total_Week3_Amount += item_week_sub.Week3_Amount || 0;
                        total_Week4_Amount += item_week_sub.Week4_Amount || 0;
                        Sum_TotalWeek_Amount += item_week_sub.Total_Week || 0;
                    });

                    item_week_main.Week1_Amount = (total_Week1_Amount && total_Week1_Amount > 0) ? total_Week1_Amount : null;
                    item_week_main.Week2_Amount = (total_Week2_Amount && total_Week2_Amount > 0) ? total_Week2_Amount : null;
                    item_week_main.Week3_Amount = (total_Week3_Amount && total_Week3_Amount > 0) ? total_Week3_Amount : null;
                    item_week_main.Week4_Amount = (total_Week4_Amount && total_Week4_Amount > 0) ? total_Week4_Amount : null;
                    item_week_main.Total_Week = (Sum_TotalWeek_Amount && Sum_TotalWeek_Amount > 0) ? Sum_TotalWeek_Amount : null;

                    // ตั้งค่า Is_Week เป็น null เมื่อ Week_Amount เป็น 0 หรือ null
                    item_week_main.Is_Week1 = (item_week_main.Week1_Amount && item_week_main.Week1_Amount > 0) ? item_week_main.Is_Week1 : null;
                    item_week_main.Is_Week2 = (item_week_main.Week2_Amount && item_week_main.Week2_Amount > 0) ? item_week_main.Is_Week2 : null;
                    item_week_main.Is_Week3 = (item_week_main.Week3_Amount && item_week_main.Week3_Amount > 0) ? item_week_main.Is_Week3 : null;
                    item_week_main.Is_Week4 = (item_week_main.Week4_Amount && item_week_main.Week4_Amount > 0) ? item_week_main.Is_Week4 : null;
                });

                //ถ้ารายการย่อย ไม่มียอด week แล้วให้เคลียค่าของ month_plan ของกิจกรรม (หลัก)
                let Total_Week = 0;
                let Month_Week = 0;
                let Bgyear_Plan = 0;
                list_week_main.forEach((item: any) => {
                    if ((item.Week1_Amount && item.Week1_Amount > 0) ||
                        (item.Week2_Amount && item.Week2_Amount > 0) ||
                        (item.Week3_Amount && item.Week3_Amount > 0) ||
                        (item.Week4_Amount && item.Week4_Amount > 0) ||
                        (item.Total_Week && item.Total_Week > 0)) {
                        Total_Week = item.Week1_Amount + item.Week2_Amount + item.Week3_Amount + item.Week4_Amount;
                        Month_Week = item.Fk_Month_Id;
                        Bgyear_Plan = item.Bgyear_Plan;
                    } else {
                        Total_Week = 0;
                        Month_Week = item.Fk_Month_Id;
                        Bgyear_Plan = item.Bgyear_Plan;
                    }
                    if (Total_Week == 0 || Total_Week == null || Total_Week == undefined) {
                        // เคลียค่า month_plan ของตัวหลักเมื่อไม่มี week_plan
                        get_main_list_month_plan_main.forEach((item_main_month_plan: any) => {
                            if (Bgyear_Plan == item_main_month_plan.Bgyear_Plan) {
                                if (Month_Week == 1) {
                                    item_main_month_plan.Is_Month1 = null;
                                    item_main_month_plan.Month1_Amount = null;
                                } else if (Month_Week == 2) {
                                    item_main_month_plan.Is_Month2 = null;
                                    item_main_month_plan.Month2_Amount = null;
                                } else if (Month_Week == 3) {
                                    item_main_month_plan.Is_Month3 = null;
                                    item_main_month_plan.Month3_Amount = null;
                                } else if (Month_Week == 4) {
                                    item_main_month_plan.Is_Month4 = null;
                                    item_main_month_plan.Month4_Amount = null;
                                } else if (Month_Week == 5) {
                                    item_main_month_plan.Is_Month5 = null;
                                    item_main_month_plan.Month5_Amount = null;
                                } else if (Month_Week == 6) {
                                    item_main_month_plan.Is_Month6 = null;
                                    item_main_month_plan.Month6_Amount = null;
                                } else if (Month_Week == 7) {
                                    item_main_month_plan.Is_Month7 = null;
                                    item_main_month_plan.Month7_Amount = null;
                                } else if (Month_Week == 8) {
                                    item_main_month_plan.Is_Month8 = null;
                                    item_main_month_plan.Month8_Amount = null;
                                } else if (Month_Week == 9) {
                                    item_main_month_plan.Is_Month9 = null;
                                    item_main_month_plan.Month9_Amount = null;
                                } else if (Month_Week == 10) {
                                    item_main_month_plan.Is_Month10 = null;
                                    item_main_month_plan.Month10_Amount = null;
                                } else if (Month_Week == 11) {
                                    item_main_month_plan.Is_Month11 = null;
                                    item_main_month_plan.Month11_Amount = null;
                                } else if (Month_Week == 12) {
                                    item_main_month_plan.Is_Month12 = null;
                                    item_main_month_plan.Month12_Amount = null;
                                }
                            }
                        });
                    }
                });




                // ดึง week_sub ที่เหลืออยู่
                // ดึง month_plan_sub ที่เหลืออยู่


                // ส่งข้อมูลที่อัปเดตไปยัง parent component
                this.multiItemSubChange.emit(this.List_Budget_Request_Income_Multi_Item_Sub);

                // ส่งข้อมูล Month Plan Items ที่อัปเดตไปยัง parent component
                this.multiMonthPlanItemChange.emit(this.List_Budget_Request_Income_Multi_Month_Plan_Item);

            }
        }
    }


    // Method สำหรับจัดการ checkbox ให้เก็บค่าเป็น integer //แผนงานไตรมาส  //ไม่ได้ใช้งาน เพราะจะ Checked ตอนกรอก input ค่าเงินสัปดาห์
    onCheckboxChange(item: any, field: string) {
        if (item[field] === true || item[field] === 1) {
            item[field] = 1;
        } else {
            item[field] = null;
        }
    }

    onChange_Not_Used_BG(item: any, Index_Main: number) {
        let list_multi_item_sub = this.getMulti_Item_Sub_By_ParentIndex(Index_Main, 0);
        // ตรวจสอบว่ามี sub items และ user พยายามจะ uncheck
        if (list_multi_item_sub.length > 0) {
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'ถ้ามีรายการกิจกรรมย่อยแล้ว จะติ๊กออกไม่ได้',
                icon: 'warning',
            });
            // บังคับให้เป็น checked
            item.Is_Used_BG = true;
            return; // หยุดการทำงานของฟังก์ชัน
        }
    }

    onChange_Not_Used_BG_Sub(item: any, Index_Sub: number) {
        // แปลงค่า boolean เป็น number
        if (item.Is_Used_BG === true) {
            item.Is_Used_BG = 1;
        } else if (item.Is_Used_BG === false) {
            item.Is_Used_BG = 0;
        }
        // บังคับให้ Angular update UI
        this.cdr.detectChanges();
    }

    // Method สำหรับจัดการ checkbox ให้เก็บค่าเป็น integer //วางแผนสัปดาห์ 
    onCheckboxChange_week(item_plan: any, item_week: any, field: string, multi_id: number, Multi_Type: String, Index: number) {
        let Month_Id = item_week[0].Fk_Month_Id;
        // let plan_index = this.List_Budget_Request_Income_Multi_Item.findIndex((item: any) => item.Request_Income_Multi_Id === multi_id);
        let year_plan = item_week[0].Bgyear_Plan;
        let month_plan_index

        if (Multi_Type == 'Main') {
            if (multi_id == null || multi_id == undefined || multi_id == 0) {
                month_plan_index = this.List_Budget_Request_Income_Multi_Month_Plan_Item.findIndex((item: any) => item.Main_Index === Index && item.Bgyear_Plan === year_plan && item.Type_Multi === Multi_Type);
            } else {
                month_plan_index = this.List_Budget_Request_Income_Multi_Month_Plan_Item.findIndex((item: any) => item.Fk_Request_Income_Multi_Id === multi_id && item.Bgyear_Plan === year_plan);
            }
        } else if (Multi_Type == 'Sub') {
            if (multi_id == null || multi_id == undefined || multi_id == 0) {
                month_plan_index = this.List_Budget_Request_Income_Multi_Month_Plan_Item.findIndex((item: any) => item.Sub_Index === Index && item.Bgyear_Plan === year_plan && item.Type_Multi === Multi_Type);
            } else {
                month_plan_index = this.List_Budget_Request_Income_Multi_Month_Plan_Item.findIndex((item: any) => item.Fk_Multi_Parent_Id === multi_id && item.Bgyear_Plan === year_plan);
            }

        }

        if (item_week[field] === true || item_week[field] === 1) {
            item_plan[`Is_Month${Month_Id}`] = 1;
            item_week[field] = 1;
        } else {

            for (let i = 1; i <= 4; i++) { //ไม่ได้ใช้งาน ให้ค่าเงินสัปดาห์เป็น null
                if (item_week[0][`Is_Week${i}`] == false) {
                    item_week[0][`Week${i}_Amount`] = null;
                    item_week[0][`Is_Week${i}`] = null;
                }
            }

            if (item_week[0].Is_Week1 == false && item_week[0].Is_Week2 == false && item_week[0].Is_Week3 == false && item_week[0].Is_Week4 == false) { //ถ้าไม่มีการเลือกสัปดาห์ใดๆ ให้ตั้งค่าเป็น null
                item_plan[`Is_Month${Month_Id}`] = null;
                item_plan[`Month${Month_Id}_Amount`] = null;
                item_week[0].Total_Week = null;
            } else { //ถ้ามีการเลือกสัปดาห์ใดๆ ให้คำนวณรวมค่าเป็น Total_Week

                let sum_week = item_week[0].Week1_Amount + item_week[0].Week2_Amount + item_week[0].Week3_Amount + item_week[0].Week4_Amount;
                if (sum_week == 0) {
                    this.List_Budget_Request_Income_Multi_Month_Plan_Item[month_plan_index][`Month${Month_Id}_Amount`] = null;
                    item_week[0].Total_Week = null;
                } else {
                    this.List_Budget_Request_Income_Multi_Month_Plan_Item[month_plan_index][`Month${Month_Id}_Amount`] = sum_week;
                    item_week[0].Total_Week = sum_week;
                }
            }

        }
    }

    //กรอกค่าเงินสัปดาห์
    add_amount_week(type_multi: string, multi_id: number, item_week: any, index_multi: number, sub_index: number) {

        let Month_Id = item_week[0].Fk_Month_Id;

        //ตรวจสอบว่ามีการเลือกสัปดาห์ใดๆหรือไม่

        let sum_week_plan = 0;
        for (let i = 1; i <= 4; i++) {
            if (item_week[0][`Week${i}_Amount`] > 0) {
                item_week[0][`Is_Week${i}`] = 1;
            } else {
                item_week[0][`Is_Week${i}`] = null;
            }
            //คำนวณรวมค่าเงินสัปดาห์
            if (item_week[0][`Is_Week${i}`] == 1) {
                sum_week_plan += item_week[0][`Week${i}_Amount`];
            }
        }
        if (sum_week_plan == 0) {
            item_week[0].Total_Week = null;
        } else {
            item_week[0].Total_Week = sum_week_plan;
        }

        //หา index ของ กิจกรรม (หลัก) //เคลียร์ค่า เลือกเดือน กับจำนวนเงิน
        let year_plan = item_week[0].Bgyear_Plan;

        if (type_multi == 'Main') {
            let index_month_plan = 0;
            if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
                index_month_plan = this.List_Budget_Request_Income_Multi_Month_Plan_Item.findIndex((item: any) => item.Main_Index === index_multi && item.Bgyear_Plan === year_plan);
            } else {
                index_month_plan = this.List_Budget_Request_Income_Multi_Month_Plan_Item.findIndex((item: any) => item.Fk_Request_Income_Multi_Id === multi_id && item.Bgyear_Plan === year_plan);
            }
            // let index = this.List_Budget_Request_Income_Multi_Item.findIndex((item: any) => item.Request_Income_Multi_Id === multi_id);
            if (item_week[0].Is_Week1 == 1 || item_week[0].Is_Week2 == 1 || item_week[0].Is_Week3 == 1 || item_week[0].Is_Week4 == 1) {
                if (Month_Id == 10 || Month_Id == 11 || Month_Id == 12 || Month_Id == 1 || Month_Id == 2 || Month_Id == 3 || Month_Id == 4 || Month_Id == 5 || Month_Id == 6 || Month_Id == 7 || Month_Id == 8 || Month_Id == 9) {
                    this.List_Budget_Request_Income_Multi_Month_Plan_Item[index_month_plan][`Is_Month${Month_Id}`] = 1;
                    this.List_Budget_Request_Income_Multi_Month_Plan_Item[index_month_plan][`Month${Month_Id}_Amount`] = sum_week_plan;
                }
            }//ไปเคลียค่าตอน save -ถ้าไม่มีการวางแผนสัปดาห์ ให้ update ค่าประจำเดือนเป็น null
        } else if (type_multi == 'Sub') {
            //  index_month_plan = 0;
            let list_month_plan_sub = [];
            if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
                list_month_plan_sub = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Main_Index === index_multi && item.Sub_Index === sub_index && item.Bgyear_Plan === year_plan); //อาจจะต้องใส่ index ของ Main หรือ Sub หรือใส่ทั้งสอง
            } else { //edit เอา IDA ของ กิจกรรมย่อยมาใช้
                list_month_plan_sub = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Fk_Multi_Parent_Id === multi_id && item.Bgyear_Plan === year_plan);
            }
            //update วางแผนไตรมาส->จำนวนเงิน
            if (item_week[0].Is_Week1 == 1 || item_week[0].Is_Week2 == 1 || item_week[0].Is_Week3 == 1 || item_week[0].Is_Week4 == 1) {
                if (Month_Id == 10 || Month_Id == 11 || Month_Id == 12 || Month_Id == 1 || Month_Id == 2 || Month_Id == 3 || Month_Id == 4 || Month_Id == 5 || Month_Id == 6 || Month_Id == 7 || Month_Id == 8 || Month_Id == 9) {
                    list_month_plan_sub[0][`Is_Month${Month_Id}`] = 1
                    list_month_plan_sub[0][`Month${Month_Id}_Amount`] = sum_week_plan;
                    console.log('ผลรวมวางแผนสัปดาห์ Sub', list_month_plan_sub);
                }
            }//ไปเคลียค่าตอน save -ถ้าไม่มีการวางแผนสัปดาห์ ให้ update ค่าประจำเดือนเป็น null

        }



    }




    open_week_plan(fullMdDataModal: any, type_multi: string, monthKey: number, multi_id: number, Is_Used_BG: number, year_plan: number, index_multi_item: number, list_name_main: string, list_name_sub: string, sub_index: number) {

        if (type_multi == 'Main') { //กิจกรรม (หลัก)
            // let let_week_plan = []; //วางแผนรายสัปดาห์
            // if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
            //     let_week_plan = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Main_Index === index_multi_item);
            // } else {
            //     let_week_plan = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Fk_Request_Income_Multi_Id === multi_id);
            // }

            // if (Is_Used_BG == 1) {
            //     Swal.fire({
            //         title: 'เกิดข้อผิดพลาด!',
            //         text: ' ติ๊กเลือกออก "ไม่ใช้งบประมาณ" เพื่อกำหนดตัวคูณก่อนการวางแผนการใช้เงินรายสัปดาห์ ',
            //         icon: 'warning',
            //         confirmButtonColor: 'rgb(3, 142, 220)',
            //         confirmButtonText: 'OK'
            //     });
            // } else {
            //     if (let_week_plan.length == 0) {
            //         Swal.fire({
            //             title: 'เกิดข้อผิดพลาด!',
            //             text: ' กดที่ปุ่ม "เพิ่มรายการตัวคูณ" เพื่อกำหนดตัวคูณก่อนการวางแผนการใช้เงินรายสัปดาห์ ',
            //             icon: 'warning',
            //             confirmButtonColor: 'rgb(3, 142, 220)',
            //             confirmButtonText: 'OK'
            //         });
            //     } else {
            //         this.weeklyData = this.getList_Multi_Week_Plan_Item_detail(type_multi, multi_id, monthKey, year_plan, index_multi_item, list_name, 0);
            //         this.weekPlanModal = this.modalService.open(fullMdDataModal, { size: 'lg', centered: true });
            //     }
            // }
            this.weeklyData = this.getList_Multi_Week_Plan_Item_detail(type_multi, multi_id, monthKey, year_plan, index_multi_item, list_name_main, '', 0);
            // เก็บข้อมูลเดิมไว้สำหรับการคืนค่าเมื่อเกิน
            this.weekPlanModal = this.modalService.open(fullMdDataModal, { size: 'lg', centered: true });
        } else if (type_multi == 'Sub') { //กิจกรรม (ย่อย)
            // let let_week_plan_sub = []; //วางแผนรายสัปดาห์
            // if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
            //     let_week_plan_sub = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Sub_Index === index_multi_item);
            // } else {
            //     let_week_plan_sub = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Fk_Request_Income_Multi_Id === multi_id);
            // }

            // if (Is_Used_BG == 1) {
            //     Swal.fire({
            //         title: 'เกิดข้อผิดพลาด!',
            //         text: ' ติ๊กเลือกออก "ไม่ใช้งบประมาณ" เพื่อกำหนดตัวคูณก่อนการวางแผนการใช้เงินรายสัปดาห์ ',
            //         icon: 'warning',
            //         confirmButtonColor: 'rgb(3, 142, 220)',
            //         confirmButtonText: 'OK'
            //     });
            // } else {
            //     if (let_week_plan_sub.length == 0) {
            //         Swal.fire({
            //             title: 'เกิดข้อผิดพลาด!',
            //             text: ' กดที่ปุ่ม "เพิ่มรายการตัวคูณ" เพื่อกำหนดตัวคูณก่อนการวางแผนการใช้เงินรายสัปดาห์ ',
            //             icon: 'warning',
            //             confirmButtonColor: 'rgb(3, 142, 220)',
            //             confirmButtonText: 'OK'
            //         });
            //     } else {
            //         this.weeklyData_Sub = this.getList_Multi_Week_Plan_Item_detail(type_multi, multi_id, monthKey, year_plan, index_multi_item, list_name, sub_index);
            //         this.weekPlanModal_Sub = this.modalService.open(fullMdDataModal, { size: 'lg', centered: true });
            //     }
            // }

            this.weeklyData_Sub = this.getList_Multi_Week_Plan_Item_detail(type_multi, multi_id, monthKey, year_plan, index_multi_item, list_name_main, list_name_sub, sub_index);
            // เก็บข้อมูลเดิมไว้สำหรับการคืนค่าเมื่อเกิน
            this.weekPlanModal_Sub = this.modalService.open(fullMdDataModal, { size: 'lg', centered: true });

        }


    }
    //ปิด Modal  
    save_week_plan(type_multi: string, monthKey: number, multi_id: number, year_plan: number, list_name_main: string, list_name_sub: string, index_multi_item: number, sub_index: number) {
        // ปิด Modal วางแผนรายสัปดาห์ #fullLgDataModal เฉพาะตัวที่เปิดอยู่
        // รวมยอดรายสัปดาห์ทั้งหมด
        let Sum_Month_Total = 0;
        let Get_Plan_Amount_Total_Net = 0;
        let weekPlanItems_All_Month = []; //วางแผนรายสัปดาห์ - ทุกเดือน
        let multi_item = []; //กิจกรรม
        let multi_month_plan_item = []; //วางแผนตัวคูณ

        if (type_multi == 'Main') { //กิจกรรม (หลัก)
            if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
                weekPlanItems_All_Month = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) =>
                    item.Main_Index === index_multi_item && item.Type_Multi == type_multi);
                multi_item = this.List_Budget_Request_Income_Multi_Item[index_multi_item];
                multi_month_plan_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Bgyear_Plan === year_plan && item.Main_Index == index_multi_item);

                Get_Plan_Amount_Total_Net = multi_item.Plan_Amount_Total; //รวมตัวคูณ - กิจกรรม    
            } else {
                weekPlanItems_All_Month = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) =>
                    item.Fk_Request_Income_Multi_Id === multi_id);
                multi_item = this.List_Budget_Request_Income_Multi_Item.filter((item: any) => item.Request_Income_Multi_Id === multi_id);
                multi_month_plan_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Fk_Request_Income_Multi_Id === multi_id && item.Bgyear_Plan === year_plan);
                Get_Plan_Amount_Total_Net = multi_item[0].Plan_Amount_Total; //รวมตัวคูณ - กิจกรรม    
            }
            weekPlanItems_All_Month.forEach((weekPlanItem: any) => { //คำนวนรวมยอดรายสัปดาห์ - ทุกเดือน
                if (weekPlanItem.Total_Week > 0) {
                    Sum_Month_Total += weekPlanItem.Total_Week;
                }
            });

            let weekPlanItems = []; //วางแผนรายสัปดาห์ - ตัวคูณ
            weekPlanItems = this.getList_Multi_Week_Plan_Item_detail(type_multi, multi_id, monthKey, year_plan, index_multi_item, list_name_main, '', 0);
            if (Sum_Month_Total > Get_Plan_Amount_Total_Net) {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    html: '<span style="font-size:20px;color:orangered">ยอดรายสัปดาห์ทั้งหมดต้องไม่เกินยอดรวมตัวคูณ : ' + Get_Plan_Amount_Total_Net + ' <br> กรุณาตรวจสอบยอดรายสัปดาห์</span>',
                    icon: 'warning',
                    confirmButtonColor: 'rgb(3, 142, 220)',
                    confirmButtonText: 'OK'
                });
                // ลบรายการที่วางแผนรายสัปดาห์
                let get_index_week;
                if (multi_id == null || multi_id == undefined || multi_id == 0) { //New
                    get_index_week = this.List_Budget_Request_Income_Multi_Week_Plan_Item.findIndex((item: any) =>
                        item.Main_Index === index_multi_item &&
                        item.Fk_Month_Id === monthKey &&
                        item.Bgyear_Plan === year_plan &&
                        item.Type_Multi === type_multi
                    );
                } else {
                    get_index_week = this.List_Budget_Request_Income_Multi_Week_Plan_Item.findIndex((item: any) => //Edit
                        item.Fk_Request_Income_Multi_Id === multi_id &&
                        item.Fk_Month_Id === monthKey &&
                        item.Bgyear_Plan === year_plan
                    );
                }


                // update-multi_item -รายการกิจกรรม->รวมแผนงาน (เงิน 4 ไตรมาส) -ลบออก
                multi_month_plan_item.forEach((item: any) => {
                    item[`Is_Month${monthKey}`] = null;
                    item[`Month${monthKey}_Amount`] = null;
                });
                //รับ Input_Week มาถ้าเกิน รวมตัวคูณให้เคลียค่าที่ input ที่เพิ่งป้อน
                // เคลียร์เฉพาะข้อมูลที่ทำให้ยอดเกิน โดยการรีเซ็ตเป็นค่าเดิมที่เก็บไว้ตอนเปิด modal


                this.List_Budget_Request_Income_Multi_Week_Plan_Item.splice(get_index_week, 1);

            } else {

                // Update or add items to List_Budget_Request_Income_Multi_Week_Plan_Item
                // เซฟเฉพาะ item แรก [0] เท่านั้น
                if (weekPlanItems.length > 0) {
                    const weekPlanItem = weekPlanItems[0];

                    //ถ้าวางแผนรายสัปดาห์ไม่มีค่าทุกช่อง หรือ = 0 หรือมีค่าติดลบ
                    if (weekPlanItem.Total_Week == 0 || weekPlanItem.Total_Week == null) {
                        // update-multi_item -รายการกิจกรรม->รวมแผนงาน (เงิน 4 ไตรมาส) -ลบออก
                        // ลบรายการที่วางแผนรายสัปดาห์
                        multi_month_plan_item.forEach((item: any) => {
                            item[`Is_Month${monthKey}`] = null;
                            item[`Month${monthKey}_Amount`] = null;
                        });
                    }

                    // Check if item already exists in the main list
                    let existingIndex = 0; //หา index วางแผนรายสัปดาห์
                    if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
                        existingIndex = this.List_Budget_Request_Income_Multi_Week_Plan_Item.findIndex((item: any) =>
                            item.Main_Index === index_multi_item &&
                            item.Fk_Month_Id === monthKey &&
                            item.Bgyear_Plan === year_plan &&
                            item.Type_Multi === type_multi
                        );
                    } else {//Edit
                        existingIndex = this.List_Budget_Request_Income_Multi_Week_Plan_Item.findIndex((item: any) =>
                            item.Fk_Request_Income_Multi_Id === multi_id &&
                            item.Fk_Month_Id === monthKey &&
                            item.Bgyear_Plan === year_plan
                        );
                    }

                    //เอา index - week_plan_item ไป update หรือ add ตามที่มีอยู่
                    if (existingIndex !== -1) {
                        // Update existing item
                        if (weekPlanItem.Total_Week > 0) {
                            this.List_Budget_Request_Income_Multi_Week_Plan_Item[existingIndex] = { ...weekPlanItem };
                        } else {//ผลรวมรายสัปดาห์ = 0 หรือติดลบ ลบแถวออก
                            this.List_Budget_Request_Income_Multi_Week_Plan_Item.splice(existingIndex, 1);
                        }
                    } else {
                        // Add new item
                        this.List_Budget_Request_Income_Multi_Week_Plan_Item.push({ ...weekPlanItem });
                    }
                }

                // update-multi_item -รายการกิจกรรม->รวมแผนงาน (เงิน 4 ไตรมาส)
                // multi_item.forEach((item: any) => {
                //     item.Month_Amount_Total = Sum_Month_Total;
                // });
                this.List_Budget_Request_Income_Multi_Item[index_multi_item].Month_Amount_Total = Sum_Month_Total;


            }

            //ปิด Modal วางแผนรายสัปดาห์ (หลัก)
            this.weekPlanModal.close();
            this.weekPlanModal = null;
        } else if (type_multi == 'Sub') { //กิจกรรม (ย่อย)
            let multi_item_sub = []; //เอาไป update ผลรวมตัวคูณ ของกิจกรรม (ย่อย)
            //ดึงข้อมูลกิจกรรม (ย่อย)
            if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
                weekPlanItems_All_Month = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) =>
                    item.Main_Index === index_multi_item && item.Sub_Index === sub_index && item.Type_Multi == type_multi);
                multi_item = this.List_Budget_Request_Income_Multi_Item[index_multi_item]; //เอาไป update ผลรวมตัวคูณ ของกิจกรรม (หลัก)
                multi_item_sub = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item_multi_sub: any) => item_multi_sub.Main_Index == index_multi_item && item_multi_sub.Sub_Index == sub_index); //เอาไป update ผลรวมตัวคูณ ของกิจกรรม (ย่อย)
                multi_month_plan_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Bgyear_Plan === year_plan && item.Main_Index == index_multi_item && item.Sub_Index == sub_index);

                Get_Plan_Amount_Total_Net = multi_item_sub[0].Plan_Amount_Total; //รวมตัวคูณ - กิจกรรม  //เอาไปเช็คการกรอก รายสัปดาห์ กับ ผลรวมตัวคูณ 
            } else { //edit
                multi_item_sub = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item_multi_sub: any) => item_multi_sub.Fk_Multi_Parent_Id == multi_id && item_multi_sub.Main_Index == index_multi_item && item_multi_sub.Sub_Index == sub_index); //เอาไป update ผลรวมตัวคูณ ของกิจกรรม (ย่อย)
                let fk_multi_sub_id = multi_item_sub[0].Request_Income_Multi_Id; //Fk ของกิจกรรมย่อย
                if (fk_multi_sub_id != null && fk_multi_sub_id != undefined && fk_multi_sub_id != 0) {
                    weekPlanItems_All_Month = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) =>
                        item.Fk_Multi_Parent_Id === fk_multi_sub_id);
                } else { //เป็น type-edit แต่มีเพิ่มรายการเข้ามาใหม่
                    weekPlanItems_All_Month = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) =>
                        item.Main_Index === index_multi_item && item.Sub_Index === sub_index && item.Type_Multi == type_multi);
                }

                multi_item = this.List_Budget_Request_Income_Multi_Item.filter((item: any) => item.Request_Income_Multi_Id === multi_id); //เอาไป update ผลรวมตัวคูณ ของกิจกรรม (หลัก)

                multi_month_plan_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Fk_Multi_Parent_Id === fk_multi_sub_id && item.Bgyear_Plan === year_plan);
                Get_Plan_Amount_Total_Net = multi_item_sub[0].Plan_Amount_Total; //รวมตัวคูณ - กิจกรรม    
            }
            weekPlanItems_All_Month.forEach((weekPlanItem: any) => { //คำนวนรวมยอดรายสัปดาห์ - ทุกเดือน
                if (weekPlanItem.Total_Week > 0) {
                    Sum_Month_Total += weekPlanItem.Total_Week;
                }
            });

            let weekPlanItems_Sub = []; //วางแผนรายสัปดาห์ - ตัวคูณ
            let fk_multi_sub_id = multi_item_sub[0].Request_Income_Multi_Id; //Fk ของกิจกรรมย่อย
            weekPlanItems_Sub = this.getList_Multi_Week_Plan_Item_detail(type_multi, fk_multi_sub_id, monthKey, year_plan, index_multi_item, list_name_main, list_name_sub, sub_index);
            if (Sum_Month_Total > Get_Plan_Amount_Total_Net) { //ยอดมากกว่ารวมตัวคูณ เคลียค่าวางแผนรายสัปดาห์
                // ลบรายการที่วางแผนรายสัปดาห์
                let get_index_week;
                if (multi_id == null || multi_id == undefined || multi_id == 0) {//new
                    get_index_week = this.List_Budget_Request_Income_Multi_Week_Plan_Item.findIndex((item: any) =>
                        item.Main_Index === index_multi_item &&
                        item.Sub_Index === sub_index &&
                        item.Fk_Month_Id === monthKey &&
                        item.Bgyear_Plan === year_plan &&
                        item.Type_Multi === type_multi
                    );
                } else {//edit
                    let fk_multi_sub_id = multi_item_sub[0].Request_Income_Multi_Id; //Fk ของกิจกรรมย่อย
                    get_index_week = this.List_Budget_Request_Income_Multi_Week_Plan_Item.findIndex((item: any) =>
                        item.Fk_Multi_Parent_Id === fk_multi_sub_id && //Fk ของกิจกรรมย่อย
                        item.Fk_Month_Id === monthKey &&
                        item.Bgyear_Plan === year_plan
                    );
                }


                // update-multi_item -รายการกิจกรรม->รวมแผนงาน (เงิน 4 ไตรมาส) -ลบออก
                multi_month_plan_item.forEach((item: any) => {
                    item[`Is_Month${monthKey}`] = null;
                    item[`Month${monthKey}_Amount`] = null;
                });

                //รับ Input_Week มาถ้าเกิน รวมตัวคูณให้เคลียค่าที่ input ที่เพิ่งป้อน
                // เคลียร์เฉพาะข้อมูลที่ทำให้ยอดเกิน โดยการรีเซ็ตเป็นค่าเดิมที่เก็บไว้ตอนเปิด modal


                this.List_Budget_Request_Income_Multi_Week_Plan_Item.splice(get_index_week, 1);

                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    html: '<span style="font-size:20px;color:orangered">ยอดรายสัปดาห์ทั้งหมดต้องไม่เกินยอดรวมตัวคูณ : ' + Get_Plan_Amount_Total_Net + ' <br> กรุณาตรวจสอบยอดรายสัปดาห์</span>',
                    icon: 'warning',
                    confirmButtonColor: 'rgb(3, 142, 220)',
                    confirmButtonText: 'OK'
                });

            } else {

                // Update or add items to List_Budget_Request_Income_Multi_Week_Plan_Item
                // เซฟเฉพาะ item แรก [0] เท่านั้น
                if (weekPlanItems_Sub.length > 0) {
                    const weekPlanItem = weekPlanItems_Sub[0];

                    //ถ้าวางแผนรายสัปดาห์ไม่มีค่าทุกช่อง หรือ = 0 หรือมีค่าติดลบ
                    if (weekPlanItem.Total_Week == 0 || weekPlanItem.Total_Week == null) {
                        // update-multi_item -รายการกิจกรรม->รวมแผนงาน (เงิน 4 ไตรมาส) -ลบออก
                        // ลบรายการที่วางแผนรายสัปดาห์
                        multi_month_plan_item.forEach((item: any) => {
                            item[`Is_Month${monthKey}`] = null;
                            item[`Month${monthKey}_Amount`] = null;
                        });
                    }

                    // Check if item already exists in the main list
                    let existingIndex = 0; //หา index วางแผนรายสัปดาห์
                    if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
                        existingIndex = this.List_Budget_Request_Income_Multi_Week_Plan_Item.findIndex((item: any) =>
                            item.Main_Index === index_multi_item &&
                            item.Sub_Index === sub_index &&
                            item.Fk_Month_Id === monthKey &&
                            item.Bgyear_Plan === year_plan &&
                            item.Type_Multi === type_multi
                        );
                    } else {
                        let fk_multi_sub_id = multi_item_sub[0].Request_Income_Multi_Id; //Fk ของกิจกรรมย่อย
                        existingIndex = this.List_Budget_Request_Income_Multi_Week_Plan_Item.findIndex((item: any) =>
                            item.Fk_Multi_Parent_Id === fk_multi_sub_id &&
                            item.Fk_Month_Id === monthKey &&
                            item.Bgyear_Plan === year_plan
                        );
                    }

                    //เอา index - week_plan_item ไป update หรือ add ตามที่มีอยู่
                    if (existingIndex !== -1) {
                        // Update existing item
                        if (weekPlanItem.Total_Week > 0) {
                            this.List_Budget_Request_Income_Multi_Week_Plan_Item[existingIndex] = { ...weekPlanItem };
                        } else {//ผลรวมรายสัปดาห์ = 0 หรือติดลบ ลบแถวออก
                            this.List_Budget_Request_Income_Multi_Week_Plan_Item.splice(existingIndex, 1);
                        }
                    } else {
                        // Add new item
                        this.List_Budget_Request_Income_Multi_Week_Plan_Item.push({ ...weekPlanItem });
                    }
                }


                // multi_item.forEach((item: any) => {
                //     item.Month_Amount_Total = Sum_Month_Total;
                // });
                //update รวมแผนงาน (เงิน 4 ไตรมาส) ของกิจกรรม (ย่อย)
                multi_item_sub[0].Month_Amount_Total = Sum_Month_Total;
                // update-multi_item -รายการกิจกรรม->รวมแผนงาน (เงิน 4 ไตรมาส)
                let multi_item_sub_All = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item_multi_sub: any) => item_multi_sub.Main_Index == index_multi_item);
                let Sum_Month_Total_Sub = 0;
                //คำนวนรวมรวมแผนงานของกิจกรรม (ย่อย) ถ้ามีมากว่า 1 row เอาไปคำนวณให้กิจกรรม (หลัก)
                multi_item_sub_All.forEach((item_multi_sub: any) => {
                    if (item_multi_sub.Month_Amount_Total > 0) {
                        Sum_Month_Total_Sub += item_multi_sub.Month_Amount_Total;
                    }
                });
                //update รวมแผนงานของกิจกรรม (หลัก)
                if (multi_id != null && multi_id != undefined && multi_id != 0) {
                    multi_item[0].Month_Amount_Total = Sum_Month_Total_Sub; //update array จาก base
                } else {
                    multi_item.Month_Amount_Total = Sum_Month_Total_Sub; //update array item จาก frontend
                }

                //update วางแผนไตรมาส ของกิจกรรม (หลัก)
                let multi_month_plan_item_All = [];
                if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
                    multi_month_plan_item_All = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Bgyear_Plan === year_plan && item.Main_Index == index_multi_item && item.Type_Multi == 'Sub'); //เอาตัว Sub มาใช้
                } else {//edit
                    multi_month_plan_item_All = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Bgyear_Plan === year_plan && item.Main_Index == index_multi_item && item.Type_Multi == 'Sub'); //เอาตัว Sub มาใช้
                }

                let Sum_Month_Total_ALL = 0;
                multi_month_plan_item_All.forEach((item: any) => {
                    if (item[`Is_Month${monthKey}`] == 1) {
                        Sum_Month_Total_ALL += item[`Month${monthKey}_Amount`];
                    }
                });
                let month_plan_item_Main = [];
                if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
                    month_plan_item_Main = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Bgyear_Plan === year_plan && item.Main_Index == index_multi_item && item.Type_Multi == 'Main');
                } else {
                    month_plan_item_Main = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Bgyear_Plan === year_plan && item.Fk_Request_Income_Multi_Id == multi_id && item.Type_Multi == 'Main');
                }

                month_plan_item_Main[0][`Is_Month${monthKey}`] = 1;
                month_plan_item_Main[0][`Month${monthKey}_Amount`] = Sum_Month_Total_ALL;

                //update วางแผนรายสัปดาห์ ของกิจกรรม (หลัก)
                let plan_week_item_Main = [];
                if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
                    plan_week_item_Main = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) => item.Main_Index == index_multi_item && item.Bgyear_Plan == year_plan && item.Fk_Month_Id == monthKey && item.Type_Multi == 'Main');
                } else { //edit
                    plan_week_item_Main = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) => item.Bgyear_Plan == year_plan && item.Fk_Request_Income_Multi_Id == multi_id && item.Fk_Month_Id == monthKey && item.Type_Multi == 'Main');

                }
                let plan_week_item_Sub_All = [];
                // let fk_multi_sub_id = multi_item_sub[0].Request_Income_Multi_Id; //Fk ของกิจกรรมย่อย
                if (multi_id == null || multi_id == undefined || multi_id == 0) { //new
                    plan_week_item_Sub_All = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) => item.Main_Index == index_multi_item && item.Bgyear_Plan == year_plan && item.Fk_Month_Id == monthKey && item.Type_Multi == 'Sub');
                } else { //edit
                    plan_week_item_Sub_All = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) => item.Bgyear_Plan == year_plan && item.Fk_Month_Id == monthKey && item.Main_Index == index_multi_item && item.Type_Multi == 'Sub');
                }


                //ถ้า หลัก ยังไม่มี List_Week ให้สร้าง List_Week ขึ้นมา
                //เอาค่าที่มีของ กิจกรรม (ย่อย) มาใส่ใน List_Week น่าจะเอาไปวนตอนครี List_Plan_Week_Sub ได้นะ
                //Set ค่าเซฟ
                let W1_Amount = null;
                let W2_Amount = null;
                let W3_Amount = null;
                let W4_Amount = null;
                let Total_Week = null;
                for (let i = 0; i < plan_week_item_Sub_All.length; i++) {
                    W1_Amount += plan_week_item_Sub_All[i].Week1_Amount;
                    W2_Amount += plan_week_item_Sub_All[i].Week2_Amount;
                    W3_Amount += plan_week_item_Sub_All[i].Week3_Amount;
                    W4_Amount += plan_week_item_Sub_All[i].Week4_Amount;
                    Total_Week += plan_week_item_Sub_All[i].Total_Week;

                }
                let Set_Is_Week1 = null;
                let Set_Is_Week2 = null;
                let Set_Is_Week3 = null;
                let Set_Is_Week4 = null;
                if (W1_Amount != null && W1_Amount > 0) {
                    Set_Is_Week1 = 1;
                } else {
                    W1_Amount = null;
                }
                if (W2_Amount != null && W2_Amount > 0) {
                    Set_Is_Week2 = 1;
                } else {
                    W2_Amount = null;
                }
                if (W3_Amount != null && W3_Amount > 0) {
                    Set_Is_Week3 = 1;
                } else {
                    W3_Amount = null;
                }
                if (W4_Amount != null && W4_Amount > 0) {
                    Set_Is_Week4 = 1;
                } else {
                    W4_Amount = null;
                }
                //เอายอดของ กิจกรรม (ย่อย) ไป Sum ที่กิจกรรม (หลัก)
                if (plan_week_item_Main.length == 0) { //ถ้าไม่มี List_Week ให้สร้าง List_Week ขึ้นมา
                    const item_new_form_week_sub = {
                        Main_Index: index_multi_item,
                        Fk_Request_Income_Multi_Id: multi_id,
                        Type_Multi: 'Main',
                        List_Name: list_name_main,
                        Bgyear_Plan: year_plan,
                        Fk_Month_Id: monthKey,
                        Is_Week1: Set_Is_Week1, //ถ้ามีค่า = 1 ถ้าไม่มี = null
                        Is_Week2: Set_Is_Week2, //ถ้ามีค่า = 1 ถ้าไม่มี = null
                        Is_Week3: Set_Is_Week3, //ถ้ามีค่า = 1 ถ้าไม่มี = null
                        Is_Week4: Set_Is_Week4, //ถ้ามีค่า = 1 ถ้าไม่มี = null
                        Week1_Amount: W1_Amount,  //ถ้ามีค่า = Input ถ้าไม่มี = null
                        Week2_Amount: W2_Amount, //ถ้ามีค่า = Input ถ้าไม่มี = null
                        Week3_Amount: W3_Amount, //ถ้ามีค่า = Input ถ้าไม่มี = null
                        Week4_Amount: W4_Amount, //ถ้ามีค่า = Input ถ้าไม่มี = null
                        Total_Week: Total_Week, //ถ้ามีค่า = Input ถ้าไม่มี = null
                    };
                    this.List_Budget_Request_Income_Multi_Week_Plan_Item.push(item_new_form_week_sub);
                } else {
                    //ถ้ามี List_Week ให้ update ค่า
                    for (let i = 0; i < plan_week_item_Main.length; i++) {
                        plan_week_item_Main[i].Is_Week1 = Set_Is_Week1;
                        plan_week_item_Main[i].Is_Week2 = Set_Is_Week2;
                        plan_week_item_Main[i].Is_Week3 = Set_Is_Week3;
                        plan_week_item_Main[i].Is_Week4 = Set_Is_Week4;
                        plan_week_item_Main[i].Week1_Amount = W1_Amount;
                        plan_week_item_Main[i].Week2_Amount = W2_Amount;
                        plan_week_item_Main[i].Week3_Amount = W3_Amount;
                        plan_week_item_Main[i].Week4_Amount = W4_Amount;
                        plan_week_item_Main[i].Total_Week = Total_Week;
                    }
                }

                //ปิด Modal วางแผนรายสัปดาห์ (ย่อย)
                this.weekPlanModal_Sub.close();
                this.weekPlanModal_Sub = null;
            }
        }
    }



    cal_total_multi_plan(item_part4_main3: any) {
        let total = 1; // เริ่มต้นด้วย 1 เพื่อการคูณ
        let p_amount1 = item_part4_main3.Plan1_Amount;
        let p_amount2 = item_part4_main3.Plan2_Amount;
        let p_amount3 = item_part4_main3.Plan3_Amount;
        let p_amount4 = item_part4_main3.Plan4_Amount;
        let p_amount5 = item_part4_main3.Plan5_Amount;
        let p_amount6 = item_part4_main3.Plan6_Amount;

        // คูณเฉพาะค่าที่มากกว่า 0 (ข้ามค่า 0 และค่าติดลบ)
        if (p_amount1 && p_amount1 > 0) total *= p_amount1;
        if (p_amount2 && p_amount2 > 0) total *= p_amount2;
        if (p_amount3 && p_amount3 > 0) total *= p_amount3;
        if (p_amount4 && p_amount4 > 0) total *= p_amount4;
        if (p_amount5 && p_amount5 > 0) total *= p_amount5;
        if (p_amount6 && p_amount6 > 0) total *= p_amount6;

        item_part4_main3.Plan_Amount_Total = total
    }

    save_multi_detail(type_multi: string, multi_id: number, index_multi_item: number, index_multi_item_sub: number, list_name: string) {
        // ดึงข้อมูลรวมตัวคูณ จากรายการตัวคูณ
        let Sum_Plan_Amount_Total = 0;
        let multi_item_plan = [];
        let multi_item = [];

        if (type_multi == 'Main') {
            if (multi_id == null || multi_id == undefined || multi_id == 0) {  //new
                multi_item_plan = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Main_Index === index_multi_item);//วางแผนรายการตัวคูณ
                multi_item = this.List_Budget_Request_Income_Multi_Item[index_multi_item]; //กิจกรรม
            } else {
                multi_item_plan = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Fk_Request_Income_Multi_Id === multi_id); //วางแผนรายการตัวคูณ
                multi_item = this.List_Budget_Request_Income_Multi_Item.filter((item: any) => item.Request_Income_Multi_Id === multi_id); //กิจกรรม
            }

            multi_item_plan.forEach((item: any) => { //รวมตัวคูณ - วางแผนรายการตัวคูณ
                Sum_Plan_Amount_Total += item.Plan_Amount_Total;
            });

            // update -รวมตัวคูณ -กิจกรรม
            // multi_item[index_multi_item].Plan_Amount_Total = Sum_Plan_Amount_Total;
            this.List_Budget_Request_Income_Multi_Item[index_multi_item].Plan_Amount_Total = Sum_Plan_Amount_Total;
            //update -ชื่อกิจกรรม -วางแผนไตรมาส;
            let list_multi_month_plan_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Main_Index === index_multi_item);
            list_multi_month_plan_item.forEach((item: any) => {
                item.List_Name = list_name;
            });
            this.calTotal_item(); //คำนวณรวมตัวคูณ        

            this.multiPlanModal.close();
            this.multiPlanModal = null;
        } else if (type_multi == 'Sub') {

            if (multi_id == null || multi_id == undefined || multi_id == 0) {  //new
                multi_item_plan = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Main_Index === index_multi_item && item.Sub_Index === index_multi_item_sub);//วางแผนรายการตัวคูณ
                multi_item = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Main_Index === index_multi_item && item.Sub_Index === index_multi_item_sub);
                // multi_item = this.List_Budget_Request_Income_Multi_Item_Sub[index_multi_item_sub]; //กิจกรรม
            } else {
                multi_item_plan = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Fk_Multi_Parent_Id === multi_id); //วางแผนรายการตัวคูณ
                multi_item = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Request_Income_Multi_Id === multi_id); //กิจกรรม
            }

            multi_item_plan.forEach((item: any) => { //รวมตัวคูณ - วางแผนรายการตัวคูณ
                Sum_Plan_Amount_Total += item.Plan_Amount_Total;
            });

            // update -รวมตัวคูณ -กิจกรรม (ย่อย)
            multi_item[0].Plan_Amount_Total = Sum_Plan_Amount_Total;
            // this.List_Budget_Request_Income_Multi_Item_Sub
            // this.List_Budget_Request_Income_Multi_Item_Sub[index_multi_item_sub].Plan_Amount_Total = Sum_Plan_Amount_Total;
            //update รวมตัวคูณ กิจกรรม (หลัก)
            let Sum_Plan_Amount_Total_Sub = 0;
            let list_multi_item_sub_ALL = this.List_Budget_Request_Income_Multi_Item_Sub.filter((item: any) => item.Main_Index === index_multi_item);
            list_multi_item_sub_ALL.forEach((item: any) => {
                Sum_Plan_Amount_Total_Sub += item.Plan_Amount_Total;
            });

            this.List_Budget_Request_Income_Multi_Item[index_multi_item].Plan_Amount_Total = Sum_Plan_Amount_Total_Sub;



            //update -ชื่อกิจกรรม -วางแผนไตรมาส;
            let list_multi_month_plan_item = this.List_Budget_Request_Income_Multi_Month_Plan_Item.filter((item: any) => item.Main_Index === index_multi_item && item.Sub_Index === index_multi_item_sub); //อาจจะต้องใส่ index ของ Main หรือ Sub หรือใส่ทั้งสอง
            list_multi_month_plan_item.forEach((item: any) => {
                item.List_Name = list_name;
            });
            this.calTotal_item(); //คำนวณรวมตัวคูณ   

            this.multiPlanModal_Sub.close();
            this.multiPlanModal_Sub = null;
        }



    }




    //เปิด Modal รายการตัวคูณ
    Open_multi_detail(modal_name: any, type: string, multi_id?: number, list_name?: string) {

        if (list_name == "" || list_name == null || list_name == undefined) {
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'กรุณาระบุชื่อกิจกรรม',
                icon: 'warning',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
        } else {
            this.multiPlanModal = this.modalService.open(modal_name, {
                size: 'xl',
                centered: true,
                // windowClass: 'modal-2200px'
            });
        }
    }

    //เปิด Modal รายการตัวคูณ (กิจกรรมย่อย)
    Open_multi_detail_Sub(modal_name: any, type: string, multi_id?: number, list_name?: string, item_month_plan?: any) {

        if (list_name == "" || list_name == null || list_name == undefined) {
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'กรุณาระบุชื่อกิจกรรม',
                icon: 'warning',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
        } else {
            this.multiPlanModal_Sub = this.modalService.open(modal_name, {
                size: 'xl',
                centered: true,
                // windowClass: 'modal-2200px'
            });
            //update ชื่อกิจกรรมย่อย
            item_month_plan.List_Name = list_name;
        }
    }


    // เพิ่มรายการตัวคูณสำหรับแต่ละ array แยกกัน //รายการตัวคูณ
    add_form_Multi_Plan_Item_detail(Type_Multi: string, multi_id: number, index_multi: number, sub_index: number, list_name: string, Sub_List_Name: string) { //เพิ่มรายการใหม่ แล้วค่อยเอา index_multi_item ไป Get_List มาอีกที

        if (Type_Multi == 'Main') {
            let newMultiPlanItem = {
                Request_Income_Multi_Plan_Id: 0,
                Fk_Request_Income_Multi_Id: multi_id, //type-edit มีข้อมูลหลักอยู่ แล้วเพิ่ม row มาใหม่
                Main_Index: index_multi, // index กิจกรรมหลัก //ใช้แค่ front-end //back-end ไม่เซฟ
                Type_Multi: Type_Multi,
                List_Name: list_name,
                Plan_Name: '',
                Plan_Amount_Total: null,
                Plan1_Amount: null,
                Plan1_Unit_Name: '',
                Plan2_Amount: null,
                Plan2_Unit_Name: '',
                Plan3_Amount: null,
                Plan3_Unit_Name: '',
                Plan4_Amount: null,
                Plan4_Unit_Name: '',
                Plan5_Amount: null,
                Plan5_Unit_Name: '',
                Plan6_Amount: null,
                Plan6_Unit_Name: ''
            };

            this.List_Budget_Request_Income_Multi_Plan_Item.push(newMultiPlanItem);
        } else if (Type_Multi == 'Sub') {
            let newMultiPlanItem_Sub = {
                Request_Income_Multi_Plan_Id: 0,
                Fk_Multi_Parent_Id: multi_id,
                // Index_Multi_Parent: index_multi, //index กิจกรรมย่อย //ใช้แค่ front-end //back-end ไม่เซฟ
                Main_Index: index_multi, //index กิจกรรมหลัก
                Sub_Index: sub_index, //index กิจกรรมย่อย
                Type_Multi: Type_Multi,
                List_Name: Sub_List_Name, //ชื่อกิจกรรมย่อย
                Parent_List_Name: list_name, //ชื่อกิจกรรมหลัก
                Plan_Name: '',
                Plan_Amount_Total: null,
                Plan1_Amount: null,
                Plan1_Unit_Name: '',
                Plan2_Amount: null,
                Plan2_Unit_Name: '',
                Plan3_Amount: null,
                Plan3_Unit_Name: '',
                Plan4_Amount: null,
                Plan4_Unit_Name: '',
                Plan5_Amount: null,
                Plan5_Unit_Name: '',
                Plan6_Amount: null,
                Plan6_Unit_Name: ''
            };

            this.List_Budget_Request_Income_Multi_Plan_Item.push(newMultiPlanItem_Sub);
        }


    }

    add_form_Multi_Month_Plan_Item_detail(multi_id: number, year_plan: number, list_name: string, Main_index: number) {
        const List_Month_Plan_Item_New = {
            Fk_Request_Income_Multi_Id: multi_id,
            Bgyear_Plan: year_plan,
            Main_Index: Main_index,
            List_Name: list_name,
            Is_Month10: null,
            Month10_Amount: null,
            Is_Month11: null,
            Month11_Amount: null,
            Is_Month12: null,
            Month12_Amount: null,
            Is_Month1: null,
            Month1_Amount: null,
            Is_Month2: null,
            Month2_Amount: null,
            Is_Month3: null,
            Month3_Amount: null,
            Is_Month4: null,
            Month4_Amount: null,
            Is_Month5: null,
            Month5_Amount: null,
            Is_Month6: null,
            Month6_Amount: null,
            Is_Month7: null,
            Month7_Amount: null,
            Is_Month8: null,
            Month8_Amount: null,
            Is_Month9: null,
            Month9_Amount: null,
        };
        this.List_Budget_Request_Income_Multi_Month_Plan_Item.push(List_Month_Plan_Item_New);
    }

    //3.2/3.3/3.6/3.7/3.8 ข้อมูล Checkbox ตัวเลือก
    getConsistencySubByType(typeId: number): any[] {
        // filter เฉพาะ sub ที่ตรง typeId
        const subList = this.List_Mas_Project_Consistency_Sub.filter((sub: any) => sub.Fk_Consistency_Id === typeId);
        // map checked flag ให้กับแต่ละ item
        this.Get_List_Mas_Project_Consistency_Item(subList);
        return subList;
    }

    //ส่วนที่ 4 (รายการตัวคูณ)- Filter รายการตัวคูณตาม multi_id
    getList_Multi_Plan_Item_detail(type_multi: string, fk_multi_id: number, Main_Index: number, Sub_Index: number) {
        if (type_multi == 'Main') {
            let list_multi_plan_item = [];
            if (fk_multi_id == null || fk_multi_id == undefined || fk_multi_id == 0) {
                list_multi_plan_item = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Main_Index === Main_Index && item.Type_Multi == type_multi);
            } else {
                // Filter List_Budget_Request_Income_Multi_Plan_Item based on Request_Income_Multi_Id
                list_multi_plan_item = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Fk_Request_Income_Multi_Id === fk_multi_id);
            }
            return list_multi_plan_item
        } else if (type_multi == 'Sub') {
            let list_multi_plan_item_sub = [];
            if (fk_multi_id == null || fk_multi_id == undefined || fk_multi_id == 0) {
                list_multi_plan_item_sub = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Main_Index === Main_Index && item.Sub_Index === Sub_Index && item.Type_Multi == type_multi);
            } else {
                // Filter List_Budget_Request_Income_Multi_Plan_Item based on Request_Income_Multi_Id
                list_multi_plan_item_sub = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Fk_Multi_Parent_Id === fk_multi_id);
            }
            return list_multi_plan_item_sub;
        }

    }

    //ส่วนที่ 4 (วางแผนรายสัปดาห์) - Filter 
    getList_Multi_Week_Plan_Item_detail(type_multi: string, fk_multi_id: number, month_id: number, year_plan: number, index_multi_item: number, list_name_main: string, list_name_sub: string, sub_index: number) {
        if (type_multi == 'Main') {
            let list_multi_week_plan_item = [];
            if (fk_multi_id != null && fk_multi_id != undefined && fk_multi_id != 0) {
                list_multi_week_plan_item = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) =>
                    item.Fk_Request_Income_Multi_Id === fk_multi_id && item.Fk_Month_Id === month_id && item.Bgyear_Plan === year_plan
                );
            } else {
                list_multi_week_plan_item = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) =>
                    item.Main_Index === index_multi_item && item.Fk_Month_Id === month_id && item.Bgyear_Plan === year_plan && item.Type_Multi == 'Main'
                );
            }

            // ถ้าไม่มีข้อมูล ให้สร้างข้อมูลเริ่มต้นสำหรับ multi_id และ month_id นี้
            if (list_multi_week_plan_item.length === 0) {
                const List_Week_Plan_Item_New = {
                    Fk_Request_Income_Multi_Id: fk_multi_id,
                    Main_Index: index_multi_item,
                    Type_Multi: type_multi,
                    List_Name: list_name_main,
                    Fk_Month_Id: month_id,
                    Bgyear_Plan: year_plan,
                    Is_Week1: 0,
                    Is_Week2: 0,
                    Is_Week3: 0,
                    Is_Week4: 0,
                    Week1_Amount: null,
                    Week2_Amount: null,
                    Week3_Amount: null,
                    Week4_Amount: null,
                };

                // เพิ่มข้อมูลเริ่มต้นเข้าไปใน List_Budget_Request_Income_Multi_Week_Plan_Item
                this.List_Budget_Request_Income_Multi_Week_Plan_Item.push(List_Week_Plan_Item_New);
                return [List_Week_Plan_Item_New];
            } else {
                return list_multi_week_plan_item;
            }
        } else if (type_multi == 'Sub') {
            let list_multi_week_plan_item_sub = [];
            if (fk_multi_id != null && fk_multi_id != undefined && fk_multi_id != 0) {
                list_multi_week_plan_item_sub = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) =>
                    item.Fk_Multi_Parent_Id === fk_multi_id && item.Fk_Month_Id === month_id && item.Bgyear_Plan === year_plan
                );
            } else {
                list_multi_week_plan_item_sub = this.List_Budget_Request_Income_Multi_Week_Plan_Item.filter((item: any) =>
                    item.Main_Index === index_multi_item && item.Sub_Index === sub_index && item.Fk_Month_Id === month_id && item.Bgyear_Plan === year_plan && item.Type_Multi == 'Sub'
                );
            }
            // ถ้าไม่มีข้อมูล ให้สร้างข้อมูลเริ่มต้นสำหรับ multi_id และ month_id นี้ 
            if (list_multi_week_plan_item_sub.length === 0) {
                const List_Week_Plan_Item_New = {
                    Fk_Multi_Parent_Id: fk_multi_id,
                    Main_Index: index_multi_item,
                    Sub_Index: sub_index,
                    Type_Multi: type_multi,
                    List_Name: list_name_sub, //ชื่อกิจกรรม (ย่อย)
                    Parent_List_Name: list_name_main, //ชื่อกิจกรรม (หลัก)
                    Fk_Month_Id: month_id,
                    Bgyear_Plan: year_plan,
                    Is_Week1: 0,
                    Is_Week2: 0,
                    Is_Week3: 0,
                    Is_Week4: 0,
                    Week1_Amount: null,
                    Week2_Amount: null,
                    Week3_Amount: null,
                    Week4_Amount: null,
                };

                // เพิ่มข้อมูลเริ่มต้นเข้าไปใน List_Budget_Request_Income_Multi_Week_Plan_Item
                this.List_Budget_Request_Income_Multi_Week_Plan_Item.push(List_Week_Plan_Item_New);
                return [List_Week_Plan_Item_New];
            } else {
                return list_multi_week_plan_item_sub;
            }
        }

    }
    //ส่วนที่ 4 (กิจกรรม)
    getList_Multi_Item_detail(fk_multi_id: number) {
        // Filter List_Budget_Request_Income_Multi_Sub_Item based on Fk_Request_Income_Multi_Id and Fk_Month_Id
        let list_multi_item = this.List_Budget_Request_Income_Multi_Item.filter((item: any) =>
            item.Request_Income_Multi_Id === fk_multi_id
        );
        return list_multi_item;
    }


    data_multi_item_detail(multi_id: number) {
        let list_multi_item = this.List_Budget_Request_Income_Multi_Item.filter((item: any) =>
            item.Request_Income_Multi_Id === multi_id
        );
        return list_multi_item;
    }


    btn_del_Strategy_Sub_Item_Detail_item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Income_Strategy_Sub_Item.length) {
            this.List_Budget_Request_Income_Strategy_Sub_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };

    btn_del_Consistency_MS_Plan_Item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Income_Consistency_MS_Plan_Item.length) {
            this.List_Budget_Request_Income_Consistency_MS_Plan_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };

    btn_del_Project_Detial_Item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Income_Project_Detial_Item.length) {
            this.List_Budget_Request_Income_Project_Detial_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };

    // ลบรายการตัวคูณสำหรับแต่ละ array แยกกัน
    btn_del_Week_Item = (index: number, multi_id: number): void => {
        // หา index ที่แท้จริงใน List_Budget_Request_Income_Multi_Plan_Item
        let filteredItems = this.List_Budget_Request_Income_Multi_Plan_Item.filter((item: any) => item.Fk_Request_Income_Multi_Id === multi_id);
        if (index >= 0 && index < filteredItems.length) {
            // หา item ที่จะลบ
            let itemToDelete = filteredItems[index];
            // หา index จริงใน array หลัก
            let realIndex = this.List_Budget_Request_Income_Multi_Plan_Item.findIndex((item: any) =>
                item.Request_Income_Multi_Plan_Id === itemToDelete.Request_Income_Multi_Plan_Id &&
                item.Fk_Request_Income_Multi_Id === multi_id
            );
            if (realIndex >= 0) {
                this.List_Budget_Request_Income_Multi_Plan_Item.splice(realIndex, 1);
            }
        } else {
            console.error("Invalid index:", index);
        }
    };

    btn_del_Multi_Plan_Item(index: number) {
        if (index >= 0 && index < this.List_Budget_Request_Income_Multi_Plan_Item.length) {
            this.List_Budget_Request_Income_Multi_Plan_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };

    //ลบ list ของ 2.5 ความสอดคล้องกับแผนความมั่นคงชาติ
    btn_del_Consistent_Plan_Nation_Item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Income_Consistent_Plan_Nation_Item.length) {
            this.List_Budget_Request_Income_Consistent_Plan_Nation_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };

    //ลบ list ของ 3.1 ตามมติ ครม. วันที่ 4 ธันวาคม 2560
    btn_del_Consistent_Plan_Item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Income_Consistent_Plan_Item.length) {
            this.List_Budget_Request_Income_Consistent_Plan_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };

    //ลบ list ของ 3.4 กฏหมายที่เกี่ยวข้อง
    btn_del_Law_Relate_Item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Income_Law_Relate_Item.length) {
            this.List_Budget_Request_Income_Law_Relate_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };
    //ลบ list ของ 3.5 มติคณะรัฐมนตรีที่เกี่ยวข้อง
    btn_del_Cabinet_Resolution_Item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Income_Cabinet_Resolution_Item.length) {
            this.List_Budget_Request_Income_Cabinet_Resolution_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };

    //ลบ list ของ 4.1 กิจกรรม
    btn_del_Income_Multi_Item = (index: number, type_form: string): void => {
        if (type_form === 'Main') {
            // ลบ Main item
            if (index >= 0 && index < this.List_Budget_Request_Income_Multi_Item.length) {
                // ลบทุกแถวที่มี Main_Index เท่ากับ index ใน Month Plan
                for (let i = this.List_Budget_Request_Income_Multi_Month_Plan_Item.length - 1; i >= 0; i--) {
                    if (this.List_Budget_Request_Income_Multi_Month_Plan_Item[i].Main_Index === index) {
                        this.List_Budget_Request_Income_Multi_Month_Plan_Item.splice(i, 1);
                    }
                }

                // ลบทุกแถวที่มี Main_Index เท่ากับ index ใน Week Plan
                for (let i = this.List_Budget_Request_Income_Multi_Week_Plan_Item.length - 1; i >= 0; i--) {
                    if (this.List_Budget_Request_Income_Multi_Week_Plan_Item[i].Main_Index === index) {
                        this.List_Budget_Request_Income_Multi_Week_Plan_Item.splice(i, 1);
                    }
                }

                // ลบทุกแถวที่มี Main_Index เท่ากับ index ใน Plan Item
                for (let i = this.List_Budget_Request_Income_Multi_Plan_Item.length - 1; i >= 0; i--) {
                    if (this.List_Budget_Request_Income_Multi_Plan_Item[i].Main_Index === index) {
                        this.List_Budget_Request_Income_Multi_Plan_Item.splice(i, 1);
                    }
                }

                this.List_Budget_Request_Income_Multi_Item.splice(index, 1); //ลบกิจกรรม

                // อัพเดท Main_Index ของแถวที่เหลือใน Month Plan
                for (let i = 0; i < this.List_Budget_Request_Income_Multi_Month_Plan_Item.length; i++) {
                    if (this.List_Budget_Request_Income_Multi_Month_Plan_Item[i].Main_Index > index) {
                        this.List_Budget_Request_Income_Multi_Month_Plan_Item[i].Main_Index--;
                    }
                }

                // อัพเดท Main_Index ของแถวที่เหลือใน Week Plan
                for (let i = 0; i < this.List_Budget_Request_Income_Multi_Week_Plan_Item.length; i++) {
                    if (this.List_Budget_Request_Income_Multi_Week_Plan_Item[i].Main_Index > index) {
                        this.List_Budget_Request_Income_Multi_Week_Plan_Item[i].Main_Index--;
                    }
                }

                // อัพเดท Main_Index ของแถวที่เหลือใน Plan Item
                for (let i = 0; i < this.List_Budget_Request_Income_Multi_Plan_Item.length; i++) {
                    if (this.List_Budget_Request_Income_Multi_Plan_Item[i].Main_Index > index) {
                        this.List_Budget_Request_Income_Multi_Plan_Item[i].Main_Index--;
                    }
                }



                console.log('Deleted Main item at index:', index);
            } else {
                console.error("Invalid Main item index:", index);
            }
        }
    };

    // #region ส่วนที่ 1 ข้อมูลทั่วไป
    Choose_Mas_A() { //สอดรับโครงการ
        let c_item = this.List_Mas_Project.filter((item: any) => item.Project_Id == this.Budget_Request_Income.Project_Support_Id) //แก้ชื่อ Mas_List
        this.Budget_Request_Income.Project_Support_Name = c_item[0].Project_Support_Name; //-สอดรับโครงการ

        this.Budget_Request_Income.Topic_Spec_Name = "โครงการที่ใช้งบประมาณ";
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
            this.Budget_Request_Income.Proceed_Qty = "";
            return;
        }

        // ถ้า Proceed_Qty มีค่า ให้คำนวณ Po_Qty อัตโนมัติ
        if (proceed_qty && proceed_qty > 0) {
            this.Budget_Request_Income.Proceed_Qty = proceed_qty;
            this.Budget_Request_Income.Po_Qty = Max_Qty - proceed_qty;
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
            this.Budget_Request_Income.Po_Qty = "";
            return;
        }

        // ถ้า Po_Qty มีค่า ให้คำนวณ Proceed_Qty อัตโนมัติ
        if (po_qty && po_qty > 0) {
            this.Budget_Request_Income.Po_Qty = po_qty;
            this.Budget_Request_Income.Proceed_Qty = Max_Qty - po_qty;
        }
    }



    Choose_Project_Type_Id(currentValue: number, selectedValue: number) {//ประเภทโครงการ
        if (currentValue !== selectedValue) {
            this.Budget_Request_Income.Project_Type_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                this.Budget_Request_Income.Project_Type_Name = "ใหม่";
            } else if (selectedValue == 2) {
                this.Budget_Request_Income.Project_Type_Name = "ต่อเนื่อง";
            } else {
                this.Budget_Request_Income.Project_Type_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }


    Choose_Project_Status_Id(currentValue: number, selectedValue: number) { //สถานะโครงการ
        if (currentValue !== selectedValue) {
            this.Budget_Request_Income.Project_Status_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                this.Budget_Request_Income.Project_Status_Name = "อยู่ระหว่างดำเนินการ";
            } else if (selectedValue == 2) {
                this.Budget_Request_Income.Project_Status_Name = "ยังไม่ดำเนินการ";
            } else {
                this.Budget_Request_Income.Project_Status_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }
    // #endregion



    // #region 1.1 ยุทธศาสตร์ชาติที่เกี่ยวข้องโดยตรง (Z)
    Choose_Mas_National_Strategy_Detail() {

        const Strategy_Id = this.Budget_Request_Income_Detail.Strategy_Id;
        //clear ยุทธศาสตร์ชาติ-ประเด็น
        // this.Budget_Request_Income_Detail.Issues_Id = "";
        // this.Budget_Request_Income_Detail.Sub_Issues_Id = "";
        if (Strategy_Id != null && Strategy_Id != undefined && Strategy_Id != "") {
            let c_item = this.List_Mas_National_Strategy.filter((item_old: any) => item_old.Strategy_Id == Strategy_Id)
            if (c_item && c_item.length > 0) {
                this.Budget_Request_Income_Detail.Strategy_Name = c_item[0].Strategy_Name;
            }
        }
        this.List_Mas_Strategy_Head_Issue = this.Old_List_Mas_Strategy_Head_Issue.filter((item: any) => item.Fk_Strategy_Id == Strategy_Id)
    }
    Choose_Mas_Strategy_Head_Issue_Detail() {
        const Issues_Id = this.Budget_Request_Income_Detail.Issues_Id;
        //clear ประเด็นยุทธศาสตร์-ประเด็นย่อย   
        // this.Budget_Request_Income.Sub_Issues_Id = "";

        if (Issues_Id != null && Issues_Id != undefined && Issues_Id != "") {
            let c_item = this.List_Mas_Strategy_Head_Issue.filter((item: any) => item.Issues_Id == Issues_Id)
            if (c_item && c_item.length > 0) {
                this.Budget_Request_Income_Detail.Issues_Name = c_item[0].Issues_Name;
            }
        }

        this.List_Mas_Strategy_Sub_Issue = this.Old_List_Mas_Strategy_Sub_Issue.filter((item: any) => item.Fk_Issues_Id == Issues_Id)
    }

    Choose_Mas_Strategy_Sub_Issue_Detail() {
        const Sub_Issues_Id = this.Budget_Request_Income_Detail.Sub_Issues_Id;
        if (Sub_Issues_Id != null && Sub_Issues_Id != undefined && Sub_Issues_Id != "") {
            let c_item = this.List_Mas_Strategy_Sub_Issue.filter((item: any) => item.Sub_Issues_Id == Sub_Issues_Id)
            if (c_item && c_item.length > 0) {
                this.Budget_Request_Income_Detail.Sub_Issues_Name = c_item[0].Sub_Issues_Name;
            }
        }
    }
    // #endregion

    // #region 1.2 ยุทธศาสตร์ชาติที่เกี่ยวข้องในระดับรอง (Z)
    Choose_Sub_Mas_National_Strategy_Detail(data: any) {
        //clear ยุทธศาสตร์ชาติ-ประเด็น
        // data.Issues_Id = "";
        // data.Sub_Issues_Id = "";
        if (this.add == "new") {
            const Strategy_Id = data.Strategy_Id;
            if (data.Strategy_Id != null && data.Strategy_Id != undefined && data.Strategy_Id != "") {
                let c_item = this.List_Sec_Mas_National_Strategy.filter((item: any) => item.Strategy_Id == data.Strategy_Id)
                if (c_item && c_item.length > 0) {
                    data.Strategy_Name = c_item[0].Strategy_Name;
                }
            }
            // ดึง List_Mas_ประเด็น ->เปลี่ยนจากตัวแปรกลาง เป็น property ของแต่ละ object
            data.List_Sec_Sub_Mas_Strategy_Head_Issue = this.Old_List_Mas_Strategy_Head_Issue.filter((item_old: any) => item_old.Fk_Strategy_Id == data.Strategy_Id);
        } else if (this.add == "edit") {
            //รับค่า List_Budget_Request_Income_Strategy_Sub_Item จาก base มาใช้ ->data มีค่าเป็น array
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                item.List_Sec_Sub_Mas_Strategy_Head_Issue = this.Old_List_Mas_Strategy_Head_Issue.filter(
                    (issue: any) => issue.Fk_Strategy_Id == item.Strategy_Id
                );
            }
        }
    }
    Choose_Sub_Mas_Strategy_Head_Issue_Detail(data: any) {


        if (this.add == "new") {
            const Issues_Id = data.Issues_Id;
            if (Issues_Id != null && Issues_Id != undefined && Issues_Id != "") {
                let c_item = this.List_Sec_Sub_Mas_Strategy_Head_Issue.filter((item: any) => item.Issues_Id == Issues_Id)
                if (c_item && c_item.length > 0) {
                    data.Issues_Name = c_item[0].Issues_Name;
                }
            }
            data.List_Sec_Strategy_Sub_Issue = this.Old_List_Mas_Strategy_Sub_Issue.filter((item_old: any) => item_old.Fk_Issues_Id == data.Issues_Id)
        } else if (this.add == "edit") {
            //รับค่า List_Budget_Request_Income_Strategy_Sub_Item จาก base มาใช้ ->data มีค่าเป็น array
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                item.List_Sec_Strategy_Sub_Issue = this.Old_List_Mas_Strategy_Sub_Issue.filter(
                    (issue: any) => issue.Fk_Issues_Id == item.Issues_Id
                );
            }
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
    // #endregion

    // #region 2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
    Choose_Mas_MasterPlan_Under_Nationnal_Strategy_Detail(data: any) {
        //clear vlaue
        // data.Target_Id = "";
        // data.Sub_MasterPlan_Id = "";
        // data.Sub_Target_Id = "";
        // data.Sub_Develop_Id = "";

        if (this.add == "new") {
            if (data.MasterPlan_Id != null && data.MasterPlan_Id != undefined && data.MasterPlan_Id != "") {
                let c_item = this.List_Mas_MasterPlan_Under_Nationnal_Strategy.filter((item: any) => item.MasterPlan_Id == data.MasterPlan_Id)
                if (c_item && c_item.length > 0) {
                    data.MasterPlan_Name = c_item[0].MasterPlan_Name;
                }
            }

            //เอา MasterPlan_Id มาเป็น Fk_MasterPlan_Id ในการค้นหา
            data.List_Mas_MasterPlan_Target = this.Old_List_Mas_MasterPlan_Target.filter((item: any) => item.Fk_MasterPlan_Id == data.MasterPlan_Id)
        } else if (this.add == "edit") {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    item.List_Mas_MasterPlan_Target = this.Old_List_Mas_MasterPlan_Target.filter((old_item: any) => old_item.Fk_MasterPlan_Id == item.MasterPlan_Id)
                    console.log(item.MasterPlan_Id, item.List_Mas_MasterPlan_Target);
                }

            } else {
                if (data.MasterPlan_Id != null && data.MasterPlan_Id != undefined && data.MasterPlan_Id != "") {
                    let c_item = this.List_Mas_MasterPlan_Under_Nationnal_Strategy.filter((item: any) => item.MasterPlan_Id == data.MasterPlan_Id)
                    if (c_item && c_item.length > 0) {
                        data.MasterPlan_Name = c_item[0].MasterPlan_Name;
                    }
                }

                //เอา MasterPlan_Id มาเป็น Fk_MasterPlan_Id ในการค้นหา
                data.List_Mas_MasterPlan_Target = this.Old_List_Mas_MasterPlan_Target.filter((item: any) => item.Fk_MasterPlan_Id == data.MasterPlan_Id)
            }

        }
    }

    Choose_Mas_MasterPlan_Target_Detail(data: any) {
        //Clear Value
        // data.Sub_MasterPlan_Id = "";
        // data.Sub_Target_Id = "";
        // data.Sub_Develop_Id = "";
        if (this.add == "new") {
            if (data.Target_Id != null && data.Target_Id != undefined && data.Target_Id != "") {
                let c_item = this.List_Mas_MasterPlan_Target.filter((item: any) => item.Target_Id == data.Target_Id)
                if (c_item && c_item.length > 0) {
                    data.Target_Name = c_item[0].Target_Name;
                }
            }

            //เอา Target_Id มาเป็น Fk_Target_Id ในการค้นหา
            data.List_Mas_Sub_MasterPlan = this.Old_List_Mas_Sub_MasterPlan.filter((item: any) => item.Fk_MasterPlan_Id == data.MasterPlan_Id)
        } else if (this.add == "edit") {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    item.List_Mas_Sub_MasterPlan = this.Old_List_Mas_Sub_MasterPlan.filter((item_old: any) => item_old.Fk_MasterPlan_Id == item.MasterPlan_Id)
                }
            } else {
                if (data.Target_Id != null && data.Target_Id != undefined && data.Target_Id != "") {
                    let c_item = this.Old_List_Mas_MasterPlan_Target.filter((item: any) => item.Target_Id == data.Target_Id)
                    if (c_item && c_item.length > 0) {
                        data.Target_Name = c_item[0].Target_Name;
                    }
                }

                //เอา Target_Id มาเป็น Fk_Target_Id ในการค้นหา
                data.List_Mas_Sub_MasterPlan = this.Old_List_Mas_Sub_MasterPlan.filter((item: any) => item.Fk_MasterPlan_Id == data.MasterPlan_Id)
            }


        }
    }

    Choose_Mas_Sub_MasterPlan_Detail(data: any) {

        //Clear Value
        // data.Sub_Target_Id = "";
        // data.Sub_Develop_Id = "";
        if (this.add == "new") {
            if (data.Sub_MasterPlan_Id != null && data.Sub_MasterPlan_Id != undefined && data.Sub_MasterPlan_Id != "") {
                let c_item = this.List_Mas_Sub_MasterPlan.filter((item: any) => item.Sub_MasterPlan_Id == data.Sub_MasterPlan_Id)
                if (c_item && c_item.length > 0) {
                    data.Sub_MasterPlan_Name = c_item[0].Sub_MasterPlan_Name;
                }
            }
            //เอา Sub_MasterPlan_Id มาเป็น Fk_Sub_MasterPlan_Id ในการค้นหา
            data.List_Mas_Sub_MasterPlan_Target = this.Old_List_Mas_Sub_MasterPlan_Target.filter((item: any) => item.Fk_Sub_MasterPlan_Id == data.Sub_MasterPlan_Id)

            //เอา Sub_MasterPlan_Id มาเป็น Fk_Sub_MasterPlan_Id ในการค้นหา
            data.List_Mas_Sub_MasterPlan_Develop = this.Old_List_Mas_Sub_MasterPlan_Develop.filter((item: any) => item.Fk_Sub_MasterPlan_Id == data.Sub_MasterPlan_Id)
        } else if (this.add == "edit") {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    item.List_Mas_Sub_MasterPlan_Target = this.Old_List_Mas_Sub_MasterPlan_Target.filter((item_old: any) => item_old.Fk_Sub_MasterPlan_Id == item.Sub_MasterPlan_Id)
                    item.List_Mas_Sub_MasterPlan_Develop = this.Old_List_Mas_Sub_MasterPlan_Develop.filter((item_old: any) => item_old.Fk_Sub_MasterPlan_Id == item.Sub_MasterPlan_Id)
                }
            } else {
                if (data.Sub_MasterPlan_Id != null && data.Sub_MasterPlan_Id != undefined && data.Sub_MasterPlan_Id != "") {
                    let c_item = this.List_Mas_Sub_MasterPlan.filter((item: any) => item.Sub_MasterPlan_Id == data.Sub_MasterPlan_Id)
                    if (c_item && c_item.length > 0) {
                        data.Sub_MasterPlan_Name = c_item[0].Sub_MasterPlan_Name;
                    }
                }
                //เอา Sub_MasterPlan_Id มาเป็น Fk_Sub_MasterPlan_Id ในการค้นหา
                data.List_Mas_Sub_MasterPlan_Target = this.Old_List_Mas_Sub_MasterPlan_Target.filter((item: any) => item.Fk_Sub_MasterPlan_Id == data.Sub_MasterPlan_Id)

                //เอา Sub_MasterPlan_Id มาเป็น Fk_Sub_MasterPlan_Id ในการค้นหา
                data.List_Mas_Sub_MasterPlan_Develop = this.Old_List_Mas_Sub_MasterPlan_Develop.filter((item: any) => item.Fk_Sub_MasterPlan_Id == data.Sub_MasterPlan_Id)
            }

        }
    }
    Choose_Mas_Sub_MasterPlan_Target_Detail(data: any) {

        if (this.add == "new") {
            if (data.Sub_Target_Id != null && data.Sub_Target_Id != undefined && data.Sub_Target_Id != "") {
                let c_item = this.List_Mas_Sub_MasterPlan_Target.filter((item: any) => item.Sub_Target_Id == data.Sub_Target_Id)
                if (c_item && c_item.length > 0) {
                    data.Sub_Target_Name = c_item[0].Sub_Target_Name;
                }
            }
        } else if (this.add == "edit") {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    item.List_Mas_Sub_MasterPlan_Target = this.Old_List_Mas_Sub_MasterPlan_Target.filter((item_old: any) => item_old.Fk_Sub_MasterPlan_Id == item.Sub_MasterPlan_Id)
                }
            } else {
                if (data.Sub_Target_Id != null && data.Sub_Target_Id != undefined && data.Sub_Target_Id != "") {
                    let c_item = this.List_Mas_Sub_MasterPlan_Target.filter((item: any) => item.Sub_Target_Id == data.Sub_Target_Id)
                    if (c_item && c_item.length > 0) {
                        data.Sub_Target_Name = c_item[0].Sub_Target_Name;
                    }
                }
            }
        }
    }
    Choose_Mas_Sub_MasterPlan_Develop_Detail(data: any) {

        if (this.add == "new") {
            if (data.Sub_Develop_Id != null && data.Sub_Develop_Id != undefined && data.Sub_Develop_Id != "") {
                let c_item = this.List_Mas_Sub_MasterPlan_Develop.filter((item: any) => item.Sub_Develop_Id == data.Sub_Develop_Id)
                if (c_item && c_item.length > 0) {
                    data.Sub_Develop_Name = c_item[0].Sub_Develop_Name;
                }
            }
        } else if (this.add == "edit") {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    item.List_Mas_Sub_MasterPlan_Develop = this.Old_List_Mas_Sub_MasterPlan_Develop.filter((item_old: any) => item_old.Fk_Sub_MasterPlan_Id == item.Sub_MasterPlan_Id)
                }
            } else {
                if (data.Sub_Develop_Id != null && data.Sub_Develop_Id != undefined && data.Sub_Develop_Id != "") {
                    let c_item = this.List_Mas_Sub_MasterPlan_Develop.filter((item: any) => item.Sub_Develop_Id == data.Sub_Develop_Id)
                    if (c_item && c_item.length > 0) {
                        data.Sub_Develop_Name = c_item[0].Sub_Develop_Name;
                    }
                }
            }

        }
    }
    // #endregion

    //List Checkbox
    // ฟังก์ชันนี้จะ map checked flag และ return เฉพาะ item ที่ checked
    Get_List_Mas_Project_Consistency_Item(data: any[]): any[] {
        if (!Array.isArray(data)) return [];
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            // ตรวจสอบว่ามี Consistency_Sec_Id ตรงกับ master หรือไม่
            const found = this.List_Budget_Request_Income_Project_Consistency_Item.some(
                (sub: any) => sub.Consistency_Sec_Id === item.Consistency_Sec_Id
            );
            item.Chk_Row_Consistency = found ? 1 : 0;
        }
        // return ทุกแถว (checked หรือไม่ checked)
        return data;
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
        let total = 0;
        let len_item = this.List_Budget_Request_Income_Multi_Item.length;
        for (let i = 0; i < len_item; i++) {
            total = total + (this.List_Budget_Request_Income_Multi_Item[i].Plan_Amount_Total || 0);
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

    // ฟังก์ชันสำหรับจัดการ checkbox consistency
    onConsistencyCheckboxChange(item_p3: any, item_p4_sub: any) {
        //
        let Consistency_Sec_Id = item_p4_sub.Consistency_Sec_Id;
        // เตรียม object ตามโครงสร้างที่ต้องการ
        const consistencyObj = {
            Consistency_Type_Id: item_p3.Consistency_Type_Id,
            Consistency_Type_Name: item_p3.Consistency_Type_Name,
            // Row_Select: item_p4_sub.Chk_Row_Consistency,
            Consistency_Sec_Id: item_p4_sub.Consistency_Sec_Id,
            Consistency_Sec_Name: item_p4_sub.Consistency_Sec_Name,
            Consistency_Sub_Name: item_p4_sub.Consistency_Sub_Name,
            Target_Remark: item_p4_sub.Target_Remark
        };

        // ตรวจสอบว่ามี object นี้อยู่ใน List_Budget_Request_Income_Project_Consistency_Item แล้วหรือยัง (ใช้ Consistency_Type_Id, Consistency_Sec_Id, Consistency_Sub_Name)
        const existingIndex = this.List_Budget_Request_Income_Project_Consistency_Item.findIndex((item: any) =>
            item.Consistency_Type_Id === consistencyObj.Consistency_Type_Id &&
            item.Consistency_Type_Name === consistencyObj.Consistency_Type_Name &&
            // item.Row_Select === consistencyObj.Row_Select &&
            item.Consistency_Sec_Id === consistencyObj.Consistency_Sec_Id &&
            item.Consistency_Sec_Name === consistencyObj.Consistency_Sec_Name &&
            item.Consistency_Sub_Name === consistencyObj.Consistency_Sub_Name &&
            item.Target_Remark === consistencyObj.Target_Remark
        );

        //กลับมาแก้ this.add = "edit" ถ้าเป็น id เดิมให้ update
        if (item_p4_sub.Chk_Row_Consistency == true) {

            const idx = this.List_Budget_Request_Income_Project_Consistency_Item.findIndex(
                (item: any) => item.Consistency_Sec_Id === Consistency_Sec_Id
            );
            // if (idx !== -1) {
            //     // ถ้ามีแล้วให้ update เข้าไป
            //     this.List_Budget_Request_Income_Project_Consistency_Item[idx].Target_Remark = consistencyObj.Target_Remark;
            // } else {
            //     // ถ้ายังไม่มี ให้ push เข้าไป
            //     this.List_Budget_Request_Income_Project_Consistency_Item.push(consistencyObj);
            // }
            // ถ้ายังไม่มี ให้ push เข้าไป
            this.List_Budget_Request_Income_Project_Consistency_Item.push(consistencyObj);
        } else {
            // ถ้า uncheck ให้ลบออกจาก list
            const idx = this.List_Budget_Request_Income_Project_Consistency_Item.findIndex(
                (item: any) => item.Consistency_Sec_Id === Consistency_Sec_Id
            );
            if (idx !== -1) {
                this.List_Budget_Request_Income_Project_Consistency_Item.splice(idx, 1);
            }
        }


        this.cdr.detectChanges();
        console.log('List_Budget_Request_Income_Project_Consistency_Item:', this.List_Budget_Request_Income_Project_Consistency_Item);
    }

    // ฟังก์ชันสำหรับตรวจสอบว่า checkbox ถูกเลือกหรือไม่
    isConsistencySelected(item: any): boolean {
        if (!this.Budget_Request_Income_Detail.Selected_Consistencies) {
            return false;
        }
        return this.Budget_Request_Income_Detail.Selected_Consistencies.some(
            (selected: any) => selected.Consistency_Sub_Id === item.Consistency_Sub_Id
        );
    }

    // ฟังก์ชันแปลง string เป็น Date object
    parseDateFromString(dateStr: any): Date | null {
        if (!dateStr) return null;

        // กรณีเป็น /Date(123456789)/
        const m = typeof dateStr === 'string' ? dateStr.match(/\/Date\((\d+)\)\//) : null;
        if (m) {
            return new Date(+m[1]);
        } else {
            // กรณีเป็น string ที่เก็บ timestamp
            let dateString = '';
            if (typeof dateStr === 'string' && dateStr.startsWith('/Date(')) {
                dateString = dateStr.substring(6, dateStr.length - 2);
            } else if (typeof dateStr === 'string' && dateStr.startsWith('Date(')) {
                dateString = dateStr.substring(5, dateStr.length - 1);
            } else if (typeof dateStr === 'string') {
                dateString = dateStr;
            } else if (typeof dateStr === 'number') {
                dateString = dateStr.toString();
            }

            let timestamp = parseInt(dateString, 10);
            if (isNaN(timestamp)) return null;

            return new Date(timestamp);
        }
    }



}