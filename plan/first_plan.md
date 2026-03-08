以下は **Vite + React + TypeScript + Mantine + TanStack Table** で、**ルーティングでStep分割（教材向き）**の学習リポジトリを作るために、コーディングエージェントに渡す「実装指示書」一式です。これだけで実装に入れる粒度にまとめています。

---

# TanStack Table 学習リポジトリ 実装指示書（Vite/React/TS + Mantine）

## 1. 目的 / ゴール

* TanStack Table を **“ヘッドレス（状態と計算）”**として理解する
* `getRowModel()` / row modelパイプライン / `accessorKey` vs `accessorFn` / `cell` vs `getValue()` を **挙動で腹落ち**させる
* 機能を段階的に追加する教材型（Step00〜Step08）
* UIはMantineを使い、TanStack Tableはロジックのみ（描画はMantine Table）

---

## 2. 技術スタック

* Vite + React + TypeScript
* Mantine: `@mantine/core`, `@mantine/hooks`, `@mantine/notifications`
* TanStack Table: `@tanstack/react-table`
* Virtual（Step08で追加）: `@tanstack/react-virtual`

---

## 3. セットアップ（コマンド）

```bash
npm create vite@latest tanstack-table-lab -- --template react-ts
cd tanstack-table-lab
npm i
npm i @mantine/core @mantine/hooks @mantine/notifications
npm i @tanstack/react-table
# Step08で必要（最初から入れてもOK）
npm i @tanstack/react-virtual
# routing
npm i react-router-dom
```

---

## 4. 重要な設計思想（必ず守る）

### 4.1 Headlessの責務分離

* **各Step**が `useReactTable()` の設定（state / row model pipeline）を作る
* **共通 DataTable コンポーネント**は「table instance を受け取り描画するだけ」
* データは外部（React state）で持つ。TanStack Tableはデータを管理しない

### 4.2 主要概念（学習の核）

* `accessor`：列の“値”を定義（ソート/フィルタ基準）
* `cell`：列の“表示”を定義
* `getValue()`：その列の accessor が計算した値を取得（表示もソート基準も揃えるならこれ）
* `getRowModel().rows`：現在のパイプラインを通過した **最終表示用行**
* `row.original`：元データ

---

## 5. プロジェクト構成（提案：教材型）

```
src/
  app/
    App.tsx
    router.tsx
    Shell.tsx
  features/
    step00-basic/
      Step00Basic.tsx
    step01-accessor-vs-cell/
      Step01AccessorVsCell.tsx
    step02-sorting/
      Step02Sorting.tsx
    step03-filtering/
      Step03Filtering.tsx
    step04-pagination/
      Step04Pagination.tsx
    step05-column-visibility/
      Step05ColumnVisibility.tsx
    step06-row-selection/
      Step06RowSelection.tsx
    step07-editing/
      Step07Editing.tsx
    step08-virtual/
      Step08Virtual.tsx
  components/
    DataTable/
      DataTable.tsx
      DataTable.types.ts
    DebugPanel/
      DebugPanel.tsx
  data/
    types.ts
    makeData.ts
  lib/
    table/
      columns.ts
      fuzzy.ts (任意)
```

---

## 6. 画面仕様（ルーティング）

### 6.1 ルート一覧

* `/`：トップ（Step一覧）
* `/step/00`〜`/step/08`：各Step

### 6.2 Shell

* 左：Stepナビ（Mantine `NavLink`）
* 右：コンテンツ（各Step）
* 右下 or 右サイド：DebugPanel（固定表示、ON/OFF可）

---

## 7. 共通コンポーネント仕様

## 7.1 DataTable（重要：描画専用）

### Props

* `table: Table<T>`
* optional: `stickyHeader?: boolean`, `striped?: boolean`, `withBorders?: boolean`

### 描画

* headers: `table.getHeaderGroups()` を使って `<thead>`
* rows: `table.getRowModel().rows` を使って `<tbody>`
* cells: `row.getVisibleCells()` を `flexRender(cell.column.columnDef.cell, cell.getContext())` で描画
* headerも `flexRender(header.column.columnDef.header, header.getContext())`
* ソートUIなどは Step側で `header.column.getToggleSortingHandler()` を使って組み込み（DataTableは汎用化するならオプションで対応可）

※ Mantine `Table` を使用、UI装飾はMantineに寄せる

---

## 7.2 DebugPanel（学習効率最大化）

表示内容：

