[Imgur](http://i.imgur.com/udCH9uT.png)

# install, config, run

- `npm install`
- 複製 __values.js.template__，並改名為 __values.js__
- edit __values.js__
- `node index.js`

---

# CSV_IN

CSV_IN需要有header, 並在 values.js 的 CSV_ADDR 指定地址的欄位名稱

我的小夥伴們可以在[這裡](https://drive.google.com/file/d/0B4IX72YRF3DxaTdkMlh6bHRiNmM/view?usp=sharing)下載CSV

---

## @TODO

- 增加DEMO用地址CSV
- 改成用stream的方式，才可以處理超大量資料
- 錯誤處理
  - 錯誤訊息
  - 錯誤項目
