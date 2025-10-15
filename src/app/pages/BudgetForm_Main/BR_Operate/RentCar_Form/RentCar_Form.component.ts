import { SimpleChanges, Component, Input, Output, ElementRef, ViewChild, ViewChildren, QueryList, CUSTOM_ELEMENTS_SCHEMA, OnInit, ChangeDetectionStrategy, EventEmitter, OnChanges } from '@angular/core';
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
import { e, i } from 'mathjs';
import { number } from 'echarts';
import { ChangeDetectorRef, Inject } from '@angular/core';
import { dE } from '@fullcalendar/core/internal-common';
import { MasterService } from 'src/app/core/services/master.service';
import { DropzoneComponent, DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneDirective, DropzoneConfig } from 'ngx-dropzone-wrapper';

@Component({
    selector: 'RentCar_Form',
    templateUrl: 'RentCar_Form.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    styleUrls: ['../BR_Operate.component.scss'],
})

export class RentCar_FormComponent implements OnInit {

    @Input() Form_Name: string = ''; // รับค่าจาก Component แม่ - ชื่อรายการค่าใช้จ่าย
    @Input() Budget_Request_Detail_Item: any = {};
    @Input() List_Budget_Request_Detail_Item: any = [];
    @Input() Budget_Request: any = {};
    @Input() calculatedTotal_Front: string = ''; // รับค่าจาก Component แม่
    @Output() calculatedTotalChange = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่
    @Output() uploadedFilesChange1 = new EventEmitter<any>(); // ส่งค่าไปยัง Component แม่
    @Input() List_Mas_Po_Type: any = [];// รับค่าจาก Component แม่
    @Input() List_Mas_Expense_Material_List: any = [];// รับค่าจาก Component แม่
    @Input() List_Budget_Request_Detail_Upload_File: any = []; // รับค่าจาก Component แม่
    @Input() Bgyear: any = []; // รับค่าจาก Component แม่

    @ViewChild(DropzoneComponent) componentRef?: DropzoneComponent;
    @ViewChildren(DropzoneDirective) directiveRefs!: QueryList<DropzoneDirective>;


    total$: Observable<number>;
    calculatedTotal: string = '';

    //Upload File
    uploadedFiles1: any = []; // เก็บไฟล์ที่อัพโหลด
    maxFileSizeMB: number; // กำหนดขนาดไฟล์สูงสุดเป็น 10 MB ถ้าไม่ได้กำหนดใน DROPZONE_CONFIG
    previewUrl: any; // URL สำหรับแสดงตัวอย่างไฟล์ที่อัพโหลด


    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef, @Inject(DROPZONE_CONFIG) private DROPZONE_CONFIG: DropzoneConfigInterface) {
        this.total$ = service.total$;
        this.maxFileSizeMB = DROPZONE_CONFIG.maxFilesize || 10; // กำหนดขนาดไฟล์สูงสุดเป็น 10 MB ถ้าไม่ได้กำหนดใน DROPZONE_CONFIG
    }


    ngOnInit() {

    }


    add_form_detail() {
        this.List_Budget_Request_Detail_Item.push(JSON.parse(JSON.stringify(this.Budget_Request_Detail_Item)));
        this.cdr.detectChanges(); // บังคับให้ Angular อัปเดต view
    }


    btn_del_Detail_item = (index: number): void => {
        if (index >= 0 && index < this.List_Budget_Request_Detail_Item.length) {
            this.List_Budget_Request_Detail_Item.splice(index, 1);
        } else {
            console.error("Invalid index:", index);
        }
    };

    choose_ddl_Mas_Po_Type(data: any) {
        let c_item = this.List_Mas_Po_Type.filter((item: any) => item.Po_Type_Id == data.Po_Type_Id)
        data.Po_Type_Name = c_item[0].Po_Type_Name;
    }

    choose_ddl_Expense_Material(data: any) {
        let c_item = this.List_Mas_Expense_Material_List.filter((item: any) => item.Material_Id == item.Material_Id)
        data.Material_Name = c_item[0].Material_Name;
    }

    onChangeCheckBox_Car_Type_Used(currentValue: number, selectedValue: number, data: any): void {
        if (currentValue !== selectedValue) {
            data.Car_Type_Used_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                data.Car_Type_Used_Name = "ทดแทนของเดิม";
            } else if (selectedValue == 2) {
                data.Car_Type_Used_Name = "ของใหม่";
            }
        } else {
            data.Car_Type_Used_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
        }
    }

    calTotal_item(): string {
        debugger;
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


    cal_qty_item(data: any) {
        let Total = (data.Qty_Car * data.Rent_Per_Month) * data.Qty_Month
        data.Total = Total;

        this.calTotal_item(); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมใหม่หลังจากการเปลี่ยนแปลงค่า
    }

    //Upload File
    //Function อัพโหลดไฟล์
    onDropzoneFileAdded1(file: any, IndexFile: any): void {
        console.log('File added', file);
        // ตรวจสอบขนาดไฟล์ก่อนเพิ่ม

        const fileSizeMB = file.size / (1024 * 1024); // นำไฟล์ที่อัพโหลด แปลงขนาดไฟล์เป็น MB
        if (fileSizeMB < this.maxFileSizeMB) {
            file.IndexFile = IndexFile;
            const data = this.List_Budget_Request_Detail_Item[IndexFile];
            if (!data.uploadedFiles1) {
                data.uploadedFiles1 = [];
            }
            data.uploadedFiles1.push(file); // file นี้คือ Dropzone file object
            // รวมไฟล์จากทุก row แล้ว emit
            const allFiles = this.List_Budget_Request_Detail_Item
                .map((item: any) => item.uploadedFiles1 || [])
                .reduce((acc: string | any[], cur: any) => acc.concat(cur), []);
            this.uploadedFilesChange1.emit(allFiles);
            setTimeout(() => {
                if (file.previewElement) {
                    // ลบ progress bar element ออกโดยตรง
                    const progressElement = file.previewElement.querySelector(".dz-progress");
                    if (progressElement && progressElement.parentNode) {
                        progressElement.parentNode.removeChild(progressElement);
                    }

                    // เพิ่ม class แสดงความสำเร็จ
                    file.previewElement.classList.add('dz-success');
                }
            }, 0);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'ไฟล์ใหญ่เกินกำหนด',
                html: `ไฟล์ ${file.name} <br>ขนาดไฟล์ต้องไม่เกิน ${this.maxFileSizeMB} MB`,
            });

            if (file.previewElement && file.previewElement.parentNode) {
                file.previewElement.parentNode.removeChild(file.previewElement);
            }
            // รวมไฟล์จากทุก row แล้ว emit (กรณีลบไฟล์)
            const allFiles = this.List_Budget_Request_Detail_Item
                .map((item: any) => item.uploadedFiles1 || [])
                .reduce((acc: string | any[], cur: any) => acc.concat(cur), []);
            this.uploadedFilesChange1.emit(allFiles);
        }

    }
    //Get Upload File By Fk_Request_Item_Id ที่แนบมาใน List_Budget_Request_Detail_Upload_File
    getFilteredUploadFiles1(Request_Item_Id: number): any[] {
        return this.List_Budget_Request_Detail_Upload_File.filter(
            (item: any) => item.Fk_Request_Item_Id === Request_Item_Id
        );
    }

    // ฟังก์ชันใหม่ (ใช้สำหรับแสดง preview)
    Preview_FileExam(id: any) {
        return this.previewUrl + id;
    }

    // ฟังก์ชันเปิด Lightbox สำหรับรูปภาพ
    openLightbox(file: any) {
        Swal.fire({
            imageUrl: this.Preview_FileExam(file.IDA),
            imageAlt: file.NAME_FAKE,
            title: file.NAME_FAKE,
            showConfirmButton: false,
            showCloseButton: true,
            width: '80%'
        });
    }

    // ฟังก์ชัน เช็คว่าไฟล์ที่อัพโหลดเป็นไฟล์รูปภาพหรือไม่
    isImageFile(fileName: string | any): boolean {
        // ตรวจสอบว่าเป็น object หรือไม่
        if (typeof fileName === 'object') {
            // ถ้าเป็น object ที่มี property NAME_FAKE
            if (fileName && fileName.NAME_FAKE) {
                fileName = fileName.NAME_FAKE;
            } else {
                return false;
            }
        }

        // ตรวจสอบว่า fileName เป็น string หรือไม่
        if (!fileName || typeof fileName !== 'string') {
            return false;
        }

        // หาตำแหน่งจุดสุดท้ายในชื่อไฟล์
        const lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return false; // ไม่มีนามสกุลไฟล์
        }

        // ดึงนามสกุลไฟล์
        const ext = fileName.substring(lastDotIndex + 1).toLowerCase();

        // ตรวจสอบว่าเป็นไฟล์รูปภาพหรือไม่
        return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
    }

    // ฟังก์ชันดาวน์โหลดไฟล์
    downloadFile(IDA: any) {

        window.open(this.Export_File(IDA), '_blank');

    }

    // ฟังก์ชันสร้าง URL สำหรับดาวน์โหลดไฟล์
    Export_File(IDA: number) {
        const fileUrl = `${environment.GET_BG_Path_Backend}?IDA=${IDA}`; // สร้าง URL สำหรับดาวน์โหลดไฟล์
        return fileUrl;
    }

    // ฟังก์ชันลบไฟล์ออกจาก index แถวที่เลือก
    deleteFileByFilteredIndex(subIndex: number, requestItemId: any) {
        const filtered = this.getFilteredUploadFiles1(requestItemId);
        const fileToDelete = filtered[subIndex];
        if (fileToDelete && fileToDelete.Request_Upload_Id) {
            const mainIndex = this.List_Budget_Request_Detail_Upload_File.findIndex(
                (file: any) => file.Request_Upload_Id === fileToDelete.Request_Upload_Id
            );
            if (mainIndex !== -1) {
                this.List_Budget_Request_Detail_Upload_File.splice(mainIndex, 1);
            }
        } else {
            console.error('ไม่พบไฟล์ที่ต้องการลบ หรือ Request_Upload_Id ไม่ถูกต้อง', fileToDelete);
        }
    }



    removeDropzoneFile(file: any, data: any, dzIndex: number) {
        // 1. ลบ preview element ออกจาก DOM โดยตรง (ถ้ามี)
        if (file.previewElement && file.previewElement.parentNode) {
            file.previewElement.parentNode.removeChild(file.previewElement);
        }

        const list_upload = this.List_Budget_Request_Detail_Upload_File;
        // 2. ลบออกจาก array ของแถวนั้น
        const idx = data.uploadedFiles1.indexOf(file);
        if (idx !== -1) {
            data.uploadedFiles1.splice(idx, 1);
        }
        // ถ้ามี List_Budget_Request_Detail_Upload_File (สำหรับไฟล์ที่มาจาก backend)
        if (this.List_Budget_Request_Detail_Upload_File?.length) {
            const index = this.List_Budget_Request_Detail_Upload_File.findIndex(
                (item: any) => item.Name_Real === file.Name_Real
            );
            if (index !== -1) {
                this.List_Budget_Request_Detail_Upload_File[index].Is_Del_File = 1;
            }
        }
    }


}