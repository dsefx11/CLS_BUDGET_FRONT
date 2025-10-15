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
import { DropzoneComponent, DropzoneDirective } from 'ngx-dropzone-wrapper';


@Component({
    selector: 'Articles_Form',
    templateUrl: 'Articles_Form.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    styleUrls: ['../BR_Invest.component.scss'],
})

export class Articles_FormComponent implements OnInit {

    @Input() Form_Name: string = ''; // รับค่าจาก Component แม่
    @Input() Budget_Request_Detail_Item: any = {};
    @Input() List_Budget_Request_Detail_Item: any = [];
    @Input() List_Budget_Request_Detail_Upload_File: any = []; // ส่งค่าไปยัง Component แม่
    @Input() Budget_Request: any = {};
    Filtered_Upload_Files: any[] = []; // รับค่าจาก Component แม่

    @Input() calculatedTotal_Front: string = ''; // รับค่าจาก Component แม่
    @Output() calculatedTotalChange = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่
    @Output() uploadedFilesChange1 = new EventEmitter<any>(); // ส่งค่าไปยัง Component แม่
    @Output() uploadedFilesChange2 = new EventEmitter<any>(); // ส่งค่าไปยัง Component แม่
    @Input() List_Mas_Expense_Material_List: any = []; //ส่งค่าไปยัง Component แม่
    @Input() List_Mas_Unit: any = []; //ส่งค่าไปยัง Component แม่
    @Input() List_Mas_Month: any = []; //ส่งค่าไปยัง Component แม่

    @ViewChild(DropzoneComponent) componentRef?: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef?: DropzoneDirective;


    list_fileupload: any = []; // เก็บไฟล์ที่อัปโหลด
    files: Array<{
        name: string,
        size: number,
        type: string,
        status: string,
        lastModified: number,
        lastModifiedDate: Date,
        progress?: number
    }> = [];
    FileForUpload: any;
    uploadedFiles1: any = [];
    uploadedFiles2: any = [];
    previewUrl: any;

