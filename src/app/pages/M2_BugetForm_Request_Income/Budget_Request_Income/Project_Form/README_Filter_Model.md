# โมเดลการกรองข้อมูลแบบง่ายสำหรับ ensureYear

## ภาพรวม

โมเดลนี้ถูกออกแบบมาให้ง่ายและกระชับ โดยใช้หลักการ caching แบบง่ายๆ เพื่อเพิ่มประสิทธิภาพในการกรองข้อมูล

## โครงสร้างหลัก

### 1. ตัวแปร Cache

```typescript
private cachedData: any = {};                    // เก็บข้อมูลที่ถูก cache
private cacheTimeout = 5 * 60 * 1000;           // เวลาหมดอายุ cache (5 นาที)
```

## เมธอดหลัก

### 1. ensureYear(year: number, fk_Multi_Id: number)

เมธอดหลักที่ใช้ในการกรองข้อมูล

- ตรวจสอบ cache ก่อน
- กรองข้อมูลและเก็บใน cache ถ้าจำเป็น
- คืนค่าข้อมูลที่ถูกกรองแล้ว

### 2. isCacheExpired(cacheKey: string)

ตรวจสอบว่า cache หมดอายุหรือไม่

- เปรียบเทียบเวลาปัจจุบันกับเวลาที่สร้าง cache
- หมดอายุหลังจาก 5 นาที

### 3. clearCache()

ล้าง cache ทั้งหมด

## การทำงาน

### 1. การ Cache ข้อมูล

```typescript
const cacheKey = `${year}_${fk_Multi_Id}`;
this.cachedData[cacheKey] = {
  data: filteredData,
  timestamp: Date.now(),
};
```

### 2. การตรวจสอบ Cache

```typescript
if (this.cachedData[cacheKey] && !this.isCacheExpired(cacheKey)) {
  return this.cachedData[cacheKey].data;
}
```

### 3. การกรองข้อมูล

```typescript
const filteredData = this.List_Budget_Request_Income_Multi_Month_Plan_Item.find(
  (item: any) =>
    item.Fk_Request_Income_Multi_Id === fk_Multi_Id && item.Bgyear_Plan === year
);
```

## การใช้งาน

### 1. การใช้งานพื้นฐาน

```typescript
// ใช้ ensureYear เหมือนเดิม
let monthPlan = this.ensureYear(2567, 123);
```

### 2. การล้าง Cache

```typescript
// ล้าง cache ทั้งหมด
this.clearCache();
```

## ประโยชน์

### 1. ความง่าย

- โค้ดสั้นและเข้าใจง่าย
- ไม่มีโครงสร้างซับซ้อน
- ง่ายต่อการบำรุงรักษา

### 2. ประสิทธิภาพ

- ลดการกรองข้อมูลซ้ำ
- ใช้ cache เพื่อเพิ่มความเร็ว
- หมดอายุอัตโนมัติ

### 3. การใช้งาน

- ใช้เหมือนเดิม ไม่ต้องเปลี่ยนโค้ด HTML
- รองรับการทำงานแบบเดิม
- เพิ่มประสิทธิภาพโดยอัตโนมัติ

## ข้อควรทราบ

### 1. การหมดอายุของ Cache

ข้อมูลใน cache จะหมดอายุหลังจาก 5 นาที เพื่อให้แน่ใจว่าข้อมูลเป็นปัจจุบัน

### 2. การใช้หน่วยความจำ

Cache จะเก็บข้อมูลไว้ในหน่วยความจำ ควรใช้ `clearCache()` เมื่อไม่ต้องการข้อมูลแล้ว

### 3. การทำงานแบบ Synchronous

เมธอดทั้งหมดทำงานแบบ synchronous เพื่อความง่ายในการใช้งาน

## การขยายฟีเจอร์

### 1. เพิ่มประเภท Cache

```typescript
private cachedData: any = {
    monthPlan: {},
    multiItems: {},
    weekPlan: {}
};
```

### 2. เพิ่มการตั้งค่า Cache

```typescript
private cacheSettings = {
    timeout: 5 * 60 * 1000,
    maxSize: 100,
    enableLogging: true
};
```

### 3. เพิ่มเมธอด Cache

```typescript
// ตรวจสอบขนาด cache
getCacheSize() {
    return Object.keys(this.cachedData).length;
}

// ล้าง cache เฉพาะประเภท
clearCacheByType(type: string) {
    delete this.cachedData[type];
}
```

## ตัวอย่างการใช้งานจริง

### 1. ใน HTML Template

```html
<div *ngIf="ensureYear(2567, item.Request_Income_Multi_Plan_Id)">
  <!-- แสดงข้อมูล -->
</div>
```

### 2. ใน Component

```typescript
// ดึงข้อมูล
let data = this.ensureYear(2567, 123);

// ล้าง cache เมื่อต้องการ
this.clearCache();
```

### 3. การ Debug

```typescript
// ตรวจสอบ cache
console.log("Cache keys:", Object.keys(this.cachedData));
console.log("Cache size:", Object.keys(this.cachedData).length);
```
