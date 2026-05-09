# 楊依依 × Google Sheets 動態網站

高端房屋銷售網站，透過 JavaScript 從 Google 試算表抓取建案資料動態渲染。
不需後端，可直接部署到 GitHub Pages。

---

## 🗂️ 檔案說明

### 主要檔案
| 檔案 | 用途 |
|------|------|
| `index.html` | **首頁** — Hero + 5 個建案卡片 + 統計 + CONTACT US + footer |
| `detail.html` | **建案詳情頁** — 完整建案介紹（從 Sheets 動態載入） |
| `styles.css` | 全站樣式（設計變數、元件、版面） |
| `data-loader.js` | Sheets 抓取與 DOM 渲染核心 |

### 備份檔
| 檔案 | 用途 |
|------|------|
| `index.legacy.html` | 上一版（CMS 風格 + data-key 的版本） |
| `index.original.html` | 原始 CMS 模板 |

---

## 🌐 網址結構

| 網址 | 顯示 |
|------|------|
| `/`、`/index.html` | 首頁（5 個建案卡片）|
| `/detail.html?id=hsyss` | 惠宇覞山 詳情頁 |
| `/detail.html?id=fjjy`  | 馥景莊園 詳情頁 |
| `/detail.html?id=yjjy`  | 御景莊園 詳情頁 |
| `/detail.html?id=djjy`  | 大景莊園 詳情頁 |
| `/detail.html?id=sjjy`  | 澍景莊園 詳情頁 |
| `/detail.html?gid=NUMBER` | 直接以分頁 gid 指定（萬用後備）|

首頁卡片會自動連到對應的 `detail.html?id=xxx`。

---

## 📊 Google Sheets 結構

每一個分頁 = 一個建案。每個分頁的格式皆為：

| A 欄（key） | B 欄（值） | C 欄（說明，僅給人看） |
|---|---|---|
| 建案案名 | 惠宇覞山 | 頁面標題大標 |
| 副標題 | 十四期正對公園｜… | 標題下方說明 |
| 基地地號 | 北屯區環中段 308 地號 | |
| 基地位置 | 崇德十六路＆昌平東七路 | |
| 規劃產品 | 三房（45）坪、四房(57坪) | |
| 基地面積 | 約 1225.01 坪 | |
| 社區規劃 | 樓高 23樓｜地下 3 層 | |
| 戶數規劃 | 88 戶住家 1 棟 | |
| 樓層高度 | 一樓5.7米，二樓以上 3.6米 | |
| 預計完工 | 預計2026年8月 | （亦相容 `預計/建築完工`）|
| 建設營造 | 惠信建設｜薰漢營造 | |
| 建築設計 | 李明哲建築師事務所 | |
| 公設 | 接待大廳、中庭花園、健身房 | 一整段文字，用「**、**」分隔每個項目，自動拆成卡片顯示 |
| 商圈 | 崇德商圈 | |
| 學區 | 仁美國小、四張犁國中 | |
| 公園綠地 | 823公園、潮春公園 | |
| 建案特色 | ▪︎112年9月近乎完銷… | 多段文字以換行分隔 |
| 360環景連結 | https://www.skypixel.com/… | 360° 按鈕連結 |
| img_1 | https://lh3.googleusercontent.com/d/xxx | 詳情頁 hero 主圖 + 首頁卡片 |
| img_2 ~ img_4 | … | 詳情頁 hero 右側 3 小圖 |
| img_5 ~ img_15 | … | 詳情頁底部圖庫 |
| img_16 | … | 詳情頁底部橫幅圖 |

> 💡 **首頁卡片**會用 `img_1` 作為代表圖、`基地位置` 自動抓「區」當地區徽章。

---

## 🖼️ 圖片用 Google Drive 的設定步驟

1. 把照片上傳到 Google Drive 任一資料夾
2. 對該照片右鍵 → **共用** → 將「一般存取權」設為「**知道連結的任何人**」
3. 點選「**複製連結**」，會得到類似：
   ```
   https://drive.google.com/file/d/1xiAxu1qdT4xqYGDf6QTIp780fUpleFdL/view
   ```
4. 把這個連結貼進試算表的 B 欄即可（程式會自動轉成 `https://lh3.googleusercontent.com/d/FILE_ID`）

也可以直接貼 `https://lh3.googleusercontent.com/d/FILE_ID` 格式（更快）。

---

## ➕ 新增建案的步驟

### 1. Google Sheets 端
1. 在試算表底部複製一個現有分頁（右鍵分頁名 → 「複製」）
2. 把分頁名改成新建案名稱
3. 修改 A、B 欄的值（C 欄是給人看的說明，可隨意改）
4. 取得新分頁的 **gid**：點該分頁，看網址 `...edit#gid=XXXXXX`，那串就是

