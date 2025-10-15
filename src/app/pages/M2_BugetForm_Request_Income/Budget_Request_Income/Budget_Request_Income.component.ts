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
    selector: 'Budget_Request_Income',
    templateUrl: 'Budget_Request_Income.component.html',
    styleUrls: ['../M2_BugetForm_Request_Income.scss'],
    providers: [GridJsService, DecimalPipe, EbudgetService]
})


export class Budget_Request_IncomeComponent {


    // bread crumb items
    breadCrumbItems!: Array<{}>;
    // Table data
    gridjsList$!: Observable<GridJsModel[]>;
    total$: Observable<number>;
    griddata: any;

    totalSize: number = 0;
    Test_Plan_Name: any;

    select_year: any;
    list_year: any = [];

    Department_Id: any;
    Permission_Id: any;
    budgetType: any = 1;

    modal_title: any;


    page_run: number = 0;
    formPartial: string = '';
    Form_Id: number = 0;

    Form_Name: string = '';
    Bgyear: any = 0;

    IDA: number = 0;

    Project_Type_Id: number = 0; // 1:ขาขึ้น, 2:ขาลง

    Request_Income_Id: number = 0; // รหัสคำขอของบรายได้

    Sub_From_Name: string = ''; //ชื่อ Sub From

    add: any; // เพิ่มข้อมูล หรือ แก้ไขข้อมูล

    Topic_Income_Id: number = 0; // รหัสหัวข้อคำขอของบรายได้
    Topic_Income_Sub_Id: number = 0; // รหัสย่อยคำขอของบรายได้

    Budget_Request_Income: any = {}; // item row
    Budget_Request_Income_Detail: any = {}; // item row
    old_Budget_Request_Income: any = []; // ข้อมูลทั้งหมด
    Budget_Request_Income_Multi_Item: any = {}; // item row
    Budget_Request_Income_Project_Detial: any = {}; // item row ส่วนที่ 4 Small Success

    List_Mas_Request_Income: any = []; // รายการคำขอของบรายได้
    List_Mas_Request_Income_Detail: any = []; // รายการย่อย รายละเอียดคำขอของบรายได้
    Old_List_Mas_Request_Income_Detail: any = []; // รายการย่อย รายละเอียดคำขอของบรายได้
    List_Budget_Request_Income_Multi_Item: any = []; //รายการคำขอ รายละเอียดตัวคูณ /ส่วนที่4->กิจกรรม(หลัก)
    List_Budget_Request_Income_Multi_Item_Sub: any = []; //รายการคำขอ รายละเอียดตัวคูณ /ส่วนที่4->กิจกรรม(ย่อย)
    List_Budget_Request_Income_Multi_Week_Plan_Item: any = []; //วางแผนรายสัปดาห์ /ส่วนที่4-กิจกรรม(ย่อย)
    List_Budget_Request_Income_Multi_Plan_Item: any = []; //วางแผนรายการตัวคูณ /ส่วนที่4-กิจกรรม(ย่อย)
    List_Budget_Request_Income_Multi_Sub_Item: any = []; //กิจกรรม(ย่อย) /ส่วนที่4-กิจกรรม(ย่อย)
    List_Budget_Request_Income_Multi_Week_Plan_Item_Multi_Sub: any = []; //วางแผนรายสัปดาห์(ย่อย) /ส่วนที่4-กิจกรรม(ย่อย)
    List_Budget_Request_Income_Multi_Plan_Item_Multi_Sub: any = []; //วางแผนรายการตัวคูณ(ย่อย) /ส่วนที่4-กิจกรรม(ย่อย)
    List_Budget_Request_Income_Multi_Month_Plan_Item: any = []; //วางแผนไตรมาส (หลัก) /ส่วนที่4-กิจกรรม(หลัก)
    List_Mas_Department: any = []; // รายการหน่วยงาน
    // List_Mas_Project: any = []; // รายการโครงการ
    // Old_List_Mas_Project: any = []; // รายการโครงการ
    List_Mas_Expense_Cost_Rate: any = []; // อัตราค่าตอบแทน

