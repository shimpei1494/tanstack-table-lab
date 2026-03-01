# CLAUDE.md - TanStack Table Lab プロジェクトルール

## プロジェクト概要

Vite + React + TypeScript + Mantine + TanStack Table の学習リポジトリ。
Step00〜Step08 のルーティングで機能を段階的に追加する教材型実装。

詳細な設計思想・各Step仕様は [plan/first_plan.md](plan/first_plan.md) を参照。
開発進捗は [plan/progress.md](plan/progress.md) で管理。

---

## 技術スタック

| 用途 | ライブラリ |
|------|-----------|
| ビルド | Vite 7 |
| UI フレームワーク | React 19 + TypeScript 5 |
| コンポーネント | Mantine v8 (`@mantine/core`, `@mantine/hooks`, `@mantine/notifications`) |
| テーブルロジック | `@tanstack/react-table` v8 |
| 仮想スクロール | `@tanstack/react-virtual` v3 (Step08) |
| ルーティング | `react-router-dom` v7 |
| Linter/Formatter | **Biome** v2 |

---

## Linter / Formatter ルール（Biome）

**ESLint・Prettier は使用しない。Biome のみ使用する。**

### コマンド

```bash
npm run lint      # biome lint .
npm run format    # biome format --write .
npm run check     # biome check --write .（lint + format 一括）
```

### コーディングスタイル（biome.json 準拠）

- **インデント**: タブ（スペース不可）
- **クォート**: ダブルクォート（`"`）
- **import 整列**: 自動（`organizeImports: on`）
- コード変更後は `npm run check` を実行してから完了とする

---

## ディレクトリ構成（守ること）

```
src/
  app/          # App.tsx, router.tsx, Shell.tsx
  features/
    step00-basic/
    step01-accessor-vs-cell/
    step02-sorting/
    step03-filtering/
    step04-pagination/
    step05-column-visibility/
    step06-row-selection/
    step07-editing/
    step08-virtual/
  components/
    DataTable/   # DataTable.tsx, DataTable.types.ts
    DebugPanel/  # DebugPanel.tsx
  data/          # types.ts, makeData.ts
  lib/
    table/       # columns.ts, fuzzy.ts(任意)
plan/            # first_plan.md, progress.md
```

---

## 設計原則（必ず守る）

### Headless 責務分離

- **各 Step**: `useReactTable()` の設定（state / row model pipeline）を担う
- **DataTable コンポーネント**: `table` instance を受け取り描画するだけ
- **データ**: React state で外部管理。TanStack Table はデータを管理しない

### TanStack Table コーディング規則

```ts
// columns は useMemo で包む（不要な再生成を防ぐ）
const columns = useMemo<ColumnDef<Person>[]>(() => [...], []);

// accessorFn を使う列は id を必ず明示
{ id: "totalPrice", accessorFn: (row) => row.price + row.tax }

// 値表示は getValue() を使う（ズレを防ぐ）
cell: ({ getValue }) => getValue()
```

### Mantine の使い方

- UIコンポーネントのみに使用
- テーブルロジックは TanStack Table に寄せる
- `Table`, `NavLink`, `Paper`, `Code`, `ScrollArea`, `Switch`, `Pagination`, `Select`, `TextInput`, `NumberInput`, `Checkbox`, `SegmentedControl` を適切に使用

---

## DataTable コンポーネント仕様

```tsx
// Props
interface DataTableProps<T> {
  table: Table<T>;
  stickyHeader?: boolean;
  striped?: boolean;
  withBorders?: boolean;
}

// 描画
// - headers: table.getHeaderGroups() → <thead>
// - rows: table.getRowModel().rows → <tbody>
// - cells: flexRender(cell.column.columnDef.cell, cell.getContext())
// - headers: flexRender(header.column.columnDef.header, header.getContext())
```

---

## DebugPanel コンポーネント仕様

以下を常時表示（ON/OFF は Mantine Switch）：

- `table.getState()` (JSON pretty)
- `table.getCoreRowModel().rows.length`
- `table.getFilteredRowModel?.().rows.length`（存在する場合）
- `table.getSortedRowModel?.().rows.length`（存在する場合）
- `table.getPrePaginationRowModel?.().rows.length`（存在する場合）
- `table.getRowModel().rows.length`

---

## 開発フロー

1. [plan/progress.md](plan/progress.md) で現在のタスクを確認
2. 実装
3. `npm run check` で Biome チェック
4. [plan/progress.md](plan/progress.md) の進捗を更新

---

## Done 条件（全 Step 完了の定義）

- Step00〜08 が動作し、左ナビで遷移可能
- 各 Step: Mantine Table 表示 + 該当機能動作 + DebugPanel で state/row counts 確認
- Step01: 「表示とソート基準のズレ」→「getValue で一致」が体験できる
- Step07: data state 更新による編集ができる
- Step08: 10,000 件でもスクロールが軽い
