# TanStack Table Lab

TanStack Table v8 の機能を段階的に学ぶための学習用リポジトリ。
Step00 〜 Step10 の構成で、各 Step に対応する機能を実装して体験できます。

**デモ**: https://shimpei1494.github.io/tanstack-table-lab/#/

---

## 学習コンテンツ

| Step | テーマ |
|------|--------|
| Step00 | 基本的なテーブル表示 |
| Step01 | accessorKey vs accessorFn（表示とソート基準のズレを理解） |
| Step02 | ソート |
| Step03 | フィルタリング |
| Step04 | ページネーション |
| Step05 | 列の表示/非表示 |
| Step06 | 行選択 |
| Step07 | インライン編集 |
| Step08 | 仮想スクロール（10,000件） |
| Step09 | グルーピング |
| Step10 | フルスクリーン |

---

## 技術スタック

| 用途 | ライブラリ | バージョン |
|------|-----------|-----------|
| ビルド | Vite | ^7.3.1 |
| UI フレームワーク | React | ^19.2.0 |
| 言語 | TypeScript | ~5.9.3 |
| コンポーネント | Mantine | ^8.3.15 |
| テーブルロジック | @tanstack/react-table | ^8.21.3 |
| 仮想スクロール | @tanstack/react-virtual | ^3.13.19 |
| ルーティング | react-router-dom | ^7.13.1 |
| Linter / Formatter | Biome | 2.4.4 |

---

## セットアップ・起動

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

---

## その他のコマンド

```bash
# ビルド
npm run build

# Lint + Format（Biome）
npm run check
```
