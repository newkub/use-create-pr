---
name: use-create-pr
description: สร้าง PR พร้อม template, test cases, screenshots, และ preview links
argument-hint: "[scope]"
related:
  - create-github-pr
  - capture-terminal
  - record-video-terminal
  - run-check
  - run-test
  - open-github-pr
  - git-push
---

## Goal

สร้าง pull request สำหรับ feature ทีมี UX/UI เปลี่ยนแปลง โดย PR body มี template, test cases accordion, annotated screenshots (1 รูปต่อ 1 test case) และ staging preview links

## Scope

ใช้เมื่อ:

- PR มีหลาย feature ทีต้องอธิบาย UX/UI
- ต้องการให้ reviewer เห็นว่าแก้ตรงไหน ในรูปแบบ annotated screenshot
- ต้องการให้ test cases อยู่ใน accordion
- ต้องการใส่ staging preview link สำหรับแต่ละ test case

## Execute

### 0. Setup

> Goal: ตรวจสอบ environment สำหรับสร้าง PR

1. ตรวจสอบ git: `git --version`
2. ตรวจสอบ `gh` CLI: `gh --version`
3. ถ้ายังไม่มี `gh`:
   - `mise use -g gh`
   - หรือ `brew install gh` / `winget install --id GitHub.cli`
4. Login: `gh auth login` แล้ว verify `gh auth status`
5. ตรวจสอบ remote: `git remote -v` ต้องมี origin
6. ถ้าใช้ `bunx` สำหรับ screenshots/scripts → `bun --version`

### 1. Prepare

> Goal: เตรียม Prepare
1. ตรวจสอบว่าอยู่ใน branch ทีถูกต้อง ไม่ใช่ `main`
2. รัน `git status --short` ดูไฟล์ทีเปลี่ยน
3. รัน `/git-commit` ถ้ามี uncommitted changes
4. รัน `git log --oneline main..HEAD` เพื่อหา feature

### 2. Identify Test Cases

> Goal: แต่ละ feature ต้องมี test cases ชัดเจน

1. อ่าน commits และ diff
2. แตก test cases ให้ละเอียด เช่น "Open docs homepage and see hero" แทน "docs build passes"
3. ตรวจสอบว่ามีรูปหรือหลักฐานจริงสำหรับแต่ละ test case
4. กำหนด staging preview URL สำหรับแต่ละ test case (ถ้ามี)

### 3. Capture Or Build Source Images

> Goal: ได้ source ภาพจริงก่อน annotate

1. ถ้าเป็น UI:
   - รัน dev server หรือ staging preview
   - ใช้ `browser_preview` หรือ `bunx playwright screenshot` capture หน้าจอ
   - ใช้ viewport `1280x720`
2. ถ้าเป็น terminal:
   - ใช้ `capture-terminal` หรือ `record-video-terminal`
   - รัน test/build/lint เฉพาะ test case
3. บันทึก source ภาพลง `docs/screenshots/<release>/source/`

### 4. Annotate Screenshots

> Goal: ทำรูปชี้จุดทีแก้ พร้อมข้อความ

1. ใช้ `src/annotate.ts` ใน skill นี้:
   ```bash
   bunx tsx src/annotate.ts --config homepage-hero.json
   ```
2. `config` (JSON) ระบุ:
   - `input`: รูปต้นฉบับ
   - `output`: รูปผลลัพธ์
   - `annotations`: array ของ `text`, `arrow`, `box`
3. สคริปต์จะสร้าง HTML แล้วเรียก `bunx --bun playwright screenshot` โดยอัตโนมัติ
4. หรือใช้ `src/pr-body.ts` สร้าง PR body จาก JSON
5. ตรวจสอบรูปผลลัพธ์ก่อนใช้

### 5. Build PR Body

> Goal: สร้าง PR body ตาม template

ใช้ `src/pr-body.ts` หรือเขียน markdown ตามโครงสร้างนี้:

```markdown
## Feature Summary

| No. | Feature | Status | Evidence |
|---|---|---|---|
| 1 | Docs migration to VitePress | Ready | [Screenshots](#feature-docs-migration-to-vitepress) |

---

## Feature: <name>

### Description
[อธิบาย feature สั้นๆ]

### Test Cases

<details>
<summary>Test case 1: Open docs homepage and see hero, nav, and feature cards</summary>

- Preview: [Open local docs preview](http://localhost:4173) (replace with staging URL)
- Evidence:

![docs homepage annotated](<url>)

</details>

<details>
<summary>Test case 2: Navigate to /policies/terms and see Terms of Service</summary>

- Preview: [Open terms page](http://localhost:4173/policies/terms)
- Evidence:

![docs terms annotated](<url>)

</details>
```

ข้อกำหนด:

- 1 test case = 1 `<details>`
- แต่ละ test case ต้องมี staging preview link (ไม่ใช่รูปทีกดได้)
- ใส่รูป annotate ภายใน `<details>`
- ถ้าไม่มี staging ให้ใส่ local preview URL พร้อม note ให้ reviewer ทราบ

### 6. Create Or Edit PR

1. รัน `/git-push`
2. รัน `gh pr create --title "..." --body-file pr-body.md --base main`
3. หรือ `gh pr edit <number> --body-file pr-body.md`
4. เปิด PR ใน browser ตรวจสอบ accordion, รูป, และ link

## Rules

- 1 test case ต้องมี 1 รูป annotate อย่างน้อย
- ห้ามใช้ mockup/placeholder/AI-generated image
- ลูกศรและข้อความต้องชี้ตรงจุดที feature เปลี่ยน
- staging preview link ต้องใส่แยกจากรูป ไม่ใช่ให้รูปเป็น link
- ใช้ `<details>` สำหรับ accordion
- ถ้าไม่สามารถ capture UI ได้ ให้ใช้ terminal screenshot พร้อม note
- สำหรับ private repo ใช้ release assets หรือ GitHub attachments เพื่อให้รูปแสดงได้

- ใช้ /create-github-pr ถ้าจำเป็น
- ใช้ /run-check ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /open-github-pr ถ้าจำเป็น

## Expected Outcome

- PR body มี feature summary table
- แต่ละ feature มี test cases ใน accordion
- แต่ละ test case มี staging preview link + annotated image
- Reviewer เห็นว่าแก้ตรงไหนโดยไม่ต้องเปิด code
- ไม่มี placeholder หรือ mockup