### 2. 程式端（`data-loader.js`）
打開 `data-loader.js`，在 `SLUGS` 物件加一筆：

```js
SLUGS: {
  hsyss: { gid: '0',          name: '惠宇覞山112' },
  fjjy:  { gid: '1331822735', name: '馥景莊園' },
  yjjy:  { gid: '1343571758', name: '御景莊園' },
  djjy:  { gid: '236781261',  name: '大景莊園' },
  sjjy:  { gid: '286298041',  name: '澍景莊園' },
  // ⬇️ 新增這一行
  ntmd:  { gid: '987654321',  name: '南屯豪邸' },
},
```

存檔、推到 GitHub。新建案會自動：
- 出現在**首頁卡片**裡
- 詳情頁網址：`detail.html?id=ntmd`

> 💡 **重要**：新分頁要等 Google 重新發佈才會生效。如果剛新增的分頁 fetch 失敗，到「檔案 → 分享 → 發佈到網路」確認狀態。

---

## 📞 修改聯絡資訊（LINE / 電話 / 地址）

這些屬於**全站共用資訊**，不是每個建案不同，所以**直接寫在 HTML 裡**（不從 Sheets 讀）。

修改位置：
- `index.html` 與 `detail.html` 中搜尋 `0973005411`、`0970882260`、`@806mjhps`、`敦富路615號` 等字串並修改

---

## 🚀 部署到 GitHub Pages

1. 把整個 `房子介紹網頁/` 資料夾推到 GitHub repo
2. Repo 設定 → Pages → Source 選 `main` branch / `(root)`
3. 等 1-2 分鐘，網址：`https://你的帳號.github.io/repo名稱/`

> ⚠️ **資料夾與檔名建議全英文**（例如把 `房子介紹網頁/` 改成 `house-listing/`）避免網址出現 `%E6%88%BF...`

### 不會用到的舊檔案（可選擇性刪除）
舊版本的 CSS/JS 已經不被新頁面引用，可以刪除以節省空間：
- 各種第三方套件：`bootstrap-*`、`slick.*`、`swiper.*`、`fancybox.*`、`vue.*`、`vuelidate.*`、`aos.*`、`bsnav.*`、`animate.css`、`sweetalert2.*`、`infinite-scroll.*`、`jquery-*`、`jquery.jcarousel.*`、`popper.*`、`axios.*`、`validators.*`、`coreScript.js`、`utility.js`、`bundle.js`、`sectionsJs.js`
- 各種 font 檔：`fa-*`、`bootstrap-icons.*`、`slick.*`、`lg.*`
- 舊樣式：`style.css`、`style_rwd.css`、`editor_*.css`、`all.min.css`、`ionicons.css`、`styles?v=...`、`scripts?v=...`、`ScriptResource.axd`、`js?id=*`
- 舊 HTML：`index.legacy.html`、`index.original.html`、`index拷貝.html`

如果要保留作備份，請先測試新版正常後再刪。

---

## 🧪 本機測試

```bash
cd 房子介紹網頁
python3 -m http.server 8000
```

瀏覽器開：
- http://localhost:8000/ （首頁）
- http://localhost:8000/detail.html?id=hsyss （詳情頁）

按 **Cmd+Shift+R** 強制重新整理可清快取。

---

## 🐛 常見問題

**Q：改了試算表卻沒立刻反映？**
A：Google 對「發佈到網路」的內容有約 5 分鐘快取。等一下、或瀏覽器強制重新整理。

**Q：圖片顯示破圖？**
A：確認 Drive 那張圖的權限是「知道連結的任何人」。

**Q：新建案在首頁沒出現？**
A：檢查 `data-loader.js` 的 `SLUGS` 是否已加上新建案；新分頁是否已發佈。

**Q：詳情頁缺欄位？**
A：在試算表 A 欄加上對應的 key（例如 `公設`），B 欄填值即可。HTML 會自動抓取。

**Q：要改網站的主色（金色、咖啡色）？**
A：修改 `styles.css` 開頭的 `:root` 變數，例如 `--accent-gold` 改成想要的色號。

---

## 🎨 設計系統

| 名稱 | 色號 | 用途 |
|---|---|---|
| 米白底 | `#faf8f5` | 主背景 |
| 米色 | `#f5f0e8` | 卡片底、chip 背景 |
| 暖金 | `#c9a96e` | 主按鈕、強調 |
| 深綠 | `#4a7c5c` | 「新上架」徽章 |
| 深咖啡 | `#5d4e37` | CTA 區背景 |
| 更深 | `#443728` | 統計區、footer 背景 |

字體：標題用 **Noto Serif TC**（襯線），內文用 **Noto Sans TC**（無襯線）。