    //เงินรายได้ล่วงเวลา
    List_Budget_Request_Detail_Item: any = []; // รายการคำขอของบรายได้ ล่วงเวลา
    Budget_Request_Detail_Item: any = {}; // รายการคำขอของบรายได้ ล่วงเวลา

    // Project_Form
    Budget_Request_Income_Strategy_Sub_Item: any = {}; // item row
    Budget_Request_Income_Consistency_MS_Plan_Item: any = {}; // item row
    List_Budget_Request_Income_Strategy_Sub_Item: any = [];
    List_Budget_Request_Income_Consistency_MS_Plan_Item: any = []; //2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
    List_Budget_Request_Income_Consistent_Plan_Nation_Item: any = []; //2.5 ความสอดคล้องกับแผนความมั่นคงชาติ
    List_Budget_Request_Income_Consistent_Plan_Item: any = []; //3.1 ตามมติ ครม. วันที่ 4 ธันวาคม 2560
    List_Budget_Request_Income_Law_Relate_Item: any = []; //3.4 กฏหมายที่เกี่ยวข้อง
    List_Budget_Request_Income_Cabinet_Resolution_Item: any = []; //3.5 มติคณะรัฐมนตรีที่เกี่ยวข้อง
    List_Budget_Request_Income_Project_Consistency_Item: any = []; //3.2/3.3/3.6/3.7/3.8

    List_Budget_Request_Income_Project_Detial_Item: any = []; //ส่วนที่ 3 Small Success

    Get_Detial_Budget_Request_Income: any = []; // รายการคำขอของบรายได้
    List_Budget_Request_Income: any = []; // รายการคำขอของบรายได้

    calculatedTotal_Request: string = ""; // ตัวแปรสำหรับเก็บค่าที่รับจาก Rent_HomeComponent
    calculatedTotal_Front: string = ""; // ตัวแปรสำหรับเก็บค่าที่ส่งไปยัง Child component ของปุ่ม แก้ไข

    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public MasterService: MasterService, public serviceebudget: EbudgetService) {

        this.total$ = service.total$;
        sessionStorage.setItem("Department_Id", "27") //celest
        // sessionStorage.setItem("Permission_Id", "1")
        this.Department_Id = sessionStorage.getItem("Department_Id");
        this.Permission_Id = sessionStorage.getItem("Permission_Id");
        this.Bgyear = sessionStorage.getItem("Bgyear");
        this.Project_Type_Id = 1; //ขาขึ้น

    }


    // รับค่า Total จาก Child component
    onCalculatedTotalChange(total: string): void {
        this.calculatedTotal_Request = this.MasterService.show_fix(parseInt(total)); // รับค่าจาก Rent_HomeComponent
        // this.Budget_Request_Income.Total = total; // อัปเดตค่า Total ใน Budget_Request_Income ส่งไปเซฟ
    }

    // รับข้อมูล List_Budget_Request_Income_Multi_Item_Sub จาก Child component
    onMultiItemSubChange(multiItemSubList: any[]): void {
        this.List_Budget_Request_Income_Multi_Item_Sub = multiItemSubList; // อัปเดตข้อมูลใน parent component
        console.log('Updated List_Budget_Request_Income_Multi_Item_Sub in parent:', this.List_Budget_Request_Income_Multi_Item_Sub);
    }

    // รับข้อมูล List_Budget_Request_Income_Multi_Month_Plan_Item จาก Child component
    onMultiMonthPlanItemChange(multiMonthPlanItemList: any[]): void {
        this.List_Budget_Request_Income_Multi_Month_Plan_Item = multiMonthPlanItemList; // อัปเดตข้อมูลใน parent component
        console.log('Updated List_Budget_Request_Income_Multi_Month_Plan_Item in parent:', this.List_Budget_Request_Income_Multi_Month_Plan_Item);
    }

    ngOnInit(): void {

        let model = {
            FUNC_CODE: "FUNC-GET_DATA-REQUEST_INCOME",
            Department_Id: this.Department_Id,
            BgYear: this.Bgyear,
            Project_Type_Id: this.Project_Type_Id,
            Fk_Expense_Id: 20
        }
        var getData = this.serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            // debugger;
            if (response.RESULT == null) {
                this.old_Budget_Request_Income = JSON.parse(JSON.stringify(response.Budget_Request_Income)); //เอาไปใช้เคลีย Table->BG_Request_Income *ต้องเรียกใช้จาก this อันนี้ เรียกขึ้นมาแต่ยังไม่ได้เคลีย
                this.List_Mas_Request_Income = response.List_Mas_Request_Income;
                this.Old_List_Mas_Request_Income_Detail = response.List_Mas_Request_Income_Detail;
                this.List_Mas_Department = response.List_Mas_Department;
                this.List_Mas_Expense_Cost_Rate = response.List_Mas_Expense_Cost_Rate; // อัตราค่าตอบแทน
                // this.Old_List_Mas_Project = response.List_Mas_Project;

                this.Choose_Mas_Request_Income_Detail(); // get List ถ้าเลือกหัวข้อคำขอของบรายได้แล้ว
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

    Clear_Form(old_list: any) {
        this.Budget_Request_Income = JSON.parse(JSON.stringify(old_list)); //เคลีย Table->BG_Request_Income
        this.List_Budget_Request_Income = [];  //เคลีย List_Budget_Request_Income
    }


    onFilter(term: string): void { //ใช้อันนี้ในการ Filter Talbe List
        const lowerTerm = term.toLowerCase(); // แปลงคำค้นหาเป็นตัวพิมพ์เล็ก
        this.List_Budget_Request_Income = this.Get_Detial_Budget_Request_Income.filter((item: any) => {
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
        this.List_Budget_Request_Income = this.sortService.onSort(column, this.List_Budget_Request_Income)
    }

    async choose_form(): Promise<void> {

        this.page_run += 1;

        await this.get_detail(); //ดึง Masหัวข้อคำขอเงินรายได้ //Masค่าใช้จ่าย
        // await this.loadIncomeDetailAsync();
        if (this.Budget_Request_Income.Topic_Income_Id == 1) { //6(1)
            this.formPartial = 'Request_Income_Detail';
        } else if (this.Budget_Request_Income.Topic_Income_Id == 2) { //6(2)
            this.formPartial = 'Project_Form';
        } else if (this.Budget_Request_Income.Topic_Income_Id == 3) { //6(3)
            this.formPartial = 'Project_Form';
        } else if (this.Budget_Request_Income.Topic_Income_Id == 4) { //6(4.1)
            this.formPartial = 'Request_Income_Detail';
        } else if (this.Budget_Request_Income.Topic_Income_Id == 5) { //6(4.2)
            this.formPartial = 'Request_Income_Detail';
        } else if (this.Budget_Request_Income.Topic_Income_Id == 6) { //6(4.3)
            this.formPartial = 'Request_Income_Detail';
        } else if (this.Budget_Request_Income.Topic_Income_Id == 7) { //6(4.4)
            this.formPartial = 'Request_Income_Detail';
        } else if (this.Budget_Request_Income.Topic_Income_Id == 8) { //6(4.5)
            this.formPartial = 'Request_Income_Detail';
        }

    }

    /**
 * Open small modal
 * @param smallDataModal small modal data
 */
    //คำสั่งเปิด Modal
    btn_add_fullModal(smallDataModal: any, ida: number, old_list: any) {
        // debugger;
        this.modalService.open(smallDataModal, { size: 'fullscreen', windowClass: 'modal-holder' });


        if (this.Budget_Request_Income.Topic_Income_Id == null || this.Budget_Request_Income.Topic_Income_Id == undefined || this.Budget_Request_Income.Topic_Income_Id == 0) {
            Swal.fire({
                title: 'รายการคำขอของบเงินรายได้',
                text: 'กรุณาเลือก : หัวข้อคำขอเงินรายได้',
                icon: 'error',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
            this.close_modal();
        }
        else if (this.Budget_Request_Income.Topic_Income_Sub_Id == null || this.Budget_Request_Income.Topic_Income_Sub_Id == undefined || this.Budget_Request_Income.Topic_Income_Sub_Id == 0) {
            let text_value = "";
            if (this.Budget_Request_Income.Topic_Income_Id == 1) {
                text_value = " บัญชี";
            } else if (this.Budget_Request_Income.Topic_Income_Id == 2) {
                text_value = " โครงการ";
            }
            Swal.fire({
                title: 'รายการคำขอของบเงินรายได้',
                text: 'กรุณาเลือก :' + text_value,
                icon: 'error',
                confirmButtonColor: 'rgb(3, 142, 220)',
                confirmButtonText: 'OK'
            });
            this.close_modal();
        } else {
            this.Budget_Request_Income.Request_Income_Id = ida;
            this.choose_form();
            this.formPartial = ''; // รีเซ็ตค่า formPartial
            if (ida == 0) { // เพิ่มข้อมูลใหม่
                this.modal_title = "เพิ่มคำขอเงินรายได้";

                // เพิ่มข้อมูลใหม่
                this.add = "new";
                // this.Budget_Request_Income = JSON.parse(JSON.stringify(old_list)); //เคลีย Table->BG_Request_Income

                this.List_Budget_Request_Income_Multi_Item.length = 0; // ล้างข้อมูลเก่า without changing reference
                // this.calculatedTotal_Front = ''; // รีเซ็ตค่า

            } else { // แก้ไขข้อมูล
                this.modal_title = "แก้ไขคำขอเงินรายได้";
                // แก้ไขข้อมูล
                this.add = "edit";
            }
        }
    }










    // get_detail() แบบ Promise
    async get_detail(): Promise<any> {
        let model = {
            FUNC_CODE: 'FUNC-GET_DATA-INCOME_DETAIL_FORM',
            Budget_Request_Income: this.Budget_Request_Income,
            // Budget_Request: this.Budget_Request,
            // TYPE_IDA: this.Budget_Request.Fk_Expense_List
        };
        try {
            const response = await this.getDataIncomeDetailPromise(model);
            this.Budget_Request_Income = response.Budget_Request_Income;
            this.Budget_Request_Income_Detail = response.Budget_Request_Income_Detail;
            //ค่าตอบแทน 6.1 //แบบฟอร์มตัวคูณ
            this.List_Budget_Request_Income_Multi_Item = response.List_Budget_Request_Income_Multi_Item;
            //ค่าตอบแทน 6(4.1) //แบบฟอร์มละเอียด //ต้องใช้ List_Budget_Request_Detail_Item เดิมเพราะไปดึงฟอร์มของ คำขอโครงการมาใช้งาน
            this.List_Budget_Request_Detail_Item = response.List_Budget_Request_Income_Detail_Item; //ใช้ List_Budget_Request_Income_Detail_Item ในการดึงข้อมูลของเงินรายได้

            //ค่าตอบแทน 6(2) // 6(3)
            //'1.2 ยุทธศาสตร์ชาติที่เกี่ยวข้องในระดับรอง (Z)
            this.List_Budget_Request_Income_Strategy_Sub_Item = response.List_Budget_Request_Income_Strategy_Sub_Item;
            if (this.List_Budget_Request_Income_Multi_Item.length > 0) {
                this.calTotal_item_type_edit();
            }
            //2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
            this.List_Budget_Request_Income_Consistency_MS_Plan_Item = response.List_Budget_Request_Income_Consistency_MS_Plan_Item;
            //2.5 ความสอดคล้องกับแผนความมั่นคงชาติ
            this.List_Budget_Request_Income_Consistent_Plan_Nation_Item = response.List_Budget_Request_Income_Consistent_Plan_Nation_Item;
            //3.1 ตามมติ ครม. วันที่ 4 ธันวาคม 2560
            this.List_Budget_Request_Income_Consistent_Plan_Item = response.List_Budget_Request_Income_Consistent_Plan_Item;
            //3.4 กฏหมายที่เกี่ยวข้อง
            this.List_Budget_Request_Income_Law_Relate_Item = response.List_Budget_Request_Income_Law_Relate_Item;
            //3.5 มติคณะรัฐมนตรีที่เกี่ยวข้อง
            this.List_Budget_Request_Income_Cabinet_Resolution_Item = response.List_Budget_Request_Income_Cabinet_Resolution_Item;
            //3.2/3.3/3.6/3.7/3.8
            this.List_Budget_Request_Income_Project_Consistency_Item = response.List_Budget_Request_Income_Project_Consistency_Item;
            //ส่วนที่ 3 Small Success
            this.Budget_Request_Income_Project_Detial = response.Budget_Request_Income_Project_Detial;
            this.List_Budget_Request_Income_Project_Detial_Item = response.List_Budget_Request_Income_Project_Detial_Item;
            //ส่วนที่ 4 ส่วนของกิจกรรม
            //Main->เพิ่มรายการ(กิจกรรม)->List_Budget_Request_Income_Multi_Item มีกิจกรรมหลายรายการ
            this.List_Budget_Request_Income_Multi_Item_Sub = response.List_Budget_Request_Income_Multi_Item_Sub; //รายการคำขอ รายละเอียดตัวคูณ /ส่วนที่4->กิจกรรม(ย่อย)
            this.List_Budget_Request_Income_Multi_Week_Plan_Item = response.List_Budget_Request_Income_Multi_Week_Plan_Item; //วางแผนรายสัปดาห์
            this.List_Budget_Request_Income_Multi_Plan_Item = response.List_Budget_Request_Income_Multi_Plan_Item; //วางแผนรายการตัวคูณ
            this.List_Budget_Request_Income_Multi_Sub_Item = response.List_Budget_Request_Income_Multi_Sub_Item; //กิจกรรม(ย่อย)
            this.List_Budget_Request_Income_Multi_Week_Plan_Item_Multi_Sub = response.List_Budget_Request_Income_Multi_Week_Plan_Item_Multi_Sub; //วางแผนรายสัปดาห์(ย่อย)
            this.List_Budget_Request_Income_Multi_Plan_Item_Multi_Sub = response.List_Budget_Request_Income_Multi_Plan_Item_Multi_Sub; //วางแผนรายการตัวคูณ(ย่อย)
            this.List_Budget_Request_Income_Multi_Month_Plan_Item = response.List_Budget_Request_Income_Multi_Month_Plan_Item; //วางแผนไตรมาส (หลัก)

            if (this.add == "new") {
                this.Budget_Request_Income.Topic_Income_Id = this.Topic_Income_Id;
                let list_topic = this.List_Mas_Request_Income.filter((item: any) => item.Request_Income_Id == this.Topic_Income_Id);
                this.Budget_Request_Income.Topic_Income_Name = list_topic[0].Request_Income_Name;
                this.Budget_Request_Income.Topic_Income_Sub_Id = this.Topic_Income_Sub_Id;
                let list_topic_sub = this.List_Mas_Request_Income_Detail.filter((item: any) => item.Request_Income_Detail_Id == this.Topic_Income_Sub_Id);
                this.Budget_Request_Income.Topic_Income_Sub_Name = list_topic_sub[0].Request_Name;
            }
            return response;
        } catch (err) {
            // Swal.fire(...) ถูกเรียกใน Promise แล้ว
            throw err;
        }
    }


    //ปิด Modal  
    close_modal() {
        const modalButton = document.getElementById("cdFullmodal") as HTMLButtonElement;
        if (modalButton) {
            modalButton.click();
        }
    }



    Choose_Mas_Request_Income() {
        const Request_Income_Id = this.Budget_Request_Income.Topic_Income_Id;
        const List_Item = this.List_Mas_Request_Income.filter((item: any) => item.Request_Income_Id == Request_Income_Id);
        if (List_Item.length > 0) {
            this.Budget_Request_Income.Topic_Income_Name = List_Item[0].Request_Income_Name;
        }

        //เคลีย Mas บัญชี / โครงการ
        this.List_Mas_Request_Income_Detail = [];
        // this.List_Mas_Project = [];
        this.Budget_Request_Income.Topic_Income_Sub_Id = "";
        this.List_Budget_Request_Income = [];  //เคลีย List_Budget_Request_Income

        this.List_Mas_Request_Income_Detail = this.Old_List_Mas_Request_Income_Detail.filter((item: any) => item.Fk_Request_Income_Id == Request_Income_Id);

        // if (Request_Income_Id == 1) {
        //     this.List_Mas_Request_Income_Detail = this.Old_List_Mas_Request_Income_Detail.filter((item: any) => item.Fk_Request_Income_Id == Request_Income_Id);
        // } 
        // else if (Request_Income_Id == 2 || Request_Income_Id == 3 || Request_Income_Id == 4 || Request_Income_Id == 5 || Request_Income_Id == 6) {
        //     this.List_Mas_Project = this.Old_List_Mas_Project.filter((item: any) => item.Fk_Request_Income_Id == Request_Income_Id);
        // }

        this.Topic_Income_Id = Request_Income_Id; //เก็บไปเซฟเพิ่มใหม่

    }

    Choose_Mas_Request_Income_Detail() {
        //6(1)บัญชี//6(2)โครงการ // 6(3)//6(4.1)//6(4.2)//6(4.3)//6(4.4)//6(4.5)
        const Topic_Income_Sub_Id = this.Budget_Request_Income.Topic_Income_Sub_Id;
        const List_Item1 = this.List_Mas_Request_Income_Detail.filter((item: any) => item.Request_Income_Detail_Id == Topic_Income_Sub_Id);
        if (List_Item1.length > 0) {
            this.Budget_Request_Income.Topic_Income_Sub_Name = List_Item1[0].Request_Name;
            this.Sub_From_Name = List_Item1[0].Request_Name;
        }

        // //6(2)โครงการ // 6(3)
        // const List_Item2 = this.List_Mas_Project.filter((item: any) => item.Project_Id == Topic_Income_Sub_Id);
        // if (List_Item2.length > 0) {
        //     this.Budget_Request_Income.Topic_Income_Sub_Name = List_Item2[0].Project_Name;
        // }

        this.Topic_Income_Sub_Id = Topic_Income_Sub_Id; //เก็บไปเซฟเพิ่มใหม่

        let model = {
            FUNC_CODE: 'FUNC-GET_List_Budget_Request_Income',
            IDA: this.Budget_Request_Income.Request_Income_Id,
            Department_Id: this.Department_Id,
            BgYear: this.Bgyear,
            Topic_Income: this.Budget_Request_Income.Topic_Income_Id,
            Topic_Income_Sub: this.Budget_Request_Income.Topic_Income_Sub_Id,
            // Budget_Request: this.Budget_Request,
            // TYPE_IDA: this.Budget_Request.Fk_Expense_List
        }
        var getData = this.serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {

            if (response.RESULT == null) {
                this.Get_Detial_Budget_Request_Income = response.List_Budget_Request_Income;
                this.List_Budget_Request_Income = this.Get_Detial_Budget_Request_Income;
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


    calTotal_item_type_edit(): string {
        let total = 0;
        let len_item = this.List_Budget_Request_Income_Multi_Item.length;
        for (let i = 0; i < len_item; i++) {
            total = total + (this.List_Budget_Request_Income_Multi_Item[i].Plan_Amount_Total || 0);
        }

        this.Budget_Request_Income.Total = total; // อัปเดตค่า Rent_Per_Year ใน Budget_Request ส่งไปยัง Component แม่
        this.calculatedTotal_Request = this.show_fix(total); // อัปเดตค่า calculatedTotal
        this.calculatedTotal_Front = this.show_fix(total); // อัปเดตค่า calculatedTotal


        return this.calculatedTotal_Front;
    }

    //เซฟข้อมูล 
    btn_save() {
        //เอาไปเซฟ
        this.Budget_Request_Income.Bgyear = this.Bgyear;
        this.Budget_Request_Income.Dep_Id = this.Department_Id;
        var depart_item = this.List_Mas_Department.filter((item: any) => item.Department_Id == this.Department_Id);
        this.Budget_Request_Income.Dep_Name = depart_item[0].Department_Name;

        let Func_Case = "";
        if (this.Budget_Request_Income.Topic_Income_Id == 1 || this.Budget_Request_Income.Topic_Income_Id == 4) {
            Func_Case = "FUNC-SAVE_BG_REQUEST_INCOME";
        } else if (this.Budget_Request_Income.Topic_Income_Id == 2 || this.Budget_Request_Income.Topic_Income_Id == 3) {
            Func_Case = "FUNC-SAVE_BG_REQUEST_INCOME_PROJECT";
        }

        //เซตค่า กิจกรรม(หลัก) Is_Used_BG เป็น 1 หรือ 0 ถ้าส่งมาเป็น Boolean
        this.List_Budget_Request_Income_Multi_Item.forEach((item: any) => {
            if (item.Is_Used_BG === true) {
                item.Is_Used_BG = 1;
            } else if (item.Is_Used_BG === false) {
                item.Is_Used_BG = 0;
            }
        });
        //เซตค่า กิจกรรม(ย่อย) Is_Used_BG เป็น 1 หรือ 0 ถ้าส่งมาเป็น Boolean
        this.List_Budget_Request_Income_Multi_Item_Sub.forEach((item: any) => {
            if (item.Is_Used_BG === true) {
                item.Is_Used_BG = 1;
            } else if (item.Is_Used_BG === false) {
                item.Is_Used_BG = 0;
            }
        });

        let model = {
            // FUNC_CODE: "FUNC-SAVE_BG_REQUEST_INCOME",
            AUTHEN_INFORMATION: {
                NAME: 'Super_Admin',
            },
            FUNC_CODE: Func_Case,
            Budget_Request_Income: this.Budget_Request_Income,
            Budget_Request_Income_Detail: this.Budget_Request_Income_Detail,
            Budget_Request_Income_Project_Detial: this.Budget_Request_Income_Project_Detial,
            List_Budget_Request_Income_Multi_Item: this.List_Budget_Request_Income_Multi_Item, //เซฟรายการกิจกรรม
            List_Budget_Request_Income_Multi_Item_Sub: this.List_Budget_Request_Income_Multi_Item_Sub,//เซฟรายการกิจกรรม(ย่อย)
            List_Budget_Request_Income_Strategy_Sub_Item: this.List_Budget_Request_Income_Strategy_Sub_Item,
            List_Budget_Request_Income_Consistency_MS_Plan_Item: this.List_Budget_Request_Income_Consistency_MS_Plan_Item,
            List_Budget_Request_Income_Consistent_Plan_Nation_Item: this.List_Budget_Request_Income_Consistent_Plan_Nation_Item,
            List_Budget_Request_Income_Consistent_Plan_Item: this.List_Budget_Request_Income_Consistent_Plan_Item,
            List_Budget_Request_Income_Law_Relate_Item: this.List_Budget_Request_Income_Law_Relate_Item,
            List_Budget_Request_Income_Cabinet_Resolution_Item: this.List_Budget_Request_Income_Cabinet_Resolution_Item,
            List_Budget_Request_Income_Project_Consistency_Item: this.List_Budget_Request_Income_Project_Consistency_Item,
            List_Budget_Request_Income_Project_Detial_Item: this.List_Budget_Request_Income_Project_Detial_Item,
            List_Budget_Request_Income_Multi_Month_Plan_Item: this.List_Budget_Request_Income_Multi_Month_Plan_Item, //เซฟรายการวางแผนรายเดือน - ไตรมาส
            List_Budget_Request_Income_Multi_Week_Plan_Item: this.List_Budget_Request_Income_Multi_Week_Plan_Item, //เซฟรายการวางแผนรายสัปดาห์
            List_Budget_Request_Income_Multi_Plan_Item: this.List_Budget_Request_Income_Multi_Plan_Item, //เซฟรายการตัวคูณ

            //เทสส่งค่าล่วงเวลา
            List_Budget_Request_Income_Detail_Item: this.List_Budget_Request_Detail_Item,
        }
        //console.log(model);
        let getData = this.serviceebudget.GatewayGetData(model);
        getData.subscribe((response: any) => {
            //debugger;
            if (response.RESULT == null) {
                Swal.fire({
                    title: 'บันทึกสำเร็จ!',
                    text: 'บันทึกรายการคำขอของบดำเนินงานเรียบร้อยแล้ว!',
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



    //ตัวอย่างการ ลบข้อมูล
    Del_Request_Income(Request_Income_Id: number) {

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
                    FUNC_CODE: "FUNC-DEL_BG_REQUEST_INCOME",
                    IDA: Request_Income_Id
                }
                var getData = this.serviceebudget.GatewayGetData(model);
                getData.subscribe((response: any) => {
                    //debugger;
                    if (response.RESULT == null) {
                        this.ngOnInit();
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

    // --- เพิ่มฟังก์ชัน Promise สำหรับดึงข้อมูล ---
    getDataIncomeDetailPromise(model: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.serviceebudget.GatewayGetData(model).subscribe(
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

    // --- ตัวอย่างการเรียกใช้แบบ async/await ---
    async loadIncomeDetailAsync() {
        let model = {
            FUNC_CODE: 'FUNC-GET_DATA-INCOME_DETAIL_FORM',
            Budget_Request_Income: this.Budget_Request_Income,
            // Budget_Request: this.Budget_Request,
            // TYPE_IDA: this.Budget_Request.Fk_Expense_List
        };
        try {
            const response = await this.getDataIncomeDetailPromise(model);
            this.Budget_Request_Income = response.Budget_Request_Income;
            this.Budget_Request_Income_Detail = response.Budget_Request_Income_Detail;
            this.List_Budget_Request_Income_Multi_Item = response.List_Budget_Request_Income_Multi_Item;
            //'1.2 ยุทธศาสตร์ชาติที่เกี่ยวข้องในระดับรอง (Z)
            this.List_Budget_Request_Income_Strategy_Sub_Item = response.List_Budget_Request_Income_Strategy_Sub_Item;
            if (this.List_Budget_Request_Income_Multi_Item.length > 0) {
                this.calTotal_item_type_edit();
            }
            //2.1 ความสอดคล้องกับแผนแม่บทภายใต้ยุทธศาสตร์ชาติ (Y)
            this.List_Budget_Request_Income_Consistency_MS_Plan_Item = response.List_Budget_Request_Income_Consistency_MS_Plan_Item;
            //2.5 ความสอดคล้องกับแผนความมั่นคงชาติ
            this.List_Budget_Request_Income_Consistent_Plan_Nation_Item = response.List_Budget_Request_Income_Consistent_Plan_Nation_Item;
            //3.1 ตามมติ ครม. วันที่ 4 ธันวาคม 2560
            this.List_Budget_Request_Income_Consistent_Plan_Item = response.List_Budget_Request_Income_Consistent_Plan_Item;
            //3.4 กฏหมายที่เกี่ยวข้อง
            this.List_Budget_Request_Income_Law_Relate_Item = response.List_Budget_Request_Income_Law_Relate_Item;
            //3.5 มติคณะรัฐมนตรีที่เกี่ยวข้อง
            this.List_Budget_Request_Income_Cabinet_Resolution_Item = response.List_Budget_Request_Income_Cabinet_Resolution_Item;
            //3.2/3.3/3.6/3.7/3.8
            this.List_Budget_Request_Income_Project_Consistency_Item = response.List_Budget_Request_Income_Project_Consistency_Item;
            //ส่วนที่ 3 Small Success
            this.List_Budget_Request_Income_Project_Detial_Item = response.List_Budget_Request_Income_Project_Detial_Item;

            if (this.add == "new") {
                this.Budget_Request_Income.Topic_Income_Id = this.Topic_Income_Id;
                let list_topic = this.List_Mas_Request_Income.filter((item: any) => item.Request_Income_Id == this.Topic_Income_Id);
                this.Budget_Request_Income.Topic_Income_Name = list_topic[0].Request_Income_Name;
                this.Budget_Request_Income.Topic_Income_Sub_Id = this.Topic_Income_Sub_Id;
                const list_topic_sub = this.List_Mas_Request_Income_Detail.filter((item: any) => item.Request_Income_Detail_Id == this.Topic_Income_Sub_Id);
                if (list_topic_sub.length > 0) {
                    this.Budget_Request_Income.Topic_Income_Sub_Name = list_topic_sub[0].Request_Name;

                }
                // let list_topic_sub = this.List_Mas_Project.filter((item: any) => item.Project_Id == this.Topic_Income_Sub_Id);
                // this.Budget_Request_Income.Topic_Income_Sub_Name = list_topic_sub[0].Project_Name;
            }
        } catch (err) {
            // สามารถจัดการ error เพิ่มเติมได้ที่นี่
            // Swal.fire(...) ถูกเรียกใน Promise แล้ว
        }
    }


}






