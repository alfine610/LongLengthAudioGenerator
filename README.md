# 🎵 音声ループ生成アプリ

## アプリケーション概要

**BGM等の音声ファイルからループ区間（繰り返し区間）を直感的に特定し、その範囲をN回繰り返して長尺の音声ファイルを生成できるWeb1. ✅ **Phase 1**: FFmpeg.wasm統合・音声処理基盤（完了）
2. 🔧 **Phase 2**: 波形表示・UI構築（修正が必要）
3. ⏳ **Phase 3**: 自動ループポイント検出（実装中）
4. 📋 **Phase 4**: UI/UX改善・追加機能

### 実装済み機能詳細

- **音声ファイル処理**: 複数形式対応、リアルタイムプログレス表示
- **FFmpeg.wasm統合**: 高品質なループ・切り出し処理（完全動作）
- **UI基盤**: Material-UI、基本的なコンポーネント構造
- **エラーハンドリング**: 詳細なエラー表示・ユーザーフィードバック

### 修正が必要な機能

- **波形表示**: wavesurfer.js初期化・レンダリング問題
- **区間選択**: 波形表示修正後に復旧予定
- **音声再生**: 波形表示修正後に復旧予定## ✅ 現在利用可能な機能

- **多形式音声ファイル対応** - MP3, WAV, OGG, M4A
- **FFmpeg.wasm統合** - ブラウザ内音声処理（高品質なループ音源作成・区間切り出し）
- **ループ音源生成** - 区間をN回繰り返したファイル作成・ダウンロード
- **区間切り出し** - 選択範囲のみの抽出機能
- **プログレス表示** - 処理進行状況のリアルタイム表示
- **ループ回数設定** - 1〜100回のスライダー設定

### 🔧 現在修正が必要な機能

- **波形表示** - wavesurfer.js初期化に問題があり表示されません
- **区間選択** - 波形表示問題により選択操作ができません
- **プレビュー再生** - 波形表示問題により再生機能が動作しません
- **キーボードショートカット** - 上記機能の不具合により機能しません

### 🔄 開発中の機能

- ⏳ 自動ループポイント検出（Web Audio API + 相関解析）
- ⏳ フェードイン/アウト効果
- ⏳ 数値入力による精密な区間指定

---

## セットアップ

1. リポジトリをクローン
```bash
git clone <このリポジトリのURL>
cd <リポジトリディレクトリ名>
```
2. パッケージのインストール
```bash
npm install
```
3. 開発サーバーの起動
```bash
npm run dev
```

アプリケーションは http://localhost:5173 で起動します。

## 使用方法

### ⚠️ 現在の制限事項
波形表示機能に問題があるため、現在は以下の制限があります：
- 音声ファイルをアップロードできますが、波形は表示されません
- 区間選択ができないため、ループ生成機能は使用できません
- プレビュー再生機能は動作しません

### 使用方法（修正後）
1. 「音声ファイルを選択」ボタンで音声ファイルをアップロード
2. 波形が表示されたら、ループしたい区間をドラッグで選択
3. 「選択区間を再生」ボタンで区間の確認
4. スライダーでループ回数を設定（1〜100回）
5. 「ループ音源を生成」ボタンで長尺音源を作成・ダウンロード
6. または「選択区間のみ切り出し」で範囲抽出も可能

### ⚡ ショートカットキー（修正後利用可能）
- **スペース**: 再生/一時停止
- **Ctrl + Enter**: ループ音源生成

---

## 技術スタック

- **Vite** - 高速なビルドツール
- **React + TypeScript** - モダンなフロントエンド
- **MUI (Material-UI)** - デザインシステム
- **wavesurfer.js** - 波形表示・区間選択
- **[FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)** - ブラウザ内音声処理（公式実装）

### FFmpeg.wasm について

本アプリケーションは[ffmpegwasm/ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)の公式実装を使用し、ESMディストリビューションで最適化されています。

#### ブラウザ要件
- **SharedArrayBuffer** サポート必須
- **Cross-Origin Isolation** 環境が必要
- **HTTPS** または **localhost** でのみ動作

#### 対応ブラウザ
- ✅ Chrome 88+ (推奨)
- ✅ Firefox 79+
- ✅ Safari 15.2+
- ✅ Edge 79+

---

## 開発方針

### 開発ロードマップ

1. ✅ **Phase 1**: 波形表示・UI構築
2. ✅ **Phase 2**: 音声処理機能の実装 **（完了）**
3. � **Phase 3**: 自動ループポイント検出（実装中）
4. 📋 **Phase 4**: UI/UX改善・追加機能

### 実装済み機能詳細

- **音声ファイル処理**: 複数形式対応、リアルタイムプログレス表示
- **波形表示**: 高解像度波形、直感的な区間選択
- **音声生成**: FFmpeg.wasmによる高品質なループ・切り出し処理
- **UI/UX**: Material-UI、キーボードショートカット、詳細フィードバック

---

## ブラウザ対応状況

- **Chrome**: ⚠️ 部分対応（FFmpeg動作、波形表示に問題）
- **Firefox**: ⚠️ 部分対応（FFmpeg動作、波形表示に問題）
- **Safari**: ⚠️ 部分対応（FFmpeg動作、波形表示に問題）
- **Edge**: ⚠️ 部分対応（FFmpeg動作、波形表示に問題）

### 動作状況
- ✅ ファイルアップロード
- ✅ FFmpeg.wasm音声処理
- ❌ 波形表示（wavesurfer.js問題）
- ❌ 区間選択・再生機能

---

## コントリビューション

設計仕様書（docs/design_spec.md）やinstructions.mdを参照の上、Issue・PRを歓迎します。

---

## 技術スタック

- **Vite** - 高速なビルドツール
- **React + TypeScript** - モダンなフロントエンド
- **MUI (Material-UI)** - デザインシステム
- **wavesurfer.js** - 波形表示・区間選択（※現在修正が必要）
- **ffmpeg.wasm** - MP3編集・生成（動作確認済み）
- **Web Audio API** - 波形データ取得・解析（予定）

---

## ディレクトリ構成

```
.
├── README.md
├── instructions.md
├── docs/
│   └── design_spec.md
├── src/
│   ├── App.tsx          # メインアプリケーション
│   └── main.tsx         # エントリーポイント
├── package.json         # 依存関係定義
├── vite.config.ts       # Vite設定
├── tsconfig.json        # TypeScript設定
└── index.html           # HTMLテンプレート
```

---

## 開発方針

- まずはシンプルな実装で機能を形にし、必要に応じて柔軟に改良
- コア機能（アップロード・波形表示・区間選択・ループ生成）を優先
- 類似区間自動検出やUI拡張は段階的に追加

現在は波形表示の修正が最優先事項です。
