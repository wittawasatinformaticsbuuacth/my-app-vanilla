# การ Deploy ไปยัง GitHub Pages

## ต้องเตรียมอะไรก่อน

- GitHub account
- Repository สร้างไว้แล้ว
- Git ติดตั้งไว้แล้ว
- Node.js และ npm ติดตั้งไว้แล้ว

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
    "start": "react-scripts start",
    "build": "react-scripts build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    ...
  }
}
```

**อธิบาย:**

- `predeploy`: รันก่อน deploy โดยอัตโนมัติ (build โปรเจกต์)
- `deploy`: ส่งไฟล์จากโฟลเดอร์ `build` ไปยัง GitHub

---

## ขั้นตอนที่ 3: Push โค้ดไปยัง GitHub

ก่อน deploy ให้แน่ใจว่า commit code ไปยัง repository แล้ว:

```bash
git add .
git commit -m "Prepare for GitHub Pages deployment"
git push origin main
```

(แทน `main` ด้วยชื่อ branch ของคุณถ้าต่างกัน)

---

## ขั้นตอนที่ 4: Deploy ไปยัง GitHub Pages

รันคำสั่ง:

```bash
npm run deploy
```

**สิ่งที่เกิดขึ้น:**

1. npm จะรัน `predeploy` → build โปรเจกต์
2. สร้าง branch `gh-pages` โดยอัตโนมัติ (ถ้ายังไม่มี)
3. ส่งไฟล์ build ไปยัง `gh-pages` branch
4. คุณจะเห็นข้อความ "Published" เมื่อสำเร็จ

**ตัวอย่างผลลัพธ์:**

```
> gh-pages -d build
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

### ปัญหา 1: "404 Not Found"

**สาเหตุ:** โฟลเดอร์ปลายทาง URL ไม่ถูกต้อง

**วิธีแก้:**

- ตรวจสอบ `homepage` ใน `package.json` ตรงกับ URL หรือไม่
- ตรวจสอบ branch `gh-pages` มี build files หรือไม่

```bash
# ลองดูว่ามี gh-pages branch หรือไม่
git branch -r
```

### ปัญหา 2: CSS/Images ไม่โหลด

**สาเหตุ:** Path ไม่ถูกต้อง (relative path)

**วิธีแก้:**

- ใชญ์ `%PUBLIC_URL%` ต่อหน้า path ในไฟล์ HTML
- ตัวอย่าง: `<link rel="icon" href="%PUBLIC_URL%/favicon.ico">`

### ปัญหา 3: gh-pages command not found

**สาเหตุ:** โปรแกรมไม่ติดตั้ง

**วิธีแก้:**

```bash
npm install --save-dev gh-pages
```

### ปัญหา 4: Permission denied

**สาเหตุ:** ไม่มีอนุญาต push ไปยัง repository

**วิธีแก้:**

- ตรวจสอบ SSH keys หรือ Personal Access Token
- ดู: https://github.com/settings/keys

---

## ตัวอย่าง package.json ที่สมบูรณ์

```json
{
  "name": "my-app",
  "version": "0.1.0",
  "homepage": "https://john-doe.github.io/my-app",
  "private": true,
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    "test": "react-scripts test"
  },
  "devDependencies": {
    "gh-pages": "^4.0.0"
  }
}
```

---

## สรุปคำสั่ง (Quick Reference)

```bash
# Step 1: ติดตั้ง
npm install --save-dev gh-pages

# Step 2: แก้ไข package.json (ตามด้านบน)

# Step 3: Push โค้ด
git add .
git commit -m "Setup GitHub Pages"
git push origin main

# Step 4: Deploy
npm run deploy

# Step 5: ตั้งค่า GitHub (ด้วยเว็บ)
# → Settings → Pages → gh-pages branch

# Step 6: ตรวจสอบ
# https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
```

---

## ลิงก์ที่มีประโยชน์

- [GitHub Pages Documentation](https://pages.github.com/)
- [gh-pages npm Package](https://www.npmjs.com/package/gh-pages)
- [GitHub Settings](https://github.com/settings)

---

**สิ้นสุด!** 🎉 เว็บไซต์ของคุณควรจะ live แล้ว
