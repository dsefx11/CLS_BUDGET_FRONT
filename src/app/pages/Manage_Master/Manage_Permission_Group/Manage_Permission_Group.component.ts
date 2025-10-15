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
import { MasterService } from 'src/app/core/services/master.service';
import { EbudgetService } from 'src/app/core/services/ebudget.service';
import { e } from 'mathjs';
// import { Salary_FormComponent } from '../form_personal/Salary_Form.component';
import { act } from '@ngrx/effects';
import { dE } from '@fullcalendar/core/internal-common';







@Component({
    selector: 'Manage_Permission_Group',
    templateUrl: './Manage_Permission_Group.component.html',
    // styleUrls: ['./Manage_Permission_Group.component.css'],
    providers: [MasterService, GridJsService, DecimalPipe, EbudgetService]
})


export class Manage_Permission_GroupComponent {




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
    formPartial: string = '';
    Form_Id: number = 0;
    Form_Name: string = '';

    Bgyear: any = 0;

    modal_title: any;

    add: any; // เพิ่มข้อมูล




    // List_Mas_Department: any = []; // รายชื่อหน่วยงาน



    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public Serviceebudget: EbudgetService, public MasterService: MasterService) {

        this.total$ = service.total$;
        sessionStorage.setItem("Department_Id", "1")
        // sessionStorage.setItem("Permission_Id", "1")
        this.Department_Id = sessionStorage.getItem("Department_Id");
        this.Permission_Id = sessionStorage.getItem("Permission_Id");
        this.Bgyear = sessionStorage.getItem("Bgyear");

    }




    ngOnInit(): void {
        // debugger;

    }








}






