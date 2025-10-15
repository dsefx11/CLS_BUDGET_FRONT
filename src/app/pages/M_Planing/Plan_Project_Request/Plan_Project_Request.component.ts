import { Component, ElementRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, FormControl, FormControlName, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridJsService } from '../../tables/gridjs/gridjs.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { GridJsModel } from '../../tables/gridjs/gridjs.model';
import { DecimalPipe } from '@angular/common';
import { get } from 'lodash';
import Swal from 'sweetalert2';
import { EbudgetService } from 'src/app/core/services/ebudget.service';
import { e } from 'mathjs';
import { act } from '@ngrx/effects';
import { MasterService } from 'src/app/core/services/master.service'







@Component({
    selector: 'Plan_Project_Request',
    templateUrl: 'Plan_Project_Request.component.html',
    styleUrls: ['../M_Planing.scss'],
    providers: [GridJsService, DecimalPipe, EbudgetService]
})


export class Plan_Project_RequestComponent {


    // bread crumb items
    breadCrumbItems!: Array<{}>;
    // Table data
    gridjsList$!: Observable<GridJsModel[]>;
    total$: Observable<number>;
    griddata: any;

    totalSize: number = 0;



    Department_Id: any;
    Permission_Id: any;


    modal_title: any;


    page_run: number = 0;
    formPartial: string = '';
    Form_Id: number = 0;

    Form_Name: string = '';
    Sub_From_Name: string = ''; //ชื่อ Sub From

    Bgyear: any = 0;

    IDA: number = 0;

    Project_Type_Id: number = 0; // 1:ขาขึ้น, 2:ขาลง
    budgetType: any; // ประเภทคำของบดำเนินงาน

    Expense_Type_Id: number = 0; // หมวดค่าใช้จ่าย วางแผนโครงการ

    add: any; // เพิ่มข้อมูล หรือ แก้ไขข้อมูล

    List_Table: any = []; //mock data

    Tran_list_Budget_req: any = []; // ข้อมูลทั้งหมด
    filteredTranList: any[] = []; // ข้อมูลที่กรองแล้ว



    List_Mas_Department: any = []; //หน่วยงาน
    List_Mas_Budget_Type: any = []; // ประเภทงบประมาณ

    old_Budget_Plan_Project: any = []; // ข้อมูลทั้งหมด วางแผนโครงการ
    List_Budget_Plan_Project: any = []; // รายการวางแผนโครงการ
    Budget_Request_Detail: any = []; // ข้อมูลทั้งหมด วางแผนโครงการ

    List_Mas_Plan: any = []; // แผนงาน
    old_product: any = []; // ข้อมูลทั้งหมด แผนงาน
    old_Activity: any = []; // ข้อมูลทั้งหมด กิจกรรม
    List_Mas_Product: any = []; // ผลิตภัณฑ์
    List_Mas_Activity: any = []; // กิจกรรม

    List_Mas_Activity_Dep_Main: any = []; // กิจกรรมหน่วยหลัก
    List_Mas_Activity_Dep_Second: any = []; // กิจกรรมหน่วยรอง
    Filter_List_Mas_Activity_Dep_Second: any = []; // กิจกรรมหน่วยรอง
    List_Mas_Activity_Dep_Sub: any = []; // กิจกรรมหน่วยย่อย
    Filter_List_Mas_Activity_Dep_Sub: any = []; // กิจกรรมหน่วยย่อย

    List_Mas_Expense_List: any = []; // รายการค่าใช้จ่าย
    List_Mas_Expense_Type: any = []; // ประเภทค่าใช้จ่าย
    old_Mas_Expense_Type: any = []; // ประเภทค่าใช้จ่าย
    old_Mas_Expense_List: any = []; // รายการค่าใช้จ่าย

    List_Purpose_Unit: any = []; // หน่วยนับเป้าหมาย
    List_Mas_Project: any = []; // รายการโครงการ
    List_Mas_Issue_Project: any = []; // รายการประเด็น

    //Sub DDL ส่งไปหา Child Component
    Budget_Plan_Project_Detail: any = {}; // item row
    List_Mas_National_Strategy: any = [];  //ยุทธศาสตร์ชาติ

    // Plan_Project_Form
    Budget_Plan_Project: any = {}; // คำขอวางแผนโครงการ
    Budget_Request_Income_Strategy_Sub_Item: any = {}; // item row
    Budget_Request_Income_Consistency_MS_Plan_Item: any = {}; // item row
    List_Budget_Plan_Project_Strategy_Sub_Item: any = [];


    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public MasterService: MasterService, public Serviceebudget: EbudgetService) {

        this.total$ = service.total$;
        sessionStorage.setItem("Department_Id", "27") //celest
        // sessionStorage.setItem("Permission_Id", "1")
        this.Department_Id = parseInt(sessionStorage.getItem("Department_Id") || "0");
        this.Permission_Id = sessionStorage.getItem("Permission_Id");
        this.Bgyear = sessionStorage.getItem("Bgyear");
        this.Project_Type_Id = 1; //ขาขึ้น

    }


    ngOnInit(): void {
        //เช็คประเภทงบ
        var path_name = window.location.pathname;
        var sp_path = path_name.split('/');
        var len_path = sp_path.length;
        var ac_name = sp_path[len_path - 1];
        if (ac_name == 'Plan_Project_Request') {
            this.budgetType = 6;
        } else {
            this.budgetType = 6;
        }

        let model = {
            FUNC_CODE: "FUNC-GET_DATA-BUDGET_PLANING",
            Fk_Budget_Type: this.budgetType,
            Department_Id: this.Department_Id,
            Permission_Id: this.Permission_Id,
            BgYear: this.Bgyear,
        }
        var getData = this.Serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            // debugger;
            if (response.RESULT == null) {
                this.old_Budget_Plan_Project = JSON.parse(
                    JSON.stringify(response.Budget_Plan_Project)
                );
                this.List_Mas_Department = response.List_Mas_Department;

                this.List_Mas_Plan = response.List_Mas_Plan;

                this.old_product = response.List_Mas_Product;
                this.old_Activity = response.List_Mas_Activity;

                this.List_Mas_Activity_Dep_Main = response.List_Mas_Activity_Dep_Main;
                this.Filter_List_Mas_Activity_Dep_Second = response.List_Mas_Activity_Dep_Second;
                this.Filter_List_Mas_Activity_Dep_Sub = response.List_Mas_Activity_Dep_Sub;

                this.List_Mas_Budget_Type = response.List_Mas_Budget_Type;
                this.old_Mas_Expense_Type = response.List_Mas_Expense_Type;
                this.old_Mas_Expense_List = response.List_Mas_Expense_List;

                this.List_Purpose_Unit = response.List_Mas_Unit; // หน่วยนับเป้าหมาย
                this.List_Mas_Project = response.List_Mas_Project; // รายการโครงการ
                this.List_Mas_Issue_Project = response.List_Mas_Issue_Project; // รายการประเด็น

                //Filter จาก ประเด็น
                this.List_Budget_Plan_Project = response.List_Budget_Plan_Project;

                if (this.List_Budget_Plan_Project.length > 0) {
                    const wantGroup: string[] = [
                        "Plan_Name",
                        "Product_Name",
                        "Activity_Name",
                    ];
                    1;
                    const groupedBudget: Record<string, any> =
                        this.MasterService.groupByMultipleKeys(
                            this.List_Budget_Plan_Project,
                            wantGroup
                        );
                    this.Tran_list_Budget_req =
                        this.transformGroupedData_BG_Plan_Project(groupedBudget);
                    // เริ่มต้นให้ filteredTranList มีค่าทั้งหมดของ Tran_list_Budget_req
                    this.filteredTranList = this.Tran_list_Budget_req;
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

    choose_issue_project() { // ดึง List หลัก จาก ประเด็น
        const issue_id = this.Budget_Plan_Project.Issue_Project_Id;
        const issue_item = this.List_Mas_Issue_Project.filter((item: any) => item.Issue_Project_Id == issue_id);
        this.Budget_Plan_Project.Issue_Project_Name = issue_item[0].Issue_Project_Name;

        // ดึง List หลัก จาก ประเด็น
        let model = {
            FUNC_CODE: "FUNC-Get_Data_List_Budget_Plan_Project",
            Fk_Budget_Type: this.budgetType,
            Department_Id: this.Department_Id,
            Permission_Id: this.Permission_Id,
            BgYear: this.Bgyear,
            Issue_Project_Id: issue_id
        }
        var getData = this.Serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            // debugger;
            if (response.RESULT == null) {
                //Filter จาก ประเด็น
                this.List_Budget_Plan_Project = response.List_Budget_Plan_Project;

                if (this.List_Budget_Plan_Project.length > 0) {
                    const wantGroup: string[] = [
                        "Plan_Name",
                        "Product_Name",
                        "Activity_Name",
                    ];
                    1;
                    const groupedBudget: Record<string, any> =
                        this.MasterService.groupByMultipleKeys(
                            this.List_Budget_Plan_Project,
                            wantGroup
                        );
                    this.Tran_list_Budget_req =
                        this.transformGroupedData_BG_Plan_Project(groupedBudget);
                    // เริ่มต้นให้ filteredTranList มีค่าทั้งหมดของ Tran_list_Budget_req
                    this.filteredTranList = this.Tran_list_Budget_req;
                } else {
                    this.List_Budget_Plan_Project = [];
                    this.filteredTranList = [];
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

    transformGroupedData_BG_Plan_Project = function (groupedData: Record<string, Array<any>>): Array<{
        key: string;
        Rid: number;
        Plan_Name: string;
        Product_Name: string;
        Activity_Name: string;
        Budget_Type: string;
        Expense_Type: string;
        Expense_List: string;
        Total: number;
        Budget_Plan_Project: any;
    }> {
        let result: Array<{
            key: string;
            Rid: number;
            Plan_Name: string;
            Product_Name: string;
            Activity_Name: string;
            Budget_Type: string;
            Expense_Type: string;
            Expense_List: string;
            Total: number;
            Budget_Plan_Project: any;
        }> = [];
        let lastKey: string = ""; // เก็บค่า key ของตัวก่อนหน้า
        let rid: number = 0;

        Object.keys(groupedData).forEach((key: string) => {
            groupedData[key].forEach((item: any, index: number) => {
                // ถ้า key ซ้ำกับ key ก่อนหน้า ให้ใช้ ""
                const displayKey: string = key === lastKey ? "" : key;
                rid = displayKey !== "" ? (rid + 1) : 0;

                result.push({
                    key: displayKey,
                    Rid: rid,
                    Plan_Name: displayKey !== "" ? item.Plan_Name : '',
                    Product_Name: displayKey !== "" ? item.Product_Name : '',
                    Activity_Name: displayKey !== "" ? item.Activity_Name : '',
                    Budget_Type: item.Budget_Type,
                    Expense_Type: item.Expense_Type,
                    Expense_List: item.Expense_List,
                    Total: item.Total,
                    Budget_Plan_Project: item
                });

                // อัพเดต lastKey เป็น key ปัจจุบัน
                lastKey = key;
            });
        });

        return result;
    };

    Clear_Form(old_list: any) {
        this.Budget_Plan_Project = JSON.parse(JSON.stringify(old_list)); //เคลีย Table->BG_Request_Income
        // this.List_Budget_Request_Income = [];  //เคลีย List_Budget_Request_Income
    }


    onFilter(term: string): void { //ใช้อันนี้ในการ Filter Talbe List
        // const lowerTerm = term.toLowerCase(); // แปลงคำค้นหาเป็นตัวพิมพ์เล็ก
        // this.List_Budget_Request_Income = this.Get_Detial_Budget_Request_Income.filter((item: any) => {
        //     // ตรวจสอบทุกฟิลด์ใน item
        //     return Object.values(item).some((value: any) => {
        //         if (value && typeof value === 'string') {
        //             return value.toLowerCase().includes(lowerTerm); // กรองเฉพาะฟิลด์ที่เป็น string
        //         }
        //         if (value && typeof value === 'number') {
        //             return value.toString().includes(lowerTerm); // กรองฟิลด์ที่เป็นตัวเลข
        //         }
        //         return false;
        //     });
        // });
    }

    //เรียงข้อมูล จากน้อยไปมาก
    onSort(column: any) {
        // this.List_Budget_Request_Income = this.sortService.onSort(column, this.List_Budget_Request_Income)
    }



    /**
 * Open small modal
 * @param smallDataModal small modal data
 */
    //คำสั่งเปิด Modal
    btn_add_fullModal(smallDataModal: any, ida: number, old_list: any, Issue_Project_Id: number) {
        // debugger;
        this.modalService.open(smallDataModal, { size: 'fullscreen', windowClass: 'modal-holder' });


        if (
            this.budgetType != null &&
            this.budgetType != undefined &&
            this.budgetType !== ""
        ) {
            this.budgetType = parseInt(this.budgetType);
        }

        let bd_type = this.List_Mas_Budget_Type.filter(
            (item: any) => item.Budget_Type_Id == this.budgetType
        );

        this.Budget_Plan_Project.Fk_Budget_Type = this.budgetType;
        this.Budget_Plan_Project.Budget_Type = bd_type[0].Budget_Type_Name;

        if (ida == 0) {
            // เพิ่มข้อมูลใหม่
            this.add = "new";

            this.modal_title = "เพิ่มวางแผนโครงการ";
            this.Budget_Plan_Project = JSON.parse(JSON.stringify(old_list));
            this.Budget_Plan_Project.Fk_Budget_Type = this.budgetType;
            this.Budget_Plan_Project.Budget_Type = bd_type[0].Budget_Type_Name;
            this.Budget_Plan_Project.Issue_Project_Id = Issue_Project_Id;
            var issue_item = this.List_Mas_Issue_Project.filter((item: any) => item.Issue_Project_Id == Issue_Project_Id);
            this.Budget_Plan_Project.Issue_Project_Name = issue_item[0].Issue_Project_Name;

            // this.List_Budget_Request_Detail_Item = []; // ล้างข้อมูลเก่า
            // this.calculatedTotal_Front = ""; // รีเซ็ตค่า
            this.choose_budget_Type();
        } else {
            // แก้ไขข้อมูล
            this.add = "edit";

            this.modal_title = "แก้ไขวางแผนโครงการ";
            this.Budget_Plan_Project = JSON.parse(JSON.stringify(old_list));
            this.choose_plan();
            this.choose_product();
            this.choose_activity();
            this.choose_activity_dep_main();
            this.choose_activity_dep_second();
            this.choose_activity_dep_sub();

            this.choose_budget_Type();
            this.choose_Expense_Type();
            this.choose_form();
            this.get_detail();
        }
    }

    //ปิด Modal  
    close_modal() {
        const modalButton = document.getElementById("cdFullmodal") as HTMLButtonElement;
        if (modalButton) {
            modalButton.click();
        }
    }


    choose_budget_Type() {
        const budId = this.Budget_Plan_Project.Fk_Budget_Type;
        this.List_Mas_Expense_Type = this.old_Mas_Expense_Type.filter(
            (item: any) => item.Fk_Budget_Type_Id === budId
        );
    }

    get_main_Data() {
        let model = {
            FUNC_CODE: "FUNC-GET_DATA-BR_FORM",
            // Fk_Budget_Type: this.budgetType,
            Department_Id: this.Department_Id,
            Permission_Id: this.Permission_Id
            //BgYear: this.select_year
        }
        var getData = this.Serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            debugger;
            if (response.RESULT == null) {
                this.List_Mas_Department = response.List_Mas_Department;

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

    Choose_Data_By_Department() {
        let model = {
            FUNC_CODE: "FUNC-GET_DATA-BR_FORM",
            Fk_Budget_Type: this.budgetType,
            Department_Id: this.Department_Id,
            Permission_Id: this.Permission_Id,
            //BgYear: this.select_year
        };
        var getData = this.Serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            debugger;
            if (response.RESULT == null) {
                this.old_Budget_Plan_Project = JSON.parse(
                    JSON.stringify(response.Budget_Request)
                );
                this.List_Mas_Department = response.List_Mas_Department;
                this.List_Budget_Plan_Project = response.List_Budget_Plan_Project;
                this.List_Mas_Plan = response.List_Mas_Plan;

                this.old_product = response.List_Mas_Product;
                this.old_Activity = response.List_Mas_Activity;

                this.List_Mas_Budget_Type = response.List_Mas_Budget_Type;
                this.old_Mas_Expense_Type = response.List_Mas_Expense_Type;
                this.old_Mas_Expense_List = response.List_Mas_Expense_List;

                this.Department_Id = parseInt(response.Department_Id);

                if (this.List_Budget_Plan_Project.length > 0) {
                    const wantGroup: string[] = [
                        "Plan_Name",
                        "Product_Name",
                        "Activity_Name",
                    ];
                    1;
                    const groupedBudget: Record<string, any> =
                        this.MasterService.groupByMultipleKeys(
                            this.List_Budget_Plan_Project,
                            wantGroup
                        );
                    // this.Tran_list_Budget_req =
                    //     this.transformGroupedData_BG_Plan_Project(groupedBudget);
                    // // เริ่มต้นให้ filteredTranList มีค่าทั้งหมดของ Tran_list_Budget_req
                    // this.filteredTranList = this.Tran_list_Budget_req;
                }
            } else {
                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: response.RESULT,
                    icon: "warning",
                    //showCancelButton: true,
                    confirmButtonColor: "rgb(3, 142, 220)",
                    // cancelButtonColor: 'rgb(243, 78, 78)',
                    confirmButtonText: "OK",
                });
            }
        });
    }

    choose_plan() {
        const plan_id = this.Budget_Plan_Project.Fk_Plan_Id;
        const plan_item = this.List_Mas_Plan.filter(
            (item: any) => item.Plan_Id == plan_id
        );
        this.Budget_Plan_Project.Plan_Name = plan_item[0].Plan_Name;

        this.List_Mas_Product = this.old_product.filter(
            (item: any) => item.Fk_Plan_Id == plan_id
        );

        if (this.add == "new") {
            this.Budget_Plan_Project.Fk_Product_Id = "";
            this.Budget_Plan_Project.Fk_Activity_Id = "";
        }
    }

    choose_product() {
        const fk_pro_id = this.Budget_Plan_Project.Fk_Product_Id;
        const pro_item = this.List_Mas_Product.filter(
            (item: any) => item.Product_Id == fk_pro_id
        );
        this.Budget_Plan_Project.Product_Name = pro_item[0].Product_Name;

        this.List_Mas_Activity = this.old_Activity.filter(
            (item: any) => item.Fk_Product_Id == this.Budget_Plan_Project.Fk_Product_Id
        );

        if (this.add == "new") {
            this.Budget_Plan_Project.Fk_Activity_Id = "";
        }
    }

    choose_activity() {
        const act_id = this.Budget_Plan_Project.Fk_Activity_Id;
        const act_item = this.List_Mas_Activity.filter(
            (item: any) => item.Activity_Id == act_id
        );
        if (act_item.length > 0) {
            this.Budget_Plan_Project.Activity_Name = act_item[0].Activity_Name;
        }
    }

    choose_activity_dep_main() {
        const Activity_Dep_Id = this.Budget_Plan_Project.Activity_Dep_Id;
        if (Activity_Dep_Id != null && Activity_Dep_Id != undefined && Activity_Dep_Id != 0) {
            const list_mas = this.List_Mas_Activity_Dep_Main.filter((item: any) => item.Activity_Dep_Id == Activity_Dep_Id);
            this.Budget_Plan_Project.Activity_Dep_Name = list_mas[0].Activity_Name;

            this.List_Mas_Activity_Dep_Second = this.Filter_List_Mas_Activity_Dep_Second.filter((item: any) => item.Fk_Activity_Dep_Id == Activity_Dep_Id);
        }

    }

    choose_activity_dep_second() {
        const Activity_Dep_Second_Id = this.Budget_Plan_Project.Activity_Dep_Second_Id;
        if (Activity_Dep_Second_Id != null && Activity_Dep_Second_Id != undefined && Activity_Dep_Second_Id != 0) {
            const list_mas = this.List_Mas_Activity_Dep_Second.filter((item: any) => item.Activity_Dep_Second_Id == Activity_Dep_Second_Id);
            this.Budget_Plan_Project.Activity_Dep_Second_Name = list_mas[0].Activity_Name;

            this.List_Mas_Activity_Dep_Sub = this.Filter_List_Mas_Activity_Dep_Sub.filter((item: any) => item.Fk_Activity_Dep_Second_Id == Activity_Dep_Second_Id);
        }
    }

    choose_activity_dep_sub() {
        const Activity_Dep_Sub_Id = this.Budget_Plan_Project.Activity_Dep_Sub_Id;
        if (Activity_Dep_Sub_Id != null && Activity_Dep_Sub_Id != undefined && Activity_Dep_Sub_Id != 0) {
            const list_mas = this.List_Mas_Activity_Dep_Sub.filter((item: any) => item.Activity_Dep_Sub_Id == Activity_Dep_Sub_Id);
            this.Budget_Plan_Project.Activity_Dep_Sub_Name = list_mas[0].Activity_Name;
        }
    }

    choose_purpost_unit() {
        const Purpose_Unit_Id = this.Budget_Plan_Project.Purpose_Unit_Id;
        const List_item = this.List_Purpose_Unit.filter((item: any) => item.Unit_Id == Purpose_Unit_Id);
        if (List_item.length > 0) {
            this.Budget_Plan_Project.Purpose_Unit_Name = List_item[0].Unit_Name;
        }
    }

    choose_Expense_Type() {
        const exType_id = this.Budget_Plan_Project.Fk_Expense_Type;
        const exType_item = this.List_Mas_Expense_Type.filter(
            (item: any) => item.Expense_Type_Id == exType_id
        );

        this.Budget_Plan_Project.Expense_Type = exType_item[0].Expense_Type_Name;

        this.List_Mas_Expense_List = this.old_Mas_Expense_List.filter(
            (item: any) =>
                item.Fk_Expense_Type_Id == this.Budget_Plan_Project.Fk_Expense_Type
        );
    }

    async get_detail(): Promise<any> { //ดึงค่าข้อมูล ส่วนที่ 1
        let model = {
            FUNC_CODE: 'FUNC-Get_Data-Plan_BG_Detail_FORM',
            Budget_Plan_Project: this.Budget_Plan_Project,
            // Budget_Request: this.Budget_Request,
            // TYPE_IDA: this.Budget_Request.Fk_Expense_List
        };
        try {
            const response = await this.getDataIncomeDetailPromise(model);
            this.Budget_Plan_Project = response.Budget_Plan_Project;
            this.Budget_Plan_Project_Detail = response.Budget_Plan_Project_Detail;
            //ค่าตอบแทน 6.1 //แบบฟอร์มตัวคูณ
            // this.List_Budget_Request_Income_Multi_Item = response.List_Budget_Request_Income_Multi_Item;
            //ค่าตอบแทน 6(4.1) //แบบฟอร์มละเอียด //ต้องใช้ List_Budget_Request_Detail_Item เดิมเพราะไปดึงฟอร์มของ คำขอโครงการมาใช้งาน
            // this.List_Budget_Request_Detail_Item = response.List_Budget_Request_Income_Detail_Item; //ใช้ List_Budget_Request_Income_Detail_Item ในการดึงข้อมูลของเงินรายได้

            //'1.2 ยุทธศาสตร์ชาติที่เกี่ยวข้องในระดับรอง (Z)
            this.List_Budget_Plan_Project_Strategy_Sub_Item = response.List_Budget_Plan_Project_Strategy_Sub_Item;
            // if (this.List_Budget_Request_Income_Multi_Item.length > 0) {
            //     this.calTotal_item_type_edit();
            // }
            // // //2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
            // this.List_Budget_Request_Income_Consistency_MS_Plan_Item = response.List_Budget_Request_Income_Consistency_MS_Plan_Item;
            // //2.5 ความสอดคล้องกับแผนความมั่นคงชาติ
            // this.List_Budget_Request_Income_Consistent_Plan_Nation_Item = response.List_Budget_Request_Income_Consistent_Plan_Nation_Item;
            // //3.1 ตามมติ ครม. วันที่ 4 ธันวาคม 2560
            // this.List_Budget_Request_Income_Consistent_Plan_Item = response.List_Budget_Request_Income_Consistent_Plan_Item;
            // //3.4 กฏหมายที่เกี่ยวข้อง
            // this.List_Budget_Request_Income_Law_Relate_Item = response.List_Budget_Request_Income_Law_Relate_Item;
            // //3.5 มติคณะรัฐมนตรีที่เกี่ยวข้อง
            // this.List_Budget_Request_Income_Cabinet_Resolution_Item = response.List_Budget_Request_Income_Cabinet_Resolution_Item;
            // //3.2/3.3/3.6/3.7/3.8
            // this.List_Budget_Request_Income_Project_Consistency_Item = response.List_Budget_Request_Income_Project_Consistency_Item;
            // //ส่วนที่ 3 Small Success
            // this.Budget_Request_Income_Project_Detial = response.Budget_Request_Income_Project_Detial;
            // this.List_Budget_Request_Income_Project_Detial_Item = response.List_Budget_Request_Income_Project_Detial_Item;
            // //ส่วนที่ 4 ส่วนของกิจกรรม
            // //Main->เพิ่มรายการ(กิจกรรม)->List_Budget_Request_Income_Multi_Item มีกิจกรรมหลายรายการ
            // this.List_Budget_Request_Income_Multi_Item_Sub = response.List_Budget_Request_Income_Multi_Item_Sub; //รายการคำขอ รายละเอียดตัวคูณ /ส่วนที่4->กิจกรรม(ย่อย)
            // this.List_Budget_Request_Income_Multi_Week_Plan_Item = response.List_Budget_Request_Income_Multi_Week_Plan_Item; //วางแผนรายสัปดาห์
            // this.List_Budget_Request_Income_Multi_Plan_Item = response.List_Budget_Request_Income_Multi_Plan_Item; //วางแผนรายการตัวคูณ
            // this.List_Budget_Request_Income_Multi_Sub_Item = response.List_Budget_Request_Income_Multi_Sub_Item; //กิจกรรม(ย่อย)
            // this.List_Budget_Request_Income_Multi_Week_Plan_Item_Multi_Sub = response.List_Budget_Request_Income_Multi_Week_Plan_Item_Multi_Sub; //วางแผนรายสัปดาห์(ย่อย)
            // this.List_Budget_Request_Income_Multi_Plan_Item_Multi_Sub = response.List_Budget_Request_Income_Multi_Plan_Item_Multi_Sub; //วางแผนรายการตัวคูณ(ย่อย)
            // this.List_Budget_Request_Income_Multi_Month_Plan_Item = response.List_Budget_Request_Income_Multi_Month_Plan_Item; //วางแผนไตรมาส (หลัก)

            // if (this.add == "new") {
            //     this.Budget_Request_Income.Topic_Income_Id = this.Topic_Income_Id;
            //     let list_topic = this.List_Mas_Request_Income.filter((item: any) => item.Request_Income_Id == this.Topic_Income_Id);
            //     this.Budget_Request_Income.Topic_Income_Name = list_topic[0].Request_Income_Name;
            //     this.Budget_Request_Income.Topic_Income_Sub_Id = this.Topic_Income_Sub_Id;
            //     let list_topic_sub = this.List_Mas_Request_Income_Detail.filter((item: any) => item.Request_Income_Detail_Id == this.Topic_Income_Sub_Id);
            //     this.Budget_Request_Income.Topic_Income_Sub_Name = list_topic_sub[0].Request_Name;
            // }
            return response;
        } catch (err) {
            // Swal.fire(...) ถูกเรียกใน Promise แล้ว
            throw err;
        }
    }

    // --- เพิ่มฟังก์ชัน Promise สำหรับดึงข้อมูล ---
    getDataIncomeDetailPromise(model: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Serviceebudget.GatewayGetData(model).subscribe(
                (response: any) => {
                    if (response.RESULT == null) {
                        resolve(response);
                    } else {
                        Swal.fire({
                            title: 'เกิดข้อผิดพลาด!',
                            text: response.RESULT,
                            icon: 'warning',
                            confirmButtonColor: 'rgb(3, 142, 220)',
                            confirmButtonText: 'OK'
                        });
                        reject(response.RESULT);
                    }
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    async choose_form(): Promise<void> {

        this.page_run += 1;

        const formC = this.List_Mas_Expense_List.filter(
            (item: any) => item.Expense_Id == this.Budget_Plan_Project.Fk_Expense_List
        );

        if (formC.length > 0) {
            this.Budget_Plan_Project.Expense_List = formC[0].Expense_Name;

            const FormName = formC[0].FormName;
            const Expense_Name = formC[0].Expense_Name;
            this.formPartial = FormName;
            await this.get_detail();
            this.Form_Name = Expense_Name;
            this.Expense_Type_Id = formC[0].Fk_Expense_Type_Id; // หมวดค่าใช้จ่าย

            // Save the selected form ID
            this.Form_Id = this.Budget_Plan_Project.Fk_Expense_List;
        } else {
            console.error("No matching form found for the selected Expense_List.");
        }
    }


    btn_save() {
        //เอาไปเซฟ
        this.Budget_Plan_Project.Bgyear = this.Bgyear;
        this.Budget_Plan_Project.Department_Id = this.Department_Id;
        var depart_item = this.List_Mas_Department.filter((item: any) => item.Department_Id == this.Department_Id);
        this.Budget_Plan_Project.Department_Name = depart_item[0].Department_Name;


        //เซตค่า กิจกรรม(ย่อย) Is_Used_BG เป็น 1 หรือ 0 ถ้าส่งมาเป็น Boolean
        if (this.Budget_Plan_Project.Is_Used_BG === true) {
            this.Budget_Plan_Project.Is_Used_BG = 1;
        } else if (this.Budget_Plan_Project.Is_Used_BG === false) {
            this.Budget_Plan_Project.Is_Used_BG = 0;
        }

        let model = {
            // FUNC_CODE: "FUNC-SAVE_BG_REQUEST_INCOME",
            AUTHEN_INFORMATION: {
                NAME: 'Super_Admin',
            },
            FUNC_CODE: 'FUNC-SAVE_Budget_Plan_Project', //ไปทำ function เซฟใหม่ ของ BG_Plan_Project
            Budget_Plan_Project: this.Budget_Plan_Project,
        }
        //console.log(model);
        let getData = this.Serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            //debugger;
            if (response.RESULT == null) {
                Swal.fire({
                    title: 'บันทึกสำเร็จ!',
                    text: 'บันทึกรายการวางแผนโครงการ!',
                    icon: 'success',
                    //showCancelButton: true,
                    confirmButtonColor: 'rgb(3, 142, 220)',
                    //cancelButtonColor: 'rgb(243, 78, 78)',
                    confirmButtonText: 'OK'
                });
                this.close_modal();
                this.ngOnInit();
            } else {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: response.RESULT,
                    icon: 'warning',
                    confirmButtonColor: 'rgb(3, 142, 220)',
                    confirmButtonText: 'OK'
                });
            }
        });
    }

    btn_del_Budget_Req(IDA: any) {
        Swal.fire({
            title: "ลบข้อมูล?",
            text: "คุณต้องการลบข้อมูลใช่หรือไม่!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "rgb(3, 142, 220)",
            cancelButtonColor: "rgb(243, 78, 78)",
            confirmButtonText: "ต้องการ!",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            debugger;
            if (result.value) {
                let model = {
                    FUNC_CODE: "FUNC-DEL_DATA-Budget_Request",
                    IDA: IDA,
                };
                var getData = this.Serviceebudget.GatewayGetData(model);
                getData.subscribe((response: any) => {
                    //debugger;
                    if (response.RESULT == null) {
                        //this.List_Group_Exam = response.List_Group_Exam;
                        Swal.fire({
                            title: "ลบสำเร็จ!",
                            text: "ลบข้อมูลรายการคำของบดำเนินงานเรียบร้อยแล้ว!",
                            icon: "success",
                            //showCancelButton: true,
                            confirmButtonColor: "rgb(3, 142, 220)",
                            //cancelButtonColor: 'rgb(243, 78, 78)',
                            confirmButtonText: "OK",
                        });
                        this.ngOnInit();
                    } else {
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด!",
                            text: response.RESULT,
                            icon: "warning",
                            confirmButtonColor: "rgb(3, 142, 220)",
                            confirmButtonText: "OK",
                        });
                    }
                });
            }
        });
    }


}






