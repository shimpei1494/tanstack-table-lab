# TanStack Table Lab - 開発進捗

## ステータス凡例

- ✅ 完了
- 🔄 進行中
- ⬜ 未着手
- ⏸️ 保留

---

## セットアップ

| タスク | ステータス | 備考 |
|--------|-----------|------|
| `npm create vite` でプロジェクト作成 | ✅ | |
| `npm i`（全ライブラリ）| ✅ | Mantine, TanStack Table/Virtual, react-router-dom |
| Biome 導入・設定 | ✅ | `biome.json` 設定済み |
| CLAUDE.md 作成 | ✅ | プロジェクトルール記載 |
| `src/app/` 基盤（App/router/Shell/TopPage）| ✅ | |
| `src/data/types.ts` 作成 | ✅ | Person 型定義 |
| `src/data/makeData.ts` 作成 | ✅ | 50件・10,000件生成関数 |
| `DataTable` コンポーネント作成 | ✅ | |
| `DebugPanel` コンポーネント作成 | ✅ | |

---

## Step 実装

| Step | 内容 | ステータス | 備考 |
|------|------|-----------|------|
| Step00 | Basic（最小表示） | ✅ | |
| Step01 | Accessor vs Cell（ズレ体験） | ✅ | |
| Step02 | Sorting（row model pipeline） | ⬜ | スタブのみ |
| Step03 | Filtering（columnFilters / globalFilter） | ⬜ | スタブのみ |
| Step04 | Pagination（クライアントページング） | ⬜ | スタブのみ |
| Step05 | Column Visibility | ⬜ | スタブのみ |
| Step06 | Row Selection | ⬜ | スタブのみ |
| Step07 | Editing（外部 state 更新） | ⬜ | スタブのみ |
| Step08 | Virtual（大量データ仮想スクロール） | ⬜ | スタブのみ |

---

## 現在のタスク

**次にやること**: Step02 Sorting の実装

---

## 実装メモ・気づき

- Biome の `noNonNullAssertion` ルールのため、`document.getElementById("root")` は null チェックに変更
- Biome の import 整列により、CSS side-effect import → 外部パッケージ → 内部モジュールの順になる

---

## 参照

- 設計仕様: [first_plan.md](first_plan.md)
- プロジェクトルール: [../CLAUDE.md](../CLAUDE.md)
