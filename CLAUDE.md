# CLAUDE.md - TanStack Table Lab プロジェクトルール

## プロジェクト概要

Vite + React + TypeScript + Mantine + TanStack Table の学習リポジトリ。
Step00〜Step10 の実装が完了しており、今後は TanStack Table の機能を追加・拡張していく。

---

## 技術スタック

| 用途 | ライブラリ |
|------|-----------|
| ビルド | Vite 7 |
| UI フレームワーク | React 19 + TypeScript 5 |
| コンポーネント | Mantine v8 (`@mantine/core`, `@mantine/hooks`, `@mantine/notifications`) |
| テーブルロジック | `@tanstack/react-table` v8 |
| 仮想スクロール | `@tanstack/react-virtual` v3 |
| ルーティング | `react-router-dom` v7（HashRouter 使用） |
| Linter/Formatter | **Biome** v2 |

---

## Linter / Formatter ルール（Biome）

**ESLint・Prettier は使用しない。Biome のみ使用する。**

```bash
npm run check     # biome check --write .（lint + format 一括）
```

- **インデント**: タブ（スペース不可）
- **クォート**: ダブルクォート（`"`）
- **import 整列**: 自動（`organizeImports: on`）
- コード変更後は `npm run check` を実行してから完了とする

---

## ディレクトリ構成

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
    step09-grouping/
    step10-fullscreen/
  components/
    DataTable/   # DataTable.tsx, DataTable.types.ts
    DebugPanel/  # DebugPanel.tsx
  data/          # types.ts, makeData.ts
  lib/
    table/       # columns.ts, fuzzy.ts(任意)
plan/            # first_plan.md, progress.md
```

新しい Step を追加する場合は `src/features/stepXX-<name>/` を作成し、`router.tsx` と `Shell.tsx` のナビに追加する。

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

- UI コンポーネントのみに使用
- テーブルロジックは TanStack Table に寄せる

---

## DataTable コンポーネント仕様

```tsx
interface DataTableProps<T> {
  table: Table<T>;
  stickyHeader?: boolean;
  striped?: boolean;
  withBorders?: boolean;
}
// headers: table.getHeaderGroups() → <thead>
// rows: table.getRowModel().rows → <tbody>
// flexRender() でセル・ヘッダーを描画
```

---

## DebugPanel コンポーネント仕様

以下を常時表示（ON/OFF は Mantine Switch）：

- `table.getState()` (JSON pretty)
- `table.getCoreRowModel().rows.length`
- `table.getFilteredRowModel?.().rows.length`
- `table.getSortedRowModel?.().rows.length`
- `table.getPrePaginationRowModel?.().rows.length`
- `table.getRowModel().rows.length`

---

## 開発フロー

1. 新 Step のコンポーネントを `src/features/stepXX-<name>/` に作成
2. `router.tsx` にルートを追加
3. `Shell.tsx` のナビリンクに追加
4. `npm run check` で Biome チェック