    total$: Observable<number>;
    calculatedTotal: string = '';


    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef) {
        this.total$ = service.total$;
    }

    ngOnInit() {

    }

    getFilteredUploadFiles1(Request_Item_Id: number): any[] { //Filter เอา Id ของ List หลัก ไป where fk ของ List ย่อย 
        return this.List_Budget_Request_Detail_Upload_File.filter(
            (item: any) => item.Fk_Request_Item_Id === Request_Item_Id && item.Po_Type_File_Id === 1 //แนบไฟล์ใบเสนอราคา
        );
    }

    getFilteredUploadFiles2(Request_Item_Id: number): any[] { //Filter เอา Id ของ List หลัก ไป where fk ของ List ย่อย 
        return this.List_Budget_Request_Detail_Upload_File.filter(
            (item: any) => item.Fk_Request_Item_Id === Request_Item_Id && item.Po_Type_File_Id === 2 //คุณลักษณะของครุภัณฑ์ (Spec)
        );
    }

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

    choose_ddl_Expense_Material(data: any) {
        let c_item = this.List_Mas_Expense_Material_List.filter((item: any) => item.Material_Id == data.Material_Id)
        data.Material_Name = c_item[0].Material_Name;
        data.Price = c_item[0].Material_Price;
        data.Fk_Unit_Id = c_item[0].Material_Unit;

        let list_Mas_Unit = this.List_Mas_Unit.filter((item: any) => item.Unit_Id == data.Fk_Unit_Id)

        data.Unit_Name = list_Mas_Unit[0].Unit_Name;
    }

    choose_ddl_Mas_Unit(data: any) {
        let c_item = this.List_Mas_Unit.filter((item: any) => item.Unit_Id == data.Fk_Unit_Id)
        data.Unit_Name = c_item[0].Unit_Name;
    }

    choose_ddl_Mas_Month(data: any) {
        let c_item = this.List_Mas_Month.filter((item: any) => item.Month_Id == data.Month_Id)
        data.Month_Name = c_item[0].Month_Name;
    }



    onChangeCheckBox_Po_Type(currentValue: number, selectedValue: number, data: any): void {
        if (currentValue !== selectedValue) {
            data.Po_Type_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                data.Po_Type_Name = "ในมาตรฐาน";
            } else if (selectedValue == 2) {
                data.Po_Type_Name = "นอกมาตรฐาน";
            } else {
                data.Po_Type_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }

    onChangeCheckBox_Purpose(currentValue: number, selectedValue: number, data: any): void {
        if (currentValue !== selectedValue) {
            data.Purpose_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                data.Purpose_Name = "ทดแทนของเดิม";
            } else if (selectedValue == 2) {
                data.Purpose_Name = "เพิ่มปริมานเป้าหมาย";
            } else if (selectedValue == 3) {
                data.Purpose_Name = "เพิ่มประสิทธิภาพ"
            }
            else {
                data.Purpose_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }

    onChangeIsQuarter(data: any, event: any) {
        data.Is_Quarter = event.target.checked ? 1 : null;
    }
    onChangeIsPurpose(data: any, event: any) {
        data.Is_Purpose = event.target.checked ? 1 : null;
    }


    cal_qty_item(data: any) {
        let Total = data.Quantity * data.Price
        data.Total = Total;

        this.calTotal_item(); // เรียกใช้ฟังก์ชันเพื่อคำนวณผลรวมใหม่หลังจากการเปลี่ยนแปลงค่า
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

    onDropzoneFileAdded1(file: any, IndexFile: any): void {
        console.log('File added', file);
        file.IndexFile = IndexFile;
        this.uploadedFiles1.push(file);
        this.uploadedFilesChange1.emit(this.uploadedFiles1); // ส่งค่าไปยัง Component แม่
        // ลบ progress bar ทันทีที่เพิ่มไฟล์
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
    }

    onDropzoneFileAdded2(file: any, IndexFile: any): void {
        console.log('File added', file);
        file.IndexFile = IndexFile;
        this.uploadedFiles2.push(file);
        this.uploadedFilesChange2.emit(this.uploadedFiles2); // ส่งค่าไปยัง Component แม่
        // ลบ progress bar ทันทีที่เพิ่มไฟล์
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
    }

    ngAfterViewInit() {
        // ซ่อน progress bar ของทุก dropzone หลังจากโหลดหน้า
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.dropzone .dz-preview .dz-progress');
            progressBars.forEach(progressBar => {
                if (progressBar.parentNode) {
                    (progressBar as HTMLElement).style.display = 'none';
                }
            });
        }, 500);
    }

    onDropzoneUploadProgress(event: any): void {
        const [file, progress, bytesSent] = event;
        console.log(`Upload progress for ${file.name}: ${progress}%`);

        // อัปเดตความคืบหน้าของไฟล์
        const existingFile = this.files.find(f => f.name === file.name);
        if (existingFile) {
            existingFile.status = 'กำลังอัปโหลด';
            existingFile.progress = progress;
        }
    }

    onDropzoneComplete(file: any): void {
        console.log('File upload complete', file);

        // อัปเดตสถานะเมื่อเสร็จสิ้น
        const existingFile = this.files.find(f => f.name === file.name);
        if (existingFile && file.status !== 'error') {
            existingFile.status = 'เสร็จสิ้น';
        }

        // ซ่อน progress bar
        if (file.previewElement) {
            const progressElement = file.previewElement.querySelector(".dz-progress");
            if (progressElement) {
                progressElement.style.display = 'none';

                // หรือลบออกเลย
                if (progressElement.parentNode) {
                    progressElement.parentNode.removeChild(progressElement);
                }
            }
        }
    }

    onDropzoneRemovedFile(file: any): void {
        console.log('File removed', file);

        // ลบไฟล์ออกจากรายการ
        this.files = this.files.filter(f => f.name !== file.name);
    }

    // คุณสามารถเพิ่ม method สำหรับจัดการกับ Dropzone โดยตรงได้
    resetDropzone(): void {
        if (this.directiveRef) {
            this.directiveRef.dropzone().removeAllFiles(true);
            this.files = [];
        }
    }

    // ถ้าต้องการอัปโหลดไฟล์ที่อยู่ในคิวทั้งหมด
    processQueue(): void {
        if (this.directiveRef) {
            this.directiveRef.dropzone().processQueue();
        }
    }


    // ฟังก์ชันตรวจสอบประเภทไฟล์ (ปรับปรุง)
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


    // ฟังก์ชันใหม่ (ใช้สำหรับแสดง preview)
    Preview_FileExam(id: any) {
        return this.previewUrl + id;
    }

    // ฟังก์ชันเลือกไอคอนตามประเภทไฟล์
    getFileIcon(fileName: string): string {
        if (!fileName) return 'assets/images/icons/file.png';

        const ext = fileName.toLowerCase().split('.').pop();
        switch (ext) {
            case 'pdf': return 'assets/images/icons/pdf.png';
            case 'doc':
            case 'docx': return 'assets/images/icons/word.png';
            case 'xls':
            case 'xlsx': return 'assets/images/icons/excel.png';
            default: return 'assets/images/icons/file.png';
        }
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

    Export_File(IDA: number) {
        const fileUrl = `${environment.GET_BG_Path_Backend}?IDA=${IDA}`; // สร้าง URL สำหรับดาวน์โหลดไฟล์
        return fileUrl;
    }



    // ฟังก์ชันดาวน์โหลดไฟล์
    downloadFile(IDA: any) {

        window.open(this.Export_File(IDA), '_blank');

    }

    // ฟังก์ชันลบไฟล์
    deleteFile(IDA: any) {
        this.Filtered_Upload_Files = this.Filtered_Upload_Files.filter((file: any) => file.Request_Upload_Id == IDA);
    }



}