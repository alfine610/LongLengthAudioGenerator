# 🎵 音声ループ生成アプリ - 使用方法 & 開発ガイド

---

## 1. 概要

本アプリケーションは、BGMや音楽ファイルから**ループ区間（繰り返し区間）を視覚的に選択し、その範囲をN回繰り返して長尺音声ファイルを生成できるWebアプリケーション**です。

### ✨ 現在利用可能な機能
- **多形式対応**: MP3, WAV, OGG, M4A
- **音声処理**: FFmpeg.wasmによるブラウザ内ループ・切り出し処理
- **プログレス表示**: リアルタイム処理状況表示
- **ファイル管理**: 生成音源の自動ダウンロード

### 🔧 修正が必要な機能
- **波形表示**: wavesurfer.js初期化に問題があり表示されません
- **区間選択**: 波形表示問題により選択操作ができません
- **プレビュー再生**: 波形表示問題により再生機能が動作しません
- **キーボード操作**: 上記機能の不具合により現在無効

### 🔄 開発中の機能
- **自動検出**: 類似波形セグメントの自動ループポイント検出

---

## 2. Setup

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```
    By default, the app will be available at `http://localhost:5173`.

---

## 3. 使用方法

### ⚠️ 現在の制限事項
波形表示機能に問題があるため、現在は以下の制限があります：
- 音声ファイルをアップロードできますが、波形は表示されません
- 区間選択ができないため、ループ生成機能は使用できません
- プレビュー再生機能は動作しません

### 基本操作（修正後利用可能）
1. 「音声ファイルを選択」ボタンで音声ファイルをアップロード
2. 波形が表示されたら、ループしたい区間をドラッグで選択
3. 「選択区間を再生」でループ区間を確認
4. スライダーでループ回数を指定（1〜100回）
5. 「ループ音源を生成」ボタンでループ音源を作成・ダウンロード

### 区間切り出し（修正後利用可能）
- 「選択区間のみ切り出し」で、選択範囲だけを抽出してダウンロード可能

### ⚡ ショートカットキー（修正後利用可能）
- **スペース**: 再生/一時停止
- **Ctrl + Enter**: ループ音源生成

### 🔄 自動検出機能（開発中）
- 「自動ループポイント検出」ボタンで類似波形セグメントを自動検出・候補表示

---

## 4. 開発 & コントリビューション

### 実装優先順位
1. ✅ **コア機能**: アップロード・波形表示・区間選択・ループ生成 **（完了）**
2. 🔄 **自動検出**: 類似区間自動検出アルゴリズム
3. 📋 **UI拡張**: 数値入力・フェード効果・バッチ処理

### 開発ガイドライン
- 新機能や改善提案は GitHub Issues または Pull Request で提案
- コードスタイルガイドライン（Prettier, ESLint等）に従う
- レスポンシブデザイン・アクセシビリティを考慮

---

## 5. 技術仕様

### アーキテクチャ
- **フロントエンド**: React + TypeScript + MUI
- **波形処理**: wavesurfer.js + Regions Plugin
- **音声処理**: FFmpeg.wasm (ESM) + @ffmpeg/util
- **自動検出**: Web Audio API + JavaScript自己相関アルゴリズム

### パフォーマンス考慮
- 10MB程度の音声ファイルを想定
- ブラウザリソース制限に配慮
- プログレス表示によるUX向上

### ブラウザサポート
- Chrome 88+, Firefox 79+, Safari 15.2+, Edge 79+ で完全対応
- SharedArrayBuffer・Cross-Origin Isolation必須

---

## 6. トラブルシューティング

### 一般的な問題
- **`npm run dev` 失敗**: `node_modules` を削除して再インストール
- **音声処理エラー**: FFmpeg.wasmとwavesurfer.jsのバージョン互換性を確認
- **ブラウザ非対応**: Cross-Origin ヘッダー（COEP/COOP）サポートを確認

### パフォーマンス問題
- **大きなファイル**: 10MB以下推奨、ブラウザメモリ制限に注意
- **処理速度**: プログレス表示を確認、必要に応じてループ回数を調整

### 開発環境
- **HTTPS必須**: localhost または HTTPS環境でのみ FFmpeg.wasm が動作
- **モダンブラウザ**: SharedArrayBuffer対応ブラウザが必要

---

## 7. コントリビューションガイドライン

### ドキュメント管理
- README.md, design_spec.md, instructions.md を常に最新に保つ
- 実装状況の変更時は該当ドキュメントを更新

### GitHub ワークフロー
- 標準的な GitHub Issues・Pull Request フローを使用
- 疑問や提案がある場合は Issue を作成して議論

### 次期開発フォーカス
1. **自動ループポイント検出**: Web Audio API + 相関解析
2. **UI/UX改善**: 数値入力・フェード効果・設定保存
3. **パフォーマンス最適化**: 大容量ファイル対応・メモリ効率化

---

## 📚 参考資料

- [wavesurfer.js Documentation](https://wavesurfer-js.org/)
- [FFmpeg.wasm Official Repository](https://github.com/ffmpegwasm/ffmpeg.wasm)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Material-UI (MUI)](https://mui.com/)
