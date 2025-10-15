import { Component, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, FormControl, FormControlName, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { GridJsService } from '../../tables/gridjs/gridjs.service';
import { GridJsService } from '../../tables/gridjs/gridjs.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { GridJsModel } from '../../tables/gridjs/gridjs.model';

import { DecimalPipe } from '@angular/common';
import { get } from 'lodash';
import Swal from 'sweetalert2';
import { EmonitorService } from 'src/app/core/services/emonitor.service';




@Component({
    selector: 'emoIndicator',
    templateUrl: 'emoIndicator.component.html',
    providers: [GridJsService, DecimalPipe, EmonitorService]
})
export class EmoIndicatorComponent {
    // Table data
    gridjsList$!: Observable<GridJsModel[]>;
    total$: Observable<number>;
    griddata: any;
    totalSize: number = 0;
    indicator: any;
    old_indicator: any;
    List_Indications_Template: any = [];
    list_year: any = [];
    select_year: any;
    Indications_Head: any = {};
    Indications_Template: any = {};
    Indications_Template_Development: any = {};
    List_Indications_Template_Development: any = [];
    Indications_Template_Consistency: any = {};
    List_Indications_Head: any = [];
    List_Mas_Balanced_Scorecard: any = [];
    List_Mas_Consistency_Indicator: any = [];
    List_Mas_Department: any = [];
    List_Mas_Strategic: any = [];
    OLD_List_Mas_Strategic: any = [];
    List_Mas_Indicators_Number: any = [];
    List_Mas_Indicators_Type: any = [];
    List_Mas_Unit: any = [];
    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceemo: EmonitorService) {
        this.gridjsList$ = service.countries$;
        this.total$ = service.total$;
    }

    ngOnInit(): void {
        this.list_year = this.generateYearRange();
        debugger;
        let model = {
            FUNC_CODE: "FUNC-GET_DATA-INDICATOR_MAIN",
            BgYear: this.select_year
        }
        var getData = this.serviceemo.GatewayGetData(model);
        getData.subscribe((response: any) => {
            debugger;
            if (response.RESULT == null) {
                this.Indications_Head = response.Indications_Head;
                this.Indications_Template = response.Indications_Template;
                this.Indications_Template_Development = response.Indications_Template_Development;
                this.Indications_Template_Consistency = response.Indications_Template_Consistency;
                this.List_Indications_Head = response.List_Indications_Head;
                this.List_Mas_Balanced_Scorecard = response.List_Mas_Balanced_Scorecard;
                this.List_Mas_Consistency_Indicator = response.List_Mas_Consistency_Indicator;
                this.List_Mas_Department = response.List_Mas_Department;
                this.List_Mas_Strategic = response.List_Mas_Strategic;
                this.OLD_List_Mas_Strategic = response.List_Mas_Strategic;
                this.List_Mas_Indicators_Number = response.List_Mas_Indicators_Number;
                this.List_Mas_Indicators_Type = response.List_Mas_Indicators_Type;
                this.List_Mas_Unit = response.List_Mas_Unit;
                this.List_Indications_Template = response.List_Indications_Template;
                this.convertTemplate();
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

    convertTemplate() {
        this.List_Indications_Template = this.List_Indications_Template.map((item: any) => {
            debugger;
            let indicator = this.List_Indications_Head.find((x: any) => x.Indications_Head_Id == item.Fk_Indicators_Head);
            return {
                ...item,
                Indicators_Number: indicator.Indicators_Number,
                Indications_Name: indicator.Indications_Name,
                Unit: indicator.Unit,
                Indications_Goal: indicator.Indications_Goal,
                Indicators_Type: indicator.Indicators_Type,
                Department_Name: ''
            };
        });
    }

    updateMastrategicCheckbox(data: any[], selectedItem: any) {
        // ตั้งค่า isChecked ของทุก item เป็น false ยกเว้นตัวที่ถูกเลือก
        data.forEach(item => {
            item.isChecked = item === selectedItem;
        });
    }

    onCheckboxChange(selectedItem: any) {

        this.List_Mas_Balanced_Scorecard.forEach((item: any) => {
            item.isChecked = item === selectedItem;
        });

        // เก็บค่าที่เลือกไว้ใช้งาน
        this.Indications_Template.Balance_Scorecard = selectedItem.Scorecard_Name;
    }

    updateCheckbox(data: any) {
        data.isChecked = !data.isChecked;
    }

    filMastrategic(List_Mas_Strategic: any[], consistencyId: number): any[] {
        if (!List_Mas_Strategic) {
            return [];
        }
        //debugger;
        return List_Mas_Strategic.filter(item => item.Fk_Consistency_Id === consistencyId);
    }

    getIndications_Head(): void {

        let mock = this.List_Indications_Head.filter((item: any) => item.Indications_Head_Id == this.Indications_Template.Fk_Indicators_Head);

        this.Indications_Template.BgYear = mock[0].BgYear;
        this.Indications_Head = mock[0];

        this.List_Mas_Strategic = this.OLD_List_Mas_Strategic.filter((item: any) => item.BgYear == mock[0].BgYear);
    }

    addTemplateDev(): void {
        let mock = structuredClone(this.Indications_Template_Development);
        this.List_Indications_Template_Development.push(mock);
    }

    generateYearRange(): number[] {
        let currentYear = new Date().getFullYear();
        if (currentYear < 2500) {
            currentYear += 543;
        }
        this.select_year = currentYear;
        const startYear = currentYear + 2; // เริ่มจาก +2 ปี
        const endYear = currentYear - 5; // ย้อนหลัง 5 ปี

        return Array.from({ length: startYear - endYear + 1 }, (_, i) => startYear - i);
    }


    onSort(column: any) {
        this.griddata = this.sortService.onSort(column, this.griddata)
    }

    SaveIndicator() {

        const newList_Mas_Balanced_Scorecard: any[] = [];
        const newList_Mas_Consistency_Indicator: any[] = [];
        const newList_Mas_Strategic: any[] = [];


        this.List_Mas_Balanced_Scorecard.forEach((data: any) => {
            if (data.isChecked) {
                // สร้าง object ใหม่โดยไม่รวม field isChecked
                const newItem = { ...data };
                delete newItem.isChecked; // ลบ field isChecked
                newList_Mas_Balanced_Scorecard.push(newItem);
            }
        });

        this.List_Mas_Consistency_Indicator.forEach((data: any) => {
            if (data.isChecked) {
                const newItem = { ...data };
                delete newItem.isChecked;
                newList_Mas_Consistency_Indicator.push(newItem);
            }
        });

        this.List_Mas_Strategic.forEach((data: any) => {
            if (data.isChecked) {
                // สร้าง object ใหม่โดยไม่รวม field isChecked
                const newItem = { ...data };
                delete newItem.isChecked; // ลบ field isChecked
                newList_Mas_Strategic.push(newItem);
            }
        });

        let model = {
            FUNC_CODE: "FUNC-SAVE_DATA-INDICATOR_MAIN",
            Indications_Template: this.Indications_Template,
            List_Indications_Template_Development: this.List_Indications_Template_Development,
            List_Mas_Balanced_Scorecard: newList_Mas_Balanced_Scorecard,
            List_Mas_Strategic: newList_Mas_Strategic,
            List_Mas_Consistency_Indicator: newList_Mas_Consistency_Indicator

        }
        //console.log(model);
        var getData = this.serviceemo.GatewayGetData(model);
        getData.subscribe((response: any) => {
            //debugger;
            if (response.RESULT == null) {
                Swal.fire({
                    title: 'บันทึกสำเร็จ!',
                    text: 'บันทึกข้อมูลชุดข้อสอบเรียบร้อย!',
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

    close_modal() {
        const modalButton = document.getElementById("cdFullmodal") as HTMLButtonElement;
        if (modalButton) {
            modalButton.click();
        }
    }

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
                var getData = this.serviceemo.GatewayGetData(model);
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
    /**
* Open small modal
* @param smallDataModal small modal data
*/

    fullModal(smallDataModal: any, data: any) {
        this.modalService.open(smallDataModal, { size: 'fullscreen', windowClass: 'modal-holder' });
        this.indicator = data;

    }
}