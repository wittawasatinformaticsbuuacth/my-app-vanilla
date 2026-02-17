# การ Deploy Vite Project ไปยัง GitHub Pages

## ต้องเตรียมอะไรก่อน

- GitHub account
- Repository สร้างไว้แล้ว
- Git ติดตั้งไว้แล้ว
- Node.js และ npm ติดตั้งไว้แล้ว
- Vite project สร้างเสร็จแล้ว

---

## ขั้นตอนที่ 1: ติดตั้ง gh-pages package

เปิด Terminal และรันคำสั่ง:

```bash
npm install --save-dev gh-pages
```

คำสั่งนี้จะติดตั้ง `gh-pages` เป็น dev dependency ซึ่งใช้หลังจาก build ส่งไปยัง GitHub

**ตรวจสอบ:** ในไฟล์ `package.json` ควรมี `gh-pages` ในหัวข้อ `devDependencies`

---

## ขั้นตอนที่ 2: ตั้งค่า package.json

เปิดไฟล์ `package.json` และเพิ่มส่วนต่อไปนี้:

### 2.1 เพิ่มฟิลด์ `homepage`

ที่ส่วนบนสุดของออบเจ็กต์หลัก (ถัดจาก `"name"` และ `"version"`):

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
  ...
}
```

**สิ่งสำคัญ:** แทนที่ข้อความต่อไปนี้:

- `YOUR_USERNAME` → ชื่อ GitHub ของคุณ (เช่น `john-doe`)
- `YOUR_REPO_NAME` → ชื่อ repository (เช่น `my-app`)

**ตัวอย่างจริง:**

```json
{
  "homepage": "https://john-doe.github.io/my-app"
}
```

### 2.2 เพิ่ม Deploy Scripts

ในหัวข้อ `"scripts"` ให้เพิ่มสองบรรทัดนี้:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    ...
  }
}
```

**อธิบาย:**

- `predeploy`: รันก่อน deploy โดยอัตโนมัติ (build โปรเจกต์ไปยัง `dist` folder)
- `deploy`: ส่งไฟล์จากโฟลเดอร์ `dist` ไปยัง GitHub (Vite ใช้ `dist` แทน `build`)

### 2.3 สร้าง vite.config.js

สร้างไฟล์ `vite.config.js` ในโฟลเดอร์ root ของโปรเจกต์:

```javascript
import { defineConfig } from "vite";

export default defineConfig({
  base: "/YOUR_REPO_NAME/",
});
```

**สิ่งสำคัญ:** แทนที่ `YOUR_REPO_NAME` ด้วยชื่อ repository ของคุณ

**ตัวอย่างจริง (ถ้า repo ชื่อ my-app-vanilla):**

```javascript
export default defineConfig({
  base: "/my-app-vanilla/",
});
```

**เหตุผล:** Vite ต้องรู้ว่า project อยู่ใน subdirectory ของ GitHub Pages เพื่อให้ assets โหลดถูกต้อง

---

## ขั้นตอนที่ 3: Push โค้ดไปยัง GitHub

ก่อน deploy ให้แน่ใจว่า commit ไฟล์ที่แก้ไข (รวม `vite.config.js` และ `package.json`) ไปยัง repository:

```bash
git add .
git commit -m "Setup Vite config for GitHub Pages"
git push origin main
```

(แทน `main` ด้วยชื่อ branch ของคุณถ้าต่างกัน)

**หมายเหตุ:** `git push` ส่ง **source code** ไปยัง `main` branch เท่านั้น ไม่ได้ deploy ขึ้นเว็บ

---

## ขั้นตอนที่ 4: Deploy ไปยัง GitHub Pages

รันคำสั่ง:

```bash
npm run deploy
```

**สิ่งที่เกิดขึ้น:**

1. npm จะรัน `predeploy` → build โปรเจกต์ไปยัง `dist` folder
2. สร้าง branch `gh-pages` โดยอัตโนมัติ (ถ้ายังไม่มี)
3. ส่งไฟล์ build ไปยัง `gh-pages` branch
4. คุณจะเห็นข้อความ "Published" เมื่อสำเร็จ

**ตัวอย่างผลลัพธ์:**

```
> gh-pages -d dist
Publishing files to gh-pages branch on github.com/your-username/my-app.git
Published
```

---

## ขั้นตอนที่ 5: ตั้งค่า GitHub Pages (บนเว็บ GitHub)

1. ไปที่ **GitHub Repository** → **Settings**
2. เลือก **Pages** จากเมนูด้านซ้าย
3. ภายใต้ **"Build and deployment"**:
   - เลือก **Source**: `Deploy from a branch`
   - เลือก **Branch**: `gh-pages`
   - เลือก **Folder**: `/ (root)`
4. คลิก **Save**

---

## ขั้นตอนที่ 6: ตรวจสอบการ Deploy

### 6.1 ในเวลาไม่กี่นาที

- เว็บไซต์จะเผยแพร่ที่: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

### 6.2 ตรวจสอบใน GitHub

- ไปที่ Repository → Settings → Pages
- คุณควรเห็น "Your site is published at..."

### 6.3 ตรวจสอบ Deployments

- Repository → Deployments → github-pages
- ควรเห็น deployment ล่าสุดเป็นสีเขียว (successful)

---

## ขั้นตอนที่ 7: Update หลังจากนี้ (Workflow ปกติ)

ทุกครั้งที่ต้องการ update เว็บไซต์:

```bash
# 1. แก้ไขไฟล์โค้ด
# (แล้ว save)

# 2. Commit และ push ไปยัง GitHub
git add .
git commit -m "Update description"
git push origin main

# 3. Deploy ไปยัง GitHub Pages
npm run deploy
```

---

## Common Issues และการแก้ไข

### ปัญหา 1: "ENOENT: no such file or directory, stat 'build'"

**สาเหตุ:** Deploy script มองหา `build` folder แต่ Vite ใช้ `dist` folder

**วิธีแก้:**

ตรวจสอบ `package.json` มี script นี้:

```json
"deploy": "gh-pages -d dist"
```

ไม่ใช่:

```json
"deploy": "gh-pages -d build"
```

### ปัญหา 2: "404 Not Found" หรือไม่แสดงเนื้อหา

**สาเหตุ:** `vite.config.js` ไม่มีหรือ base path ไม่ถูกต้อง

**วิธีแก้:**

ตรวจสอบ `vite.config.js` มีอยู่และ base path ตรงกับ repo name:

```javascript
export default defineConfig({
  base: "/my-app-vanilla/", // ต้องตรงกับชื่อ repo
});
```

### ปัญหา 3: Assets (CSS/JS/Images) ไม่โหลด

**สาเหตุ:** Base path ไม่ถูกต้อง ทำให้ browser ไม่พบ assets

**วิธีแก้:**

1. ตรวจสอบชื่อ repository ใน `vite.config.js` ให้ตรงกับ GitHub
2. ตรวจสอบว่า `base` ลงท้ายด้วย `/` (เช่น `/my-app/` ไม่ใช่ `/my-app`)
3. รัน `npm run deploy` อีกครั้ง
4. รีโหลดเว็บและเคลียร์ cache (Ctrl+Shift+R)

### ปัญหา 4: gh-pages command not found

**สาเหตุ:** โปรแกรมไม่ติดตั้ง

**วิธีแก้:**

```bash
npm install --save-dev gh-pages
```

### ปัญหา 5: Permission denied

**สาเหตุ:** ไม่มีอนุญาต push ไปยัง repository

**วิธีแก้:**

- ตรวจสอบ SSH keys หรือ Personal Access Token
- ดู: https://github.com/settings/keys

---

## ตัวอย่าง package.json ที่สมบูรณ์ (Vite Project)

```json
{
  "name": "my-app",
  "version": "0.0.0",
  "type": "module",
  "homepage": "https://wittawasatinformaticsbuuacth.github.io/my-app-vanilla",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.3.0",
    "vite": "^7.3.1"
  }
}
```

**สำคัญ:**

- `homepage`: ต้องอยู่ในรูปแบบ `https://USERNAME.github.io/REPO_NAME`
- `deploy`: งานต้องชี้ไป `dist` ไม่ใช่ `build` (Vite ใช้ `dist`)
- ต้องมี `vite.config.js` ด้วย

---

## สรุปคำสั่ง (Quick Reference)

```bash
# Step 1: ติดตั้ง gh-pages
npm install --save-dev gh-pages

# Step 2: สร้าง/แก้ไข vite.config.js
# export default defineConfig({
#   base: '/YOUR_REPO_NAME/'
# })

# Step 3: อัปเดต package.json
# - เพิ่ม "homepage" ฟิลด์
# - เพิ่ม deploy script: "deploy": "gh-pages -d dist"

# Step 4: Push โค้ด
git add .
git commit -m "Setup GitHub Pages"
git push origin main

# Step 5: Deploy
npm run deploy

# Step 6: ตั้งค่า GitHub (ด้วยเว็บ)
# → Settings → Pages → gh-pages branch

# Step 7: ตรวจสอบ
# https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
```

---

## ลิงก์ที่มีประโยชน์

- [GitHub Pages Documentation](https://pages.github.com/)
- [gh-pages npm Package](https://www.npmjs.com/package/gh-pages)
- [GitHub Settings](https://github.com/settings)

---

**สิ้นสุด!** 🎉 เว็บไซต์ของคุณควรจะ live แล้ว
