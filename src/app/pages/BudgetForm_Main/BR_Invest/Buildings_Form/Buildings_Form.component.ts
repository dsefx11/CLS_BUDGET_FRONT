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
import { get, max } from 'lodash';
import Swal from 'sweetalert2';
import { EbudgetService } from 'src/app/core/services/ebudget.service';
import { e } from 'mathjs';
import { number } from 'echarts';
import { ChangeDetectorRef, Inject } from '@angular/core';
import { dE } from '@fullcalendar/core/internal-common';
import { MasterService } from 'src/app/core/services/master.service';
import { DropzoneComponent, DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneDirective, DropzoneConfig } from 'ngx-dropzone-wrapper';

interface YearData {
    year: number;
    amount: number;
    price: number;
    total: number;
}

@Component({
    selector: 'Buildings_Form',
    templateUrl: 'Buildings_Form.component.html',
    providers: [GridJsService, DecimalPipe, EbudgetService],
    styleUrls: ['../BR_Invest.component.scss'],
})

export class Buildings_FormComponent implements OnInit {

    @Input() Form_Name: string = ''; // รับค่าจาก Component แม่
    @Input() Budget_Request_Detail_Item: any = {};
    @Input() List_Budget_Request_Detail_Item: any = [];
    @Input() List_Budget_Request_Detail_Upload_File: any = []; // รับค่าจาก Component แม่
    Filtered_Upload_Files: any[] = []; // รับค่าจาก Component แม่
    @Input() Budget_Request: any = {};
    @Input() calculatedTotal_Front: string = ''; // รับค่าจาก Component แม่
    @Output() calculatedTotalChange = new EventEmitter<string>(); // ส่งค่าไปยัง Component แม่
    @Output() uploadedFilesChange1 = new EventEmitter<any>(); // ส่งค่าไปยัง Component แม่
    @Input() List_Mas_Importance: any = [];
    @Input() List_Mas_Expense_Material_List: any = [];
    @Input() Bgyear: any = [];

    @ViewChild(DropzoneComponent) componentRef?: DropzoneComponent;
    @ViewChild(DropzoneDirective) directiveRef?: DropzoneDirective;


    total$: Observable<number>;
    calculatedTotal: string = '';



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
    previewUrl: any;

    maxFileSizeMB: number;


    constructor(private modalService: NgbModal, public service: GridJsService, private sortService: PaginationService, public serviceebudget: EbudgetService, public MasterService: MasterService, private cdr: ChangeDetectorRef, @Inject(DROPZONE_CONFIG) private DROPZONE_CONFIG: DropzoneConfigInterface) {
        this.total$ = service.total$;

        this.maxFileSizeMB = DROPZONE_CONFIG.maxFilesize || 10; // กำหนดขนาดไฟล์สูงสุดเป็น 10 MB ถ้าไม่ได้กำหนดใน DROPZONE_CONFIG
    }

    ngOnInit() {

    }

