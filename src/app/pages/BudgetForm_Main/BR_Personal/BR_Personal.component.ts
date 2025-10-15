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
    selector: 'br_personal',
    templateUrl: 'BR_Personal.component.html',
    styleUrls: ['./BR_Personal.component.scss'],
    providers: [GridJsService, DecimalPipe, EbudgetService]
})


export class BR_PersonalComponent implements OnInit {

    // @ViewChild(Salary_FormComponent) salaryForm!: Salary_FormComponent;

    calculatedTotal_Request: string = ''; // ตัวแปรสำหรับเก็บค่าที่รับจาก Salary_FormComponent
    calculatedTotal_Front: string = ''; // ตัวแปรสำหรับเก็บค่าที่ส่งไปยัง Salary_FormComponent

    onCalculatedTotalChange(total: string): void {
        this.calculatedTotal_Request = total; // รับค่าจาก Salary_FormComponent
    }

    //     this.salaryForm.calTotal_item(); // เรียกฟังก์ชันใน Salary_FormComponent 



    // bread crumb items
    breadCrumbItems!: Array<{}>;
    // Table data
    gridjsList$!: Observable<GridJsModel[]>;
    total$: Observable<number>;
    griddata: any;

    totalSize: number = 0;
    Test_Plan_Name: any;
    List_Indications_Template: any = [];
    select_year: any;
    list_year: any = [];
    List_Mas_Balanced_Scorecard: any = [];
    List_Mas_Department: any = []; // ข้อมูลทั้งหมด
    filteredDepartments: any[] = []; // ข้อมูลที่กรองแล้ว
    List_Budget_Request: any = [];
    Tran_list_Budget_req: any = []; // ข้อมูลทั้งหมด
    filteredTranList: any[] = []; // ข้อมูลที่กรองแล้ว

    Budget_Request: any = {}; // item row
    old_Budget_Request: any = []; // ข้อมูลทั้งหมด

    Department_Id: any;
    Permission_Id: any;
    budgetType: any = 1;

    filteredListMasDepartment: any[] = [];
    List_Test: any = [];
    List_Mas_Plan: any = [];
    old_product: any = [];
    old_Activity: any = [];
    old_Mas_Expense_Type: any = [];
    List_Mas_Budget_Type: any = [];
    modal_title: any;
    List_Mas_Expense_Type: any = [];
    old_Mas_Expense_List: any = [];
    Budget_Type_Name: string = '';
    List_Mas_Expense_List: any = [];

    page_run: number = 0;
    formPartial: string = '';
    Form_Id: number = 0;
    List_Mas_Product: any = [];
    List_Mas_Activity: any = [];

    List_Mas_Activity_Dep_Main: any = [];
    List_Mas_Activity_Dep_Second: any = [];
    List_Mas_Activity_Dep_Sub: any = [];
    Filter_List_Mas_Activity_Dep_Second: any = [];
    Filter_List_Mas_Activity_Dep_Sub: any = [];

    Budget_Request_Detail: any = {};
    Budget_Request_Detail_Item: any = {};
    List_Budget_Request_Detail_Item: any = [];
    List_Mas_Expense_Cost_Rate: any = [];
    List_Purpose_Unit: any = [];// ข้อมูลหน่วย


    //Test-Api
    List_EBUDGET_API: any = [];
    Dep_Code: number = 1001;
    BudgetGroup: number = 1;

    Form_Name: string = '';

    Bgyear: any = 0;

    SeqId: string = "";


    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public MasterService: MasterService, public serviceebudget: EbudgetService) {

        this.total$ = service.total$;
        sessionStorage.setItem("Department_Id", "27") //celest
        // sessionStorage.setItem("Permission_Id", "1")
        this.Department_Id = sessionStorage.getItem("Department_Id");
        this.Permission_Id = sessionStorage.getItem("Permission_Id");
        this.Bgyear = sessionStorage.getItem("Bgyear");

    }




    ngOnInit(): void {
        // this.Get_Api_Ebudget(); // เรียกใช้ API Ebudget

        let model = {
            FUNC_CODE: "FUNC-GET_DATA-BR_FORM",
            Fk_Budget_Type: this.budgetType,
            Department_Id: this.Department_Id,
            Permission_Id: this.Permission_Id,
            BgYear: this.Bgyear
        }
        var getData = this.serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            // debugger;
            if (response.RESULT == null) {
                this.old_Budget_Request = JSON.parse(JSON.stringify(response.Budget_Request));
                this.List_Mas_Department = response.List_Mas_Department;
                this.List_Budget_Request = response.List_Budget_Request;
                this.List_Mas_Plan = response.List_Mas_Plan;

                this.old_product = response.List_Mas_Product;
                this.old_Activity = response.List_Mas_Activity;


                this.List_Mas_Activity_Dep_Main = response.List_Mas_Activity_Dep_Main;
                this.Filter_List_Mas_Activity_Dep_Second = response.List_Mas_Activity_Dep_Second;
                this.Filter_List_Mas_Activity_Dep_Sub = response.List_Mas_Activity_Dep_Sub;



                this.List_Mas_Budget_Type = response.List_Mas_Budget_Type;
                // $scope.FULL_MODEL.List_Mas_Budget_Type = datas.data.List_Mas_Budget_Type;
                this.old_Mas_Expense_Type = response.List_Mas_Expense_Type;
                this.old_Mas_Expense_List = response.List_Mas_Expense_List;

                this.List_Purpose_Unit = response.List_Mas_Unit;

                this.Department_Id = response.Department_Id;

                if (this.List_Budget_Request.length > 0) {
                    const wantGroup: string[] = ['Plan_Name', 'Product_Name', 'Activity_Name']; 1
                    const groupedBudget: Record<string, any> = this.MasterService.groupByMultipleKeys(
                        this.List_Budget_Request,
                        wantGroup
                    )
                    this.Tran_list_Budget_req = this.MasterService.transformGroupedData(groupedBudget);
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


    // onSearchTermChange(): void { //ใช้วิธีนี้ก็ได้ แต่ต้องเขียนเยอะ
    //     const searchTerm = this.service.searchTerm.toLowerCase(); // แปลงคำค้นหาเป็นตัวพิมพ์เล็ก
    //     debugger;
    //     this.filteredTranList = this.Tran_list_Budget_req.filter((item: { Plan_Name: string; Product_Name: string; Activity_Name: String; Budget_Type: String; Expense_Type: String; Expense_List: String; }) =>
    //         (item.Plan_Name?.toLowerCase() || '').includes(searchTerm) ||
    //         (item.Product_Name?.toLowerCase() || '').includes(searchTerm) ||
    //         (item.Activity_Name?.toLowerCase() || '').includes(searchTerm) ||
    //         (item.Budget_Type?.toLowerCase() || '').includes(searchTerm) ||
    //         (item.Expense_Type?.toLowerCase() || '').includes(searchTerm) ||
    //         (item.Expense_List?.toLowerCase() || '').includes(searchTerm)
    //     );
    // }

    onFilter(term: string): void { //ใช้อันนี้ในการ Filter Talbe List
        const lowerTerm = term.toLowerCase(); // แปลงคำค้นหาเป็นตัวพิมพ์เล็ก
        debugger;
        this.filteredTranList = this.Tran_list_Budget_req.filter((item: any) => {

            // ตรวจสอบทุกฟิลด์ใน item
            return Object.values(item).some((value: any) => {
                if (value && typeof value === 'string') {
                    return value.toLowerCase().includes(lowerTerm); // กรองเฉพาะฟิลด์ที่เป็น string
                }
                if (value && typeof value === 'number') {
                    return value.toString().includes(lowerTerm); // กรองฟิลด์ที่เป็นตัวเลข
                }
                return false;
            });
        });
    }

    //เรียงข้อมูล จากน้อยไปมาก
    onSort(column: any) {
        debugger;
        this.filteredTranList = this.sortService.onSort(column, this.filteredTranList)
    }

    get_main_Data() {
        let model = {
            FUNC_CODE: "FUNC-GET_DATA-BR_FORM",
            Fk_Budget_Type: this.budgetType,
            Department_Id: this.Department_Id,
            Permission_Id: this.Permission_Id
            //BgYear: this.select_year
        }
        var getData = this.serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            debugger;
            if (response.RESULT == null) {
                this.List_Mas_Department = response.List_Mas_Department;
                this.List_Budget_Request = response.List_Budget_Request;

                if (this.List_Budget_Request.length > 0) {
                    const wantGroup: string[] = ['Plan_Name', 'Product_Name', 'Activity_Name']; 1
                    const groupedBudget: Record<string, any> = this.MasterService.groupByMultipleKeys(
                        this.List_Budget_Request,
                        wantGroup
                    )
                    this.Tran_list_Budget_req = this.MasterService.transformGroupedData(groupedBudget);
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





    Get_Api_Ebudget_Old() {

        const value1 = "APP_FINANCIAL";
        const value2 = "UEBzc3cwcmQ=";
        const body = {
            "fiscalYear": 2025,
            "depCode": "1001",
            "planCode": "",
            "produceCode": "",
            "activityCode": "",
            "budgetTypeCode": "",
            "expenseGroupCode": "",
            "expenseCode": "",
            "budgetSource": "",
            "budgetGroup": "1",
            "Project_Type": ""
        };

        let getData = this.serviceebudget.get_ebudget_api();

        getData.subscribe((response: any) => {
            debugger;

            this.SeqId = response.data[0].SeqId;
        });




    }

    //Test เรียกใช้ API Ebudget
    Get_Api_Ebudget() {
        debugger;
        let model = {
            FUNC_CODE: "FUNC-GET_EBUDGET_API",
            Bgyear: this.Bgyear,
            Dep_Code: this.Dep_Code,
            BudgetGroup: this.BudgetGroup,
        }

        var getData = this.serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            debugger;
            if (response.RESULT == null) {
                this.List_EBUDGET_API = response.List_EBUDGET_API;
                let ActivityName = response.List_EBUDGET_API[0].ActivityName;
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




    //เซฟข้อมูล BR_Personal
    btn_save() {
        debugger;
        this.Budget_Request.BgYear = this.Bgyear;
        this.Budget_Request.Department_Id = this.Department_Id;
        var depart_item = this.List_Mas_Department.filter((item: any) => item.Department_Id == this.Department_Id);
        this.Budget_Request.Department_Name = depart_item[0].Department_Name;

        if (this.Budget_Request.Fk_Plan_Id == null || this.Budget_Request.Fk_Plan_Id == undefined || this.Budget_Request.Fk_Plan_Id == 0) {
            Swal.fire({
                title: 'รายการคำของบ',
                text: 'กรุณาเลือก : แผนงาน',
                icon: 'error',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
            return;
        } else if (this.Budget_Request.Fk_Product_Id == null || this.Budget_Request.Fk_Product_Id == undefined || this.Budget_Request.Fk_Product_Id == 0) {
            Swal.fire({
                title: 'รายการคำของบ',
                text: 'กรุณาเลือก : ผลผลิต',
                icon: 'error',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
            return;
        } else if (this.Budget_Request.Fk_Activity_Id == null || this.Budget_Request.Fk_Activity_Id == undefined || this.Budget_Request.Fk_Activity_Id == 0) {
            Swal.fire({
                title: 'รายการคำของบ',
                text: 'กรุณาเลือก : กิจกรรม',
                icon: 'error',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
            return;
        } else if (this.Budget_Request.Purpose_Name == null || this.Budget_Request.Purpose_Name == undefined || this.Budget_Request.Purpose_Name == "") {
            Swal.fire({
                title: 'รายการคำของบ',
                text: 'กรุณากรอก : เป้าหมาย',
                icon: 'error',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
            return;
        } else if (this.Budget_Request.Purpose_Unit_Id == null || this.Budget_Request.Purpose_Unit_Id == undefined || this.Budget_Request.Purpose_Unit_Id == 0) {
            Swal.fire({
                title: 'รายการคำของบ',
                text: 'กรุณาเลือก : หน่วยนับเป้าหมาย',
                icon: 'error',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
            return;
        }
        else {
            let model = {
                FUNC_CODE: "FUNC-SAVE_DATA-SUB_FORM",
                Budget_Request: this.Budget_Request,
                Budget_Request_Detail: this.Budget_Request_Detail,
                List_Budget_Request_Detail_Item: this.List_Budget_Request_Detail_Item,
                // AUTHEN_INFORMATION: $scope.FULL_MODEL.AUTHEN_INFORMATION

            }
            //console.log(model);
            let getData = this.serviceebudget.GatewayGetData(model);
            getData.subscribe((response: any) => {
                //debugger;
                if (response.RESULT == null) {
                    Swal.fire({
                        title: 'บันทึกสำเร็จ!',
                        text: 'บันทึกรายการคำของบดำเนินงานเรียบร้อยแล้ว!',
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
    }



    numberWithCommas(num: string): string {
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    show_fix(num: number): string {
        num = num || 0; // Default to 0 if num is null or undefined
        return this.numberWithCommas(num.toFixed(2));
    }







    //ตัวอย่างการ นำข้อมูลจาก List ไปใส่ใน List ใหม่
    addTemplateDev(): void {
        //let mock = structuredClone(this.Indications_Template_Development);
        //this.List_Indications_Template_Development.push(mock);
    }

    /**
    * Open small modal
    * @param smallDataModal small modal data
    */
    //คำสั่งเปิด Modal
    btn_add_fullModal(smallDataModal: any, ida: number, it_off: any) {
        debugger;
        this.modalService.open(smallDataModal, { size: 'fullscreen', windowClass: 'modal-holder' });
        if (this.budgetType != null && this.budgetType != undefined && this.budgetType !== "") {
            this.budgetType = parseInt(this.budgetType);
        }

        let bd_type = this.List_Mas_Budget_Type.filter((item: any) => item.Budget_Type_Id == this.budgetType);

        this.Budget_Request.Fk_Budget_Type = this.budgetType;
        this.Budget_Request.Budget_Type = bd_type[0].Budget_Type_Name;

        if (ida == 0) { // เพิ่มข้อมูลใหม่
            this.modal_title = "เพิ่มคำของบดำเนินงาน";
            this.Budget_Request = JSON.parse(JSON.stringify(it_off));
            this.Budget_Request.Fk_Budget_Type = this.budgetType;
            this.Budget_Request.Budget_Type = bd_type[0].Budget_Type_Name;

            this.List_Budget_Request_Detail_Item = []; // ล้างข้อมูลเก่า
            this.calculatedTotal_Front = ''; // รีเซ็ตค่า
            this.choose_budget_Type();
        } else { // แก้ไขข้อมูล
            this.modal_title = "แก้ไขคำของบดำเนินงาน";
            this.Budget_Request = JSON.parse(JSON.stringify(it_off));
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

    choose_plan() {
        const plan_id = this.Budget_Request.Fk_Plan_Id;
        const plan_item = this.List_Mas_Plan.filter((item: any) => item.Plan_Id == plan_id);
        this.Budget_Request.Plan_Name = plan_item[0].Plan_Name;

        this.List_Mas_Product = this.old_product.filter((item: any) => item.Fk_Plan_Id == plan_id);

    }

    choose_product() {
        const fk_pro_id = this.Budget_Request.Fk_Product_Id
        const pro_item = this.List_Mas_Product.filter((item: any) => item.Product_Id == fk_pro_id);
        this.Budget_Request.Product_Name = pro_item[0].Product_Name;

        this.List_Mas_Activity = this.old_Activity.filter((item: any) => item.Fk_Product_Id == this.Budget_Request.Fk_Product_Id);
        //$scope.FULL_MODEL.Budget_Request.Fk_Activity_Id = 0;
        //$scope.FULL_MODEL.Budget_Request.Activity_Name = null;
    }


    choose_activity() {
        const act_id = this.Budget_Request.Fk_Activity_Id;
        const act_item = this.List_Mas_Activity.filter((item: any) => item.Activity_Id == act_id);
        if (act_item.length > 0) {
            this.Budget_Request.Activity_Name = act_item[0].Activity_Name;
        }
    }

    choose_activity_dep_main() {
        const Activity_Dep_Id = this.Budget_Request.Activity_Dep_Id;
        if (Activity_Dep_Id != null && Activity_Dep_Id != undefined && Activity_Dep_Id != 0) {
            const list_mas = this.List_Mas_Activity_Dep_Main.filter((item: any) => item.Activity_Dep_Id == Activity_Dep_Id);
            this.Budget_Request.Activity_Dep_Name = list_mas[0].Activity_Name;

            this.List_Mas_Activity_Dep_Second = this.Filter_List_Mas_Activity_Dep_Second.filter((item: any) => item.Fk_Activity_Dep_Id == Activity_Dep_Id);
        }
    }

    choose_activity_dep_second() {
        const Activity_Dep_Second_Id = this.Budget_Request.Activity_Dep_Second_Id;
        if (Activity_Dep_Second_Id != null && Activity_Dep_Second_Id != undefined && Activity_Dep_Second_Id != 0) {
            const list_mas = this.List_Mas_Activity_Dep_Second.filter((item: any) => item.Activity_Dep_Second_Id == Activity_Dep_Second_Id);
            this.Budget_Request.Activity_Dep_Second_Name = list_mas[0].Activity_Name;

            this.List_Mas_Activity_Dep_Sub = this.Filter_List_Mas_Activity_Dep_Sub.filter((item: any) => item.Fk_Activity_Dep_Second_Id == Activity_Dep_Second_Id);
        }

    }

    choose_activity_dep_sub() {
        const Activity_Dep_Sub_Id = this.Budget_Request.Activity_Dep_Sub_Id;
        if (Activity_Dep_Sub_Id != null && Activity_Dep_Sub_Id != undefined && Activity_Dep_Sub_Id != 0) {
            const list_mas = this.List_Mas_Activity_Dep_Sub.filter((item: any) => item.Activity_Dep_Sub_Id == Activity_Dep_Sub_Id);
            this.Budget_Request.Activity_Dep_Sub_Name = list_mas[0].Activity_Name;
        }
    }

    choose_purpost_unit() {
        const Purpose_Unit_Id = this.Budget_Request.Purpose_Unit_Id;
        const List_item = this.List_Purpose_Unit.filter((item: any) => item.Unit_Id == Purpose_Unit_Id);
        if (List_item.length > 0) {
            this.Budget_Request.Purpose_Unit_Name = List_item[0].Unit_Name;
        }
    }


    // 
    choose_budget_Type() {
        const budId = this.Budget_Request.Fk_Budget_Type;
        this.List_Mas_Expense_Type = this.old_Mas_Expense_Type.filter(
            (item: any) => item.Fk_Budget_Type_Id === budId
        );
    }

    choose_Expense_Type() {


        const exType_id = this.Budget_Request.Fk_Expense_Type;
        const exType_item = this.List_Mas_Expense_Type.filter((item: any) => item.Expense_Type_Id == exType_id);

        this.Budget_Request.Expense_Type = exType_item[0].Expense_Type_Name;

        this.List_Mas_Expense_List = this.old_Mas_Expense_List.filter((item: any) => item.Fk_Expense_Type_Id == this.Budget_Request.Fk_Expense_Type);
    }

    async choose_form(): Promise<void> {

        this.page_run += 1;

        const formC = this.List_Mas_Expense_List.filter((item: any) => item.Expense_Id == this.Budget_Request.Fk_Expense_List);

        if (formC.length > 0) {
            this.Budget_Request.Expense_List = formC[0].Expense_Name;

            const FormName = formC[0].FormName;
            const Expense_Name = formC[0].Expense_Name;
            this.formPartial = FormName;
            await this.get_detail();
            this.Form_Name = Expense_Name;

            // Save the selected form ID
            this.Form_Id = this.Budget_Request.Fk_Expense_List;
        } else {
            console.error('No matching form found for the selected Expense_List.');
        }
    }


    calTotal_item_type_edit(): string {
        debugger
        var total = 0;
        var len_item = this.List_Budget_Request_Detail_Item.length;
        for (var i = 0; i < len_item; i++) {
            total = total + (this.List_Budget_Request_Detail_Item[i].Total || 0);
        }
        this.Budget_Request.Total = total; // อัปเดตค่า Total ใน Budget_Request
        this.calculatedTotal_Request = this.show_fix(total); // อัปเดตค่า calculatedTotal
        this.calculatedTotal_Front = this.show_fix(total); // อัปเดตค่า calculatedTotal

        // this.calculatedTotalChange.emit(this.calculatedTotal); // ส่งค่าไปยัง Component แม่
        // this.cdr.detectChanges(); // แจ้ง Angular ให้ตรวจสอบการเปลี่ยนแปลง

        // return this.show_fix(total); // แสดงผลรวมในรูปแบบที่จัดการแล้ว

        return this.calculatedTotal_Front;
    }


    get_detail() {

        let model = {
            FUNC_CODE: 'FUNC-GET_DATA-BR_PERSONAL_FORM',
            Budget_Request: this.Budget_Request,
            TYPE_IDA: this.Budget_Request.Fk_Expense_List
        }
        var getData = this.serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {

            if (response.RESULT == null) {
                this.List_Mas_Department = response.List_Mas_Department;
                this.List_Budget_Request = response.List_Budget_Request;

                this.Budget_Request_Detail = response.Budget_Request_Detail;
                this.Budget_Request_Detail_Item = response.Budget_Request_Detail_Item;
                this.List_Budget_Request_Detail_Item = response.List_Budget_Request_Detail_Item;

                if (this.List_Budget_Request_Detail_Item.length > 0) {
                    this.calTotal_item_type_edit();
                }

                this.List_Mas_Expense_Cost_Rate = response.List_Mas_Expense_Cost_Rate;
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



    //ปิด Modal  
    close_modal() {
        const modalButton = document.getElementById("cdFullmodal") as HTMLButtonElement;
        if (modalButton) {
            modalButton.click();
        }
    }

    //ตัวอย่างการ ลบข้อมูล
    delExam(Exam: any) {

        Swal.fire({
            title: 'ลบข้อมูล?',
            text: 'คุณต้องการลบข้อมูลใช่หรือไม่!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(3, 142, 220)',
            cancelButtonColor: 'rgb(243, 78, 78)',
            confirmButtonText: 'ต้องการ!',
            cancelButtonText: 'ยกเลิก'
        }).then(result => {
            if (result.value) {
                let model = {
                    FUNC_CODE: "FUNC-DELETE_DATA-GROUP_EXAM",
                    Group_Exam: Exam
                }
                var getData = this.serviceebudget.GatewayGetData(model);
                getData.subscribe((response: any) => {
                    //debugger;
                    if (response.RESULT == null) {
                        //this.List_Group_Exam = response.List_Group_Exam;
                        Swal.fire({
                            title: 'ลบสำเร็จ!',
                            text: 'ลบข้อมูลชุดข้อสอบเรียบร้อย!',
                            icon: 'success',
                            showCancelButton: true,
                            confirmButtonColor: 'rgb(3, 142, 220)',
                            //cancelButtonColor: 'rgb(243, 78, 78)',
                            confirmButtonText: 'OK'
                        });

                    } else {
                        Swal.fire({
                            title: 'เกิดข้อผิดพลาด!',
                            text: response.RESULT,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: 'rgb(3, 142, 220)',
                            // cancelButtonColor: 'rgb(243, 78, 78)',
                            confirmButtonText: 'OK'
                        });

                    }
                });
            }
        });


    }


}