* `table.getState()`（JSON pretty）
* row counts:

  * `table.getCoreRowModel().rows.length`
  * `table.getFilteredRowModel?.().rows.length`（存在すれば）
  * `table.getSortedRowModel?.().rows.length`（存在すれば）
  * `table.getPrePaginationRowModel?.().rows.length`（存在すれば）
  * `table.getRowModel().rows.length`
* “現在有効な機能” も表示すると良い（sorting/filter/pagination等）

UI：Mantine `Paper` + `Code` + `ScrollArea`
ON/OFF：Mantine `Switch`

---

## 8. データ仕様（学習向けのサンプル）

`src/data/types.ts`

```ts
export type Status = "active" | "inactive" | "pending";

export type Person = {
  id: string;
  name: string;
  age: number;
  price: number;
  tax: number;
  status: Status;
  createdAt: string; // ISO
};
```

`src/data/makeData.ts`

* 50件（virtual用に 10,000件生成も可能な関数も用意）
* `price` と `tax` は税込列（price+tax）の学習で使う
* `status` は filter/select で使う

---

## 9. Step設計（学習カリキュラム + 要件）

## Step00: Basic（最小表示）

目的：

* table instance と Mantine Table の接続
* `getRowModel()` は最終表示行

要件：

* `useReactTable({ data, columns, getCoreRowModel })`
* columnsは `accessorKey` だけの簡単なもの
* DataTableで表示
* DebugPanel表示

---

## Step01: Accessor vs Cell（ズレを体験）

目的：

* `accessorFn` の値がソート/フィルタ基準
* `cell` は表示だけ
* `getValue()` を使うと一致する

要件：

* 「税込価格」列:

  * `accessorFn: row => row.price + row.tax`
* 表示切替（Mantine `SegmentedControl`）

  * Mode A（ズレる）：`cell: ({ row }) => row.original.price`（税抜表示）
  * Mode B（揃える）：`cell: ({ getValue }) => getValue()`（税込表示）
* 説明文をUI上に表示（ズレの概念）

---

## Step02: Sorting（row model pipeline体感）

目的：

* `getSortedRowModel()` を入れる/入れないで挙動が変わる
* sorting stateは table state

要件：

* sorting state（controlled）

  * `const [sorting, setSorting] = useState<SortingState>([])`
  * `state: { sorting }`, `onSortingChange: setSorting`
* `getSortedRowModel: getSortedRowModel()`
* ヘッダークリックでソート
* ソート状態アイコン表示（▲▼など）

追加：Switchで `getSortedRowModel` を無効化できると学習効果高い

---

## Step03: Filtering（columnFilters / globalFilter）

目的：

* フィルタ state と filtered row model の関係理解

要件：

* `columnFilters` state + `getFilteredRowModel`
* name: TextInputフィルタ
* status: Selectフィルタ
* (任意) global filter も追加

---

## Step04: Pagination（クライアントページング）

目的：

* `getPaginationRowModel` / `pagination` state

要件：

* `pagination` state（pageIndex, pageSize）
* Mantine `Pagination` + `Select(pageSize)`
* `table.getRowModel().rows` がページ分だけになることをDebugPanelで確認

---

## Step05: Column Visibility

目的：

* `row.getVisibleCells()` の意味を体感

要件：

* `columnVisibility` state
* Mantine Checkbox listで列ON/OFF
* 表示列が変わることを確認

---

## Step06: Row Selection

目的：

* `rowSelection` state / selected row model

要件：

* `rowSelection` state
* 先頭にチェックボックス列（display column）

  * ヘッダーで全選択
* 選択件数を表示
* `table.getSelectedRowModel().rows` をDebugPanelにも表示

---

## Step07: Editing（外部state更新）

目的：

* 編集は `row.original` を直接書き換えない
* dataをReact state更新する

要件：

* `const [data, setData] = useState<Person[]>(makeData(...))`
* `meta: { updateData }` を table options に渡すパターン

  * `updateData(rowIndex, columnId, value)`
* `cell` で Mantine `TextInput/NumberInput` を使い編集
* 変更が data に反映され、再レンダリングで更新されることを確認

---

## Step08: Virtual（大量データ）

目的：

* Tableの計算（row model）と描画最適化（virtual）を分離理解

要件：

* 10,000件生成
* `@tanstack/react-virtual` で rows を virtualization
* Mantine `ScrollArea` を使い、表示領域を固定高さに
* row model は通常通り `table.getRowModel().rows` を参照し、表示部分だけvirtualize

---

## Step09: Grouping + Expanding（グループ化と開閉）

目的：

* `getGroupedRowModel()` / `getExpandedRowModel()` の role を理解する
* グループ行と子行の構造（GroupedRow / LeafRow）の違いを体感する
* 集計値（aggregationFn）がどの時点で計算されるかを確認する

要件：

* グルーピング対象：`status` 列 **1列のみ** に限定
  * `grouping` state は `["status"]` で固定（UIから変更不可）
  * `enableGrouping: true` は `status` 列のみ設定
* `expanded` state（controlled）
  * `ExpandedState` / `onExpandedChange`
* row model 設定：
  ```ts
  getGroupedRowModel: getGroupedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  ```
* グループ行の表示：
  * 行頭に展開/折りたたみボタン（`row.getToggleExpandedHandler()`）
  * `row.getIsGrouped()` で判定し、グループ行のみ展開ボタンを表示
  * グループ行：`status` 値と子行件数を表示（`row.subRows.length`）
  * 子行：通常のデータ行として表示（インデント付き）
* 集計列：`age` 列に `aggregationFn: "mean"` を設定し平均年齢を表示
  * グループ行では集計値（平均）、子行では個別値を表示
* 「全展開 / 全折りたたみ」ボタン（`table.toggleAllRowsExpanded()`）
* DebugPanel：`expanded` state と `getGroupedRowModel().rows.length` を追加表示

---

## Step10: Fullscreen Table（全画面表示）

目的：

* TanStack Table はロジック担当、全画面演出は UI 側の責務であることを体感する
* Mantine の `useFullscreen` フックを使ったブラウザ Fullscreen API の活用
* DataTable コンポーネントを変更せずに全画面対応できることを確認する

要件：

* Mantine `useFullscreen` フック（`@mantine/hooks`）を使用
  ```ts
  const { ref, toggle, fullscreen } = useFullscreen();
  ```
* 全画面トグルボタン（Mantine `ActionIcon` または `Button`）
  * ボタンアイコン：全画面時は「縮小」、通常時は「拡大」（Mantine Tabler アイコン）
  * `ref` を表示コンテナ（Paper や div）に付与することで、テーブル部分のみ全画面化
* 全画面時の表示調整：
  * コンテナに `height: fullscreen ? "100vh" : "auto"` などの動的スタイルを適用
  * `stickyHeader` を全画面時に有効にする（DataTable の prop 活用）
  * 背景色を Mantine `theme.colors` に合わせる（ダークモード対応の意識）
* 通常表示：Step08 と同様に 1,000 件程度のデータで DataTable を表示
* DebugPanel は全画面時には非表示（全画面 UI の邪魔にならないよう）
  * `fullscreen` フラグで制御

---

## 10. 実装上の注意（重要）

* columns は `useMemo` 推奨（不要な再生成を避ける）
* `accessorFn` を使う列は `id` を明示（例：`id: "totalPrice"`）
  → ソート/フィルタ/編集対象の識別が安定
* `cell` で派生値を表示する場合は基本 `getValue()` を使う（ズレを避ける）
* Editing Stepは **rowIndex** を使う方法と **idで更新**する方法がある

  * 学習用はrowIndexでも良いが、実務寄りなら `id` 更新を推奨
* DebugPanelの存在が学習価値を決めるので必須（ON/OFF可）
* MantineはUIのみ。tableのロジックは TanStack に寄せる

---

## 11. Done条件（完成の定義）

* Step00〜10が動作し、左ナビで遷移可能
* 各Stepで：

  * Mantine Table表示
  * 該当Stepの機能が動く
  * DebugPanelで state と row counts が確認できる
* Step01で「表示とソート基準のズレ」→「getValueで一致」が体験できる
* Step07で data state更新による編集ができる
* Step08で 10,000件でもスクロールが軽い
* Step09で `status` 列グルーピングの展開/折りたたみと平均年齢の集計が動く
* Step10で全画面ボタンクリックでテーブルが全画面表示され、戻せる

---

## 12. 追加（任意だが推奨）

* `README.md` に以下を記載

  * TanStack Tableの責務（headless）
  * accessor/cell/getValue/getRowModelの要点
  * 各Stepの学習目標
* 各Step画面に “今日の学び” セクション（箇条書き）を表示すると教材として強い

---

この指示書どおりに作れば、あなたがここまで会話で掴んだ概念（`accessor` vs `cell`, `getValue()`, `getRowModel()`）を **実際の挙動で確認しながら**体系的に学べる教材リポジトリになります。