    generateYearRange(data: any): number[] {
        const years: number[] = [];

        if (data.Building_Type_Id === 1) {
            years.push(parseInt(this.Bgyear));
        } else if (data.Building_Type_Id === 2) {
            // สร้างช่วงปี 2568-2572 (5 ปี)
            for (let i = 0; i < 5; i++) {
                years.push(parseInt(this.Bgyear) + i);
            }
        }
        return years;
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


    Choose_ddl_Mas_Importance(data: any) {
        let c_item = this.List_Mas_Importance.filter((item: any) => item.Importance_Id == data.Importance_Id)
        data.Importance_Name = c_item[0].Importance_Name;
    }

    onChangeCheckBox_Building_Spec_Type(currentValue: number, selectedValue: number, data: any): void {
        if (currentValue !== selectedValue) {
            data.Building_Spec_Type_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                data.Building_Spec_Type_Name = "สร้างใหม่";
            } else if (selectedValue == 2) {
                data.Building_Spec_Type_Name = "ปรับปรุง";
            } else {
                data.Building_Spec_Type_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }

    onChangeCheckBox_Building_Type(currentValue: number, selectedValue: number, data: any): void {
        if (currentValue !== selectedValue) {
            data.Building_Type_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                data.Building_Spec_Type_Name = "ปีเดียว";
                data.Building_Year_1 = this.Bgyear;
                //clear value
                data.Price_Building_1 = "";
                data.Total_Building_1 = "";
                data.Price_Building_2 = "";
                data.Total_Building_2 = "";
                data.Price_Building_3 = "";
                data.Total_Building_3 = "";

                data.Price_Building_1 = data.Total;
            } else if (selectedValue == 3) {
                data.Building_Spec_Type_Name = "ผูกผัน 2 ปี";

                data.Building_Year_1 = this.Bgyear;
                data.Building_Year_2 = parseInt(this.Bgyear) + 1;
                //clear value
                data.Price_Building_1 = "";
                data.Total_Building_1 = "";
                data.Price_Building_2 = "";
                data.Total_Building_2 = "";
                data.Price_Building_3 = "";
                data.Total_Building_3 = "";

                //แบ่ง 20||80
                let percen20 = (data.Total * 20) / 100;
                let percen80 = (data.Total * 80) / 100;


                data.Price_Building_1 = percen20;
                data.Price_Building_2 = percen80;
            } else if (selectedValue == 4) {
                data.Building_Spec_Type_Name = "ผูกผัน 3 ปี";
                data.Building_Year_1 = this.Bgyear;
                data.Building_Year_2 = parseInt(this.Bgyear) + 1;
                data.Building_Year_3 = parseInt(this.Bgyear) + 2;

                //clear value
                data.Price_Building_1 = "";
                data.Total_Building_1 = "";
                data.Price_Building_2 = "";
                data.Total_Building_2 = "";
                data.Price_Building_3 = "";
                data.Total_Building_3 = "";

                //แบ่ง 20||40||40
                var percen20 = (data.Total * 20) / 100;
                var percen40 = (data.Total * 40) / 100;

                data.Price_Building_1 = percen20;
                data.Price_Building_2 = percen40;
                data.Price_Building_3 = percen40;
            }

            else {
                data.Building_Type_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }

    Cal_Building_Total(data: any) {

        if (data.Building_Type_Id == undefined || data.Building_Type_Id == null || data.Building_Type_Id == '') {
            Swal.fire(
                'จำนวน/ราคา',
                'กรุณาเลือก : ประเภทสิ่งก่อสร้าง',
                'error'
            )
            data.Quantity = "";
            data.Price = "";
        }

        let qty = parseInt(data.Quantity)
        let total = qty * data.Price;
        data.Total = total
        this.Budget_Request.Total = total;

        if (data.Building_Type_Id == 1) { //ปีเดียว
            data.Price_Building_1 = data.Total;
        } else if (data.Building_Type_Id == 3) { //ผกผัน 2 ปี
            //แบ่ง 20||80
            let percen20 = (data.Total * 20) / 100;
            let percen80 = (data.Total * 80) / 100;
            //var SumAll = percen20 +

            data.Price_Building_1 = percen20;
            data.Price_Building_2 = percen80;
        } else if (data.Building_Type_Id == 4) { //ผกผัน 3 ปี
            //แบ่ง 20||40||40
            let percen20 = (data.Total * 20) / 100;
            let percen40 = (data.Total * 40) / 100;

            data.Price_Building_1 = percen20;
            data.Price_Building_2 = percen40;
            data.Price_Building_3 = percen40;
        }

        // this.Budget_Request.Total = total; // อัปเดตค่า Rent_Per_Year ใน Budget_Request ส่งไปยัง Component แม่
        // this.calculatedTotal = this.MasterService.show_fix(total); // อัปเดตค่า calculatedTotal แสดงผลรวม Total
        // this.calculatedTotalChange.emit(this.Budget_Request.Total); // ส่งค่าไปยัง Component แม่
        // this.calculatedTotal_Front = ""; // รีเซ็ตค่า calculatedTotal_Front

        //return $scope.show_fix(total);
        this.calTotal_item();
    }

    onChangeCheckBox_Purpose(currentValue: number, selectedValue: number, data: any): void {
        if (currentValue !== selectedValue) {
            data.Purpose_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                data.Purpose_Name = "ทดแทนของเดิม";
            } else if (selectedValue == 2) {
                data.Purpose_Name = "เพิ่มปริมานเป้าหมาย";
            } else if (selectedValue == 3) {
                data.Purpose_Name = "เพิ่มประสิทธิภาพ";
            } else {
                data.Purpose_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }

    onChangeCheckBox_Building_Place_Ready(currentValue: number, selectedValue: number, data: any): void {
        if (currentValue !== selectedValue) {
            data.Building_Place_Ready_Id = selectedValue; // ตั้งค่าตามที่เลือก
            if (selectedValue == 1) {
                data.Building_Place_Ready_Name = "สถานที่เดิม";
            } else if (selectedValue == 2) {
                data.Building_Place_Ready_Name = "บนพื้นที่ว่าง";
            } else {
                data.Building_Place_Ready_Id = null; // ยกเลิกการเลือกหากคลิกซ้ำ
            }
        }
    }

    // delDropzonePreview(file: any): void {
    //     // ลบออกจาก Dropzone UI
    //     if (this.directiveRef) {
    //         this.directiveRef.dropzone().removeFile(file);
    //     }
    //     // ลบออกจาก array (ถ้ามี)
    //     const idx = 0;
    //     this.uploadedFiles1.splice(idx, 1);
    //     this.uploadedFilesChange1.emit(this.uploadedFiles1);
    // }

    onDropzoneFileAdded1(file: any, IndexFile: any): void {
        console.log('File added', file);
        // ตรวจสอบขนาดไฟล์ก่อนเพิ่ม

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB < this.maxFileSizeMB) {
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
        } else {
            Swal.fire({
                icon: 'error',
                title: 'ไฟล์ใหญ่เกินกำหนด',
                html: `ไฟล์ ${file.name} <br>ขนาดไฟล์ต้องไม่เกิน ${this.maxFileSizeMB} MB`,
            });

            // ลบไฟล์ออกจาก Dropzone UI
            // if (file.previewElement && file.previewElement.dropzone) {
            //     file.previewElement.dropzone.removeFile(file);
            // }
            if (file.previewElement && file.previewElement.parentNode) {
                file.previewElement.parentNode.removeChild(file.previewElement);
            }
            // ลบไฟล์ออกจาก array (ถ้ามี push ไปแล้ว)
            this.uploadedFiles1 = this.uploadedFiles1.filter((f: any) => f !== file);
            this.uploadedFilesChange1.emit(this.uploadedFiles1);
        }

    }

    getFilteredUploadFiles1(Request_Item_Id: number): any[] { //Filter เอา Id ของ List หลัก ไป where fk ของ List ย่อย 
        return this.List_Budget_Request_Detail_Upload_File.filter(
            (item: any) => item.Fk_Request_Item_Id === Request_Item_Id //แนบไฟล์ใบเสนอราคา
        );
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
    // deleteFile(IDA: any) {
    //     // this.Filtered_Upload_Files = this.Filtered_Upload_Files.filter((file: any) => file.Request_Upload_Id == IDA);
    //     this.List_Budget_Request_Detail_Upload_File = this.List_Budget_Request_Detail_Upload_File.filter((file: any) => file.Request_Upload_Id == IDA);


    // }
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










}