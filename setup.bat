@echo off
echo MP3波形ループ生成アプリの開発環境セットアップ (Vite + React)

echo 古い依存関係を削除中...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo 新しい依存関係をインストール中...
call npm install

if %errorlevel% neq 0 (
    echo エラー: npm installが失敗しました
    pause
    exit /b 1
)

echo セットアップが完了しました！

echo.
echo 開発サーバーを起動するには:
echo npm run dev

echo.
echo ビルドするには:
echo npm run build

echo.
echo プレビューするには:
echo npm run preview

pause
