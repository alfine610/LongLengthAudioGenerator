# MP3波形ループ生成アプリ（プレビュー版）

## アプリケーション概要

本アプリケーションは、**BGM等のMP3音源からループ区間（繰り返し区間）を直感的に特定し、その範囲をN回繰り返して長尺のMP3耐久音源を生成できるWebアプリ**です。  

**現在はプレビュー版として、波形表示・区間選択・プレビュー再生機能を提供しています。**

### 現在利用可能な機能

- ✅ MP3ファイルのアップロード
- ✅ wavesurfer.jsによる高品質な波形表示
- ✅ ドラッグ可能なループ区間選択
- ✅ 選択区間のプレビュー再生
- ✅ ループ回数の設定（UI表示）
- ⏳ 音声処理機能（開発中）
- ⏳ 自動ループポイント検出（準備中）

### 開発中の機能

- ffmpeg.wasmによるループ音源生成
- 生成したMP3のダウンロード
- 選択区間のみの切り出し機能

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

1. 「MP3ファイルを選択」ボタンでMP3ファイルをアップロード
2. 波形が表示されたら、ループしたい区間をドラッグで選択
3. 「選択区間を再生」ボタンで区間の確認が可能
4. スライダーでループ回数を設定（現在は表示のみ）

---

## 技術スタック

- **Vite** - 高速なビルドツール
- **React + TypeScript** - モダンなフロントエンド
- **MUI (Material-UI)** - デザインシステム
- **wavesurfer.js** - 波形表示・区間選択
- **[FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)** - ブラウザ内音声処理（公式実装）

### FFmpeg.wasm について

本アプリケーションは[ffmpegwasm/ffmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm)の公式実装を使用しています。

#### ブラウザ要件
- **SharedArrayBuffer** サポート必須
- **Cross-Origin Isolation** 環境が必要
- **HTTPS** または **localhost** でのみ動作

#### 対応ブラウザ
- Chrome 68+ (推奨: Chrome 88+)
- Firefox 79+
- Safari 15.2+
- Edge 79+

---

## 開発方針

現在、ブラウザ互換性の問題により音声処理機能を一時的に無効化し、まずは波形表示とUI部分を安定化させています。

### 開発ロードマップ

1. ✅ **Phase 1**: 波形表示・UI構築（現在）
2. 🔄 **Phase 2**: 音声処理機能の実装
3. 📋 **Phase 3**: 自動ループポイント検出
4. 🎨 **Phase 4**: UI/UX改善

---

## ブラウザ対応状況

- **Chrome**: 波形表示・再生 ✅
- **Firefox**: 波形表示・再生 ✅  
- **Safari**: 波形表示・再生 ✅
- **Edge**: 波形表示・再生 ✅

音声処理機能は今後のアップデートで段階的に追加予定です。

---

## コントリビューション

設計仕様書（docs/design_spec.md）やinstructions.mdを参照の上、Issue・PRを歓迎します。

---

## 技術スタック

- **Vite** - 高速なビルドツール
- **React + TypeScript** - モダンなフロントエンド
- **MUI (Material-UI)** - デザインシステム
- **wavesurfer.js** - 波形表示・区間選択
- **ffmpeg.wasm** - MP3編集・生成
- **Web Audio API** - 波形データ取得・解析

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

---

## コントリビューション

設計仕様書（docs/design_spec.md）やinstructions.mdを参照の上、Issue・PRを歓迎します。

---

## 技術スタック

- React
- MUI (Material-UI)
- wavesurfer.js（波形表示・区間選択）
- ffmpeg.wasm（MP3編集・生成）
- Web Audio API（波形データ取得・解析）
- TypeScript（推奨）

---

## ディレクトリ構成（例）

```
.
├── README.md
├── instructions.md
├── docs/
│   └── design_spec.md
├── src/
│   ├── components/
│   ├── pages/
│   └── App.tsx
└── package.json
```

---

## 開発方針

- まずはシンプルな実装で機能を形にし、必要に応じて柔軟に改良
- コア機能（アップロード・波形表示・区間選択・ループ生成）を優先
- 類似区間自動検出やUI拡張は段階的に追加

---

## コントリビューション

設計仕様書（docs/design_spec.md）やinstructions.mdを参照の上、Issue・PRを歓迎します。
