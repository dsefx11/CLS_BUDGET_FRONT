import {
    Component,
    ElementRef,
    ViewChild,
    ViewContainerRef,
    ComponentFactoryResolver,
    CUSTOM_ELEMENTS_SCHEMA,
    OnInit,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import {
    FormGroup,
    FormBuilder,
    FormArray,
    FormControl,
    FormControlName,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GridJsService } from "../../tables/gridjs/gridjs.service";
import { PaginationService } from "src/app/core/services/pagination.service";
import { GridJsModel } from "../../tables/gridjs/gridjs.model";
import { DecimalPipe } from "@angular/common";
import { get } from "lodash";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/services/master.service";
import { EbudgetService } from "src/app/core/services/ebudget.service";
import { e } from "mathjs";
// import { Salary_FormComponent } from '../form_personal/Salary_Form.component';
import { act } from "@ngrx/effects";
import { dE } from "@fullcalendar/core/internal-common";

@Component({
    selector: "br_operate",
    templateUrl: "./BR_Operate.component.html",
    styleUrls: ["./BR_Operate.component.scss"],
    providers: [MasterService, GridJsService, DecimalPipe, EbudgetService],
})
export class BR_OperateComponent implements OnInit {
    // @ViewChild(Rent_HomeComponent) salaryForm!: Rent_HomeComponent;

    calculatedTotal_Request: string = ""; // ตัวแปรสำหรับเก็บค่าที่รับจาก Rent_HomeComponent
    calculatedTotal_Front: string = ""; // ตัวแปรสำหรับเก็บค่าที่ส่งไปยัง Child component ของปุ่ม แก้ไข




    //     this.salaryForm.calTotal_item(); // เรียกฟังก์ชันใน Rent_HomeComponent

    // bread crumb items
    breadCrumbItems!: Array<{}>;
    // Table data
    gridjsList$!: Observable<GridJsModel[]>;
    total$: Observable<number>;
    griddata: any;

    totalSize: number = 0;

    Department_Id: any;
    Permission_Id: any;
    budgetType: any = 2; // ประเภทคำของบดำเนินงาน

    page_run: number = 0;
    formPartial: string = "";
    Form_Id: number = 0;
    Form_Name: string = "";
    Expense_Id: number = 0;
    Expense_Type_Id: number = 0; // หมวดค่าใช้จ่าย

    Fix_Mat_Price: number = 0; // ราคา

    Bgyear: any = 0;

    modal_title: any;

    add: any; // เพิ่มข้อมูล

    List_Mas_Department: any = []; // รายชื่อหน่วยงาน
    List_Mas_Budget_Type: any = []; // ประเภทงบประมาณ
    old_Mas_Expense_List: any = []; // รายการค่าใช้จ่าย

    Budget_Request: any = {}; // คำของบดำเนินงาน
    old_Budget_Request: any = []; // ข้อมูลทั้งหมด
    old_Mas_Expense_Type: any = []; // ประเภทค่าใช้จ่าย
    List_Budget_Request: any = []; // รายการคำของบดำเนินงาน
    List_Mas_Plan: any = []; // แผนงาน
    List_Mas_Product: any = []; // ผลิตภัณฑ์
    List_Mas_Activity: any = []; // กิจกรรม
    List_Mas_Expense_List: any = []; // รายการค่าใช้จ่าย
    List_Mas_Expense_Type: any = []; // ประเภทค่าใช้จ่าย
    old_product: any = []; // ข้อมูลทั้งหมด แผน
    old_Activity: any = []; // ข้อมูลทั้งหมด กิจกรรม

    List_Mas_Activity_Dep_Main: any = []; // กิจกรรมหน่วยหลัก
    List_Mas_Activity_Dep_Second: any = []; // กิจกรรมหน่วยรอง
    List_Mas_Activity_Dep_Sub: any = []; // กิจกรรมหน่วยย่อย
    Filter_List_Mas_Activity_Dep_Second: any = [];
    Filter_List_Mas_Activity_Dep_Sub: any = [];

    List_Purpose_Unit: any = []; // หน่วยนับเป้าหมาย

    Tran_list_Budget_req: any = []; // ข้อมูลทั้งหมด
    filteredTranList: any[] = []; // ข้อมูลที่กรองแล้ว
    List_Budget_Request_Detail_Item: any = []; // รายการคำของบดำเนินงาน
    Budget_Request_Detail: any = {}; // รายการคำของบดำเนินงาน
    Budget_Request_Detail_Item: any = {}; // รายการคำของบดำเนินงาน
    List_Mas_Position: any = []; // ตำแหน่ง
    List_Mas_Position_Type: any = []; // ประเภทตำแหน่ง
    List_Mas_Expense_Cost_Rate: any = []; // อัตราค่าตอบแทน
    List_Filter_Mas_Expense_Cost_Rate: any = []; // อัตราค่าตอบแทน
    List_Budget_Request_Detail_Upload_File: any = []; // อัพโหลดไฟล์
    uploadedFiles: any = []; // เก็บไฟล์ที่อัพโหลด
    // Filtered_Upload_Files: any = []; // เก็บไฟล์ที่อัพโหลดที่กรองแล้ว
    List_Mas_Unit: any = []; // หน่วยนับ
    List_Type_Pay: any = []; // ประเภทการจ่ายเงิน
    List_Mas_Expense_Material_List: any = []; // รายการวัสดุ
    Filter_List_Mas_Expense_Material_List: any = []; // รายการวัสดุ
    List_Mas_Po_Type: any = []; // ประเภทการจ่ายเงิน  
    List_Mas_Business_Level: any = []; // ระดับการจ่ายเงิน

    uploadedFiles1: any = []; // เก็บไฟล์ที่อัพโหลด

    List_All: any = []; // เพิ่มข้อมูลแบบ Form Multi

    constructor(
        private modalService: NgbModal,
        public service: GridJsService,
        private sortService: PaginationService,
        public Serviceebudget: EbudgetService,
        public MasterService: MasterService
    ) {
        this.total$ = service.total$;
        sessionStorage.setItem("Department_Id", "27") //celest
        // sessionStorage.setItem("Permission_Id", "1")
        this.Department_Id = sessionStorage.getItem("Department_Id");
        this.Permission_Id = sessionStorage.getItem("Permission_Id");
        this.Bgyear = sessionStorage.getItem("Bgyear");
    }

    // รับค่า Total จาก Child component
    onCalculatedTotalChange(total: string): void {
        this.calculatedTotal_Request = this.MasterService.show_fix(parseInt(total)); // รับค่าจาก Rent_HomeComponent
        this.Budget_Request.Total = total; // อัปเดตค่า Total ใน Budget_Request ส่งไปเซฟ
    }

    //รับ Upload File จาก Child component
    onUploadFileChange1(file: []): void { //รับ Upload File จาก Child component
        this.uploadedFiles1 = file; // เก็บไฟล์ที่อัพโหลด แนบไฟล์ใบเสนอราคา
    }

    check_budgettype_menu() {
        var path_name = window.location.pathname;
        var sp_path = path_name.split("/");
        var len_path = sp_path.length;
        var ac_name = sp_path[len_path - 1];
        if (ac_name == "BR_Personal") {
            this.budgetType = 1;
        } else if (ac_name == "BR_Operate") {
            this.budgetType = 2;
        } else if (ac_name == "BR_Invest") {
            this.budgetType = 3;
        } else if (ac_name == "BR_Subsidy") {
            this.budgetType = 4;
        } else if (ac_name == "BR_Invest_Other") {
            this.budgetType = 5;
        } else {
            this.budgetType = 2;
        }
    }

    ngOnInit(): void {
        // debugger;
        this.check_budgettype_menu();

        let model = {
            FUNC_CODE: "FUNC-GET_DATA-BR_FORM",
            Fk_Budget_Type: this.budgetType,
            Department_Id: this.Department_Id,
            Permission_Id: this.Permission_Id,
            BgYear: this.Bgyear,
        };
        var getData = this.Serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            // debugger;
            if (response.RESULT == null) {
                this.old_Budget_Request = JSON.parse(
                    JSON.stringify(response.Budget_Request)
                );
                this.List_Mas_Department = response.List_Mas_Department;
                this.List_Budget_Request = response.List_Budget_Request;
                this.List_Mas_Plan = response.List_Mas_Plan;

                this.old_product = response.List_Mas_Product;
                this.old_Activity = response.List_Mas_Activity;

                this.List_Mas_Activity_Dep_Main = response.List_Mas_Activity_Dep_Main;
                this.Filter_List_Mas_Activity_Dep_Second = response.List_Mas_Activity_Dep_Second;
                this.Filter_List_Mas_Activity_Dep_Sub = response.List_Mas_Activity_Dep_Sub;

                this.List_Mas_Budget_Type = response.List_Mas_Budget_Type;
                this.old_Mas_Expense_Type = response.List_Mas_Expense_Type;
                this.old_Mas_Expense_List = response.List_Mas_Expense_List;

                this.List_Mas_Expense_Material_List =
                    response.List_Mas_Expense_Material_List; // รายการวัสดุ
                this.Filter_List_Mas_Expense_Material_List =
                    response.List_Mas_Expense_Material_List; // รายการวัสดุ

                this.List_Purpose_Unit = response.List_Mas_Unit; // หน่วยนับเป้าหมาย

                this.Department_Id = response.Department_Id;

                if (this.List_Budget_Request.length > 0) {
                    const wantGroup: string[] = [
                        "Plan_Name",
                        "Product_Name",
                        "Activity_Name",
                    ];
                    1;
                    const groupedBudget: Record<string, any> =
                        this.MasterService.groupByMultipleKeys(
                            this.List_Budget_Request,
                            wantGroup
                        );
                    this.Tran_list_Budget_req =
                        this.MasterService.transformGroupedData(groupedBudget);
                    // เริ่มต้นให้ filteredTranList มีค่าทั้งหมดของ Tran_list_Budget_req
                    this.filteredTranList = this.Tran_list_Budget_req;
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

    onFilter(term: string): void {
        //ใช้อันนี้ในการ Filter Talbe List
        const lowerTerm = term.toLowerCase(); // แปลงคำค้นหาเป็นตัวพิมพ์เล็ก
        debugger;
        this.filteredTranList = this.Tran_list_Budget_req.filter((item: any) => {
            // ตรวจสอบทุกฟิลด์ใน item
            return Object.values(item).some((value: any) => {
                if (value && typeof value === "string") {
                    return value.toLowerCase().includes(lowerTerm); // กรองเฉพาะฟิลด์ที่เป็น string
                }
                if (value && typeof value === "number") {
                    return value.toString().includes(lowerTerm); // กรองฟิลด์ที่เป็นตัวเลข
                }
                return false;
            });
        });
    }

    //เรียงข้อมูล จากน้อยไปมาก
    onSort(column: any) {
        // debugger;
        this.filteredTranList = this.sortService.onSort(
            column,
            this.filteredTranList
        );
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
                this.old_Budget_Request = JSON.parse(
                    JSON.stringify(response.Budget_Request)
                );
                this.List_Mas_Department = response.List_Mas_Department;
                this.List_Budget_Request = response.List_Budget_Request;
                this.List_Mas_Plan = response.List_Mas_Plan;

                this.old_product = response.List_Mas_Product;
                this.old_Activity = response.List_Mas_Activity;

                this.List_Mas_Budget_Type = response.List_Mas_Budget_Type;
                this.old_Mas_Expense_Type = response.List_Mas_Expense_Type;
                this.old_Mas_Expense_List = response.List_Mas_Expense_List;

                this.Department_Id = response.Department_Id;

                if (this.List_Budget_Request.length > 0) {
                    const wantGroup: string[] = [
                        "Plan_Name",
                        "Product_Name",
                        "Activity_Name",
                    ];
                    1;
                    const groupedBudget: Record<string, any> =
                        this.MasterService.groupByMultipleKeys(
                            this.List_Budget_Request,
                            wantGroup
                        );
                    this.Tran_list_Budget_req =
                        this.MasterService.transformGroupedData(groupedBudget);
                    // เริ่มต้นให้ filteredTranList มีค่าทั้งหมดของ Tran_list_Budget_req
                    this.filteredTranList = this.Tran_list_Budget_req;
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

    // เมื่อกดปุ่ม "แก้ไข"
    calTotal_item_type_edit(): string {
        // debugger
        let total = 0;
        const len_item = this.List_Budget_Request_Detail_Item.length;
        for (var i = 0; i < len_item; i++) {
            if (this.Form_Id == 14) {
                //ค่าเช่าบ้าน
                total =
                    total + (this.List_Budget_Request_Detail_Item[i].Rent_Per_Year || 0);
            } else if (this.Form_Id == 17) {
                //เงินตอบแทนรถประจำตำแหน่ง
                total =
                    total + (this.List_Budget_Request_Detail_Item[i].Rent_Per_Year || 0);
            } else if (this.Form_Id == 18) {
                total =
                    total + (this.List_Budget_Request_Detail_Item[i].Risk_Per_Year || 0);
            } else {
                total = total + (this.List_Budget_Request_Detail_Item[i].Total || 0);
            }
        }
        this.Budget_Request.Total = total; // อัปเดตค่า Total ใน Budget_Request
        this.calculatedTotal_Request = this.MasterService.show_fix(total); // อัปเดตค่า calculatedTotal
        this.calculatedTotal_Front = this.MasterService.show_fix(total); // อัปเดตค่า calculatedTotal

        return this.calculatedTotal_Front;
    }

    /**
     * Open small modal
     * @param smallDataModal small modal data
     */
    //คำสั่งเปิด Modal
    btn_add_fullModal(smallDataModal: any, ida: number, it_off: any) {
        // debugger;
        this.modalService.open(smallDataModal, {
            size: "fullscreen",
            windowClass: "modal-holder",
        });
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

        this.Budget_Request.Fk_Budget_Type = this.budgetType;
        this.Budget_Request.Budget_Type = bd_type[0].Budget_Type_Name;

        if (ida == 0) {
            // เพิ่มข้อมูลใหม่
            this.add = "new";

            this.modal_title = "เพิ่มคำของบดำเนินงาน";
            this.Budget_Request = JSON.parse(JSON.stringify(it_off));
            this.Budget_Request.Fk_Budget_Type = this.budgetType;
            this.Budget_Request.Budget_Type = bd_type[0].Budget_Type_Name;

            this.List_Budget_Request_Detail_Item = []; // ล้างข้อมูลเก่า
            this.calculatedTotal_Front = ""; // รีเซ็ตค่า
            this.choose_budget_Type();
        } else {
            // แก้ไขข้อมูล
            this.add = "edit";

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
        const plan_item = this.List_Mas_Plan.filter(
            (item: any) => item.Plan_Id == plan_id
        );
        this.Budget_Request.Plan_Name = plan_item[0].Plan_Name;

        this.List_Mas_Product = this.old_product.filter(
            (item: any) => item.Fk_Plan_Id == plan_id
        );

        if (this.add == "new") {
            this.Budget_Request.Fk_Product_Id = "";
            this.Budget_Request.Fk_Activity_Id = "";
        }
    }

    choose_product() {
        const fk_pro_id = this.Budget_Request.Fk_Product_Id;
        const pro_item = this.List_Mas_Product.filter(
            (item: any) => item.Product_Id == fk_pro_id
        );
        this.Budget_Request.Product_Name = pro_item[0].Product_Name;

        this.List_Mas_Activity = this.old_Activity.filter(
            (item: any) => item.Fk_Product_Id == this.Budget_Request.Fk_Product_Id
        );

        if (this.add == "new") {
            this.Budget_Request.Fk_Activity_Id = "";
        }
    }

    choose_activity() {
        const act_id = this.Budget_Request.Fk_Activity_Id;
        const act_item = this.List_Mas_Activity.filter(
            (item: any) => item.Activity_Id == act_id
        );
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

    async choose_form(): Promise<void> {
        this.List_Mas_Expense_Material_List =
            this.Filter_List_Mas_Expense_Material_List.filter(
                (item: any) =>
                    item.Fk_Expense_List_Id == this.Budget_Request.Fk_Expense_List
            ); //filter ค่าใช้สอย;
        try {
            this.Fix_Mat_Price =
                this.List_Mas_Expense_Material_List[0].Material_Price; //เอาไปใช้หน้า Sub
        } catch (err) {
            this.Fix_Mat_Price = 0; //เอาไปใช้หน้า Sub
        }

        this.page_run += 1;

        const formC = this.List_Mas_Expense_List.filter(
            (item: any) => item.Expense_Id == this.Budget_Request.Fk_Expense_List
        );

        if (formC.length > 0) {
            this.Budget_Request.Expense_List = formC[0].Expense_Name;

            const FormName = formC[0].FormName;
            const Expense_Name = formC[0].Expense_Name;
            this.formPartial = FormName;
            await this.get_detail();
            this.Form_Name = Expense_Name;
            this.Expense_Type_Id = formC[0].Fk_Expense_Type_Id; // หมวดค่าใช้จ่าย

            // Save the selected form ID
            this.Form_Id = this.Budget_Request.Fk_Expense_List;
        } else {
            console.error("No matching form found for the selected Expense_List.");
        }
    }

    choose_budget_Type() {
        const budId = this.Budget_Request.Fk_Budget_Type;
        this.List_Mas_Expense_Type = this.old_Mas_Expense_Type.filter(
            (item: any) => item.Fk_Budget_Type_Id === budId
        );
    }

    choose_Expense_Type() {
        const exType_id = this.Budget_Request.Fk_Expense_Type;
        const exType_item = this.List_Mas_Expense_Type.filter(
            (item: any) => item.Expense_Type_Id == exType_id
        );

        this.Budget_Request.Expense_Type = exType_item[0].Expense_Type_Name;

        this.List_Mas_Expense_List = this.old_Mas_Expense_List.filter(
            (item: any) =>
                item.Fk_Expense_Type_Id == this.Budget_Request.Fk_Expense_Type
        );
    }

    get_detail() {
        let model = {
            FUNC_CODE: "FUNC-GET_DATA-BR_OPERATE_FORM",
            Budget_Request: this.Budget_Request,
            TYPE_IDA: this.Budget_Request.Fk_Expense_List,
        };
        var getData = this.Serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            if (response.RESULT == null) {
                this.List_Mas_Department = response.List_Mas_Department;
                this.List_Budget_Request = response.List_Budget_Request;

                this.Budget_Request_Detail = response.Budget_Request_Detail;
                this.Budget_Request_Detail_Item = response.Budget_Request_Detail_Item;
                this.List_Budget_Request_Detail_Item =
                    response.List_Budget_Request_Detail_Item;

                this.List_Budget_Request_Detail_Upload_File =
                    response.List_Budget_Request_Detail_Upload_File;

                // Map ไฟล์แนบไปแต่ละ row
                this.List_Budget_Request_Detail_Item.forEach((data: any) => {
                    data.uploadedFiles1 = this.List_Budget_Request_Detail_Upload_File.filter(
                        (file: any) => file.Fk_Request_Item_Id === data.Request_Item_Id
                    );
                });

                this.List_All = response.List_All; //เพิ่มข้อมูลแบบ Form Multi

                if (this.List_Budget_Request_Detail_Item.length > 0) {
                    this.calTotal_item_type_edit();
                }

                this.List_Mas_Position = response.List_Mas_Position; // ตำแหน่ง
                this.List_Mas_Position_Type = response.List_Mas_Position_Type; // ประเภทตำแหน่ง
                this.List_Mas_Expense_Cost_Rate = response.List_Mas_Expense_Cost_Rate; // อัตราค่าตอบแทน
                this.List_Filter_Mas_Expense_Cost_Rate = response.List_Mas_Expense_Cost_Rate; // อัตราค่าตอบแทน

                this.List_Mas_Unit = response.List_Mas_Unit; // หน่วยนับ
                this.List_Mas_Po_Type = response.List_Mas_Po_Type; // ประเภทการจ่ายเงิน
                this.List_Mas_Business_Level = response.List_Mas_Business_Level; // ระดับการจ่ายเงิน

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

    getFilteredUploadFiles(requestItemId: number) {
        if (this.List_Budget_Request_Detail_Upload_File.length > 0) {
            return this.List_Budget_Request_Detail_Upload_File.filter(
                (file: any) => file.Fk_Request_Item_Id === requestItemId
            );
        }
    }

    //ปิด Modal
    close_modal() {
        const modalButton = document.getElementById(
            "cdFullmodal"
        ) as HTMLButtonElement;
        if (modalButton) {
            modalButton.click();
        }
    }

    //เซฟข้อมูล BR_Personal
    btn_save() {
        debugger;
        this.Budget_Request.BgYear = this.Bgyear;
        this.Budget_Request.Department_Id = this.Department_Id;
        let depart_item = this.List_Mas_Department.filter(
            (item: any) => item.Department_Id == this.Department_Id
        );
        this.Budget_Request.Department_Name = depart_item[0].Department_Name;

        // let list_del_upload_file =
        //     this.List_Budget_Request_Detail_Upload_File.filter(
        //         (item: any) => item.Active == false
        //     );
        // let list_detail_item = [];

        let Func_Change: string = ""

        if (this.Form_Id == 48) { //ค่าใช้จ่ายในการเดินทางไปราชการในประเทศ
            Func_Change = "FUNC-SAVE_DATA-SUB_FORM_MULTI"
        } else { //ฟอร์มปกติ
            Func_Change = "FUNC-SAVE_DATA-SUB_FORM"
        }

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
        } else {
            let model = {
                FUNC_CODE: Func_Change,
                Budget_Request: this.Budget_Request,
                Budget_Request_Detail: this.Budget_Request_Detail,
                List_Budget_Request_Detail_Item: this.List_Budget_Request_Detail_Item,
                List_Budget_Request_Detail_Upload_File: this.List_Budget_Request_Detail_Upload_File,
                List_All: this.List_All,
            };
            //console.log(model);
            let getData = this.Serviceebudget.GatewayGetData(model);
            getData.subscribe((response: any) => {
                //debugger;
                if (response.RESULT == null) {
                    this.List_Budget_Request_Detail_Item =
                        response.List_Budget_Request_Detail_Item;
                    // เพิ่มไฟล์ลงใน FormData
                    this.uploadedFiles1.forEach((file: any) => {
                        let uploadmodel = {
                            FUNC_CODE: "FUNC-UPLOAD_FILE",
                            Budget_Request_Detail_Item:
                                this.List_Budget_Request_Detail_Item[file.IndexFile],
                            Po_Type_File_Id: 0,
                            List_Budget_Request_Detail_Upload_File: this.List_Budget_Request_Detail_Upload_File,
                        };
                        const formData = new FormData();
                        formData.append("MODEL", JSON.stringify(uploadmodel));
                        formData.append("files", file);
                        var getData = this.Serviceebudget.UploadData(formData);
                        getData.subscribe((subresponse: any) => {
                            if (subresponse.RESULT != null) {
                                Swal.fire({
                                    title: "เกิดข้อผิดพลาด!",
                                    text: subresponse.RESULT,
                                    icon: "warning",
                                    //showCancelButton: true,
                                    confirmButtonColor: "rgb(3, 142, 220)",
                                    // cancelButtonColor: 'rgb(243, 78, 78)',
                                    confirmButtonText: "OK",
                                });
                                return;
                            }
                        });
                    });
                    // Swal.fire({
                    //     title: 'บันทึกสำเร็จ!',
                    //     text: 'บันทึกข้อมูลชุดข้อสอบเรียบร้อย!',
                    //     icon: 'success',
                    //     //showCancelButton: true,
                    //     confirmButtonColor: 'rgb(3, 142, 220)',
                    //     //cancelButtonColor: 'rgb(243, 78, 78)',
                    //     confirmButtonText: 'OK'
                    // });

                    //boat
                    Swal.fire({
                        title: "บันทึกสำเร็จ!",
                        text: "บันทึกรายการคำของบดำเนินงานเรียบร้อยแล้ว!",
                        icon: "success",
                        //showCancelButton: true,
                        confirmButtonColor: "rgb(3, 142, 220)",
                        //cancelButtonColor: 'rgb(243, 78, 78)',
                        confirmButtonText: "OK",
                    });
                    // list_detail_item = response.List_Budget_Request_Detail_Item;

                    this.close_modal();
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
