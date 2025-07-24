import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Slider,
  IconButton,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  CloudUpload,
  PlayArrow,
  Pause,
  Download,
  AutoAwesome,
  ContentCut,
} from '@mui/icons-material';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface LoopRegion {
  start: number;
  end: number;
}

function App() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopRegion, setLoopRegion] = useState<LoopRegion>({ start: 0, end: 0 });
  const [loopCount, setLoopCount] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  
  const waveformRef = useRef<HTMLDivElement>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FFmpegの初期化
  useEffect(() => {
    const initFFmpeg = async () => {
      try {
        const ffmpegInstance = new FFmpeg();
        
        // ログとプログレスを有効化
        ffmpegInstance.on('log', ({ message }: any) => {
          console.log('FFmpeg Log:', message);
        });

        ffmpegInstance.on('progress', ({ progress }: any) => {
          console.log('FFmpeg Progress:', Math.round(progress * 100), '%');
        });
        
        // 公式推奨の方法（Vite用: esmディストリビューション使用）
        const baseURL = '/ffmpeg';
        
        console.log('FFmpeg初期化を開始...');
        await ffmpegInstance.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        
        setFFmpeg(ffmpegInstance);
        setError(''); // エラーをクリア
        console.log('✅ FFmpeg初期化完了');
      } catch (err) {
        console.error('❌ FFmpeg初期化失敗:', err);
        setError('FFmpegの初期化に失敗しました。ネットワーク接続またはブラウザの互換性を確認してください。');
      }
    };

    initFFmpeg();
  }, []);

  // WaveSurferの初期化
  const initWaveSurfer = () => {
    if (waveformRef.current) {
      const regions = RegionsPlugin.create();
      
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4FC3F7',
        progressColor: '#29B6F6',
        cursorColor: '#FF5722',
        barWidth: 2,
        barRadius: 3,
        height: 200,
        normalize: true,
        plugins: [regions],
      });

      regionsRef.current = regions;

      ws.on('ready', () => {
        setDuration(ws.getDuration());
        setLoopRegion({ start: 0, end: ws.getDuration() });
      });

      ws.on('play', () => setIsPlaying(true));
      ws.on('pause', () => setIsPlaying(false));

      // リージョン変更のイベントリスナー
      regions.on('region-updated', (region: any) => {
        setLoopRegion({ start: region.start, end: region.end });
      });

      setWavesurfer(ws);
      return ws;
    }
    return null;
  };

  // ファイル選択処理
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // より広範囲の音声形式をサポート
      const supportedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'];
      const isSupported = supportedTypes.includes(file.type) || file.name.toLowerCase().endsWith('.mp3');
      
      if (isSupported) {
        setAudioFile(file);
        setError('');
        setSuccess('');
        
        if (wavesurfer) {
          wavesurfer.destroy();
        }
        
        const ws = initWaveSurfer();
        if (ws) {
          const url = URL.createObjectURL(file);
          ws.load(url);
        }
      } else {
        setError('対応していないファイル形式です。MP3, WAV, OGG, M4Aファイルを選択してください。');
      }
    }
  };

  // 再生/一時停止
  const togglePlayback = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  // リージョンの追加
  const addRegion = () => {
    if (regionsRef.current && duration > 0) {
      const regionStart = Math.max(0, duration * 0.2);
      const regionEnd = Math.min(duration, duration * 0.8);
      
      // 既存のリージョンをクリア
      regionsRef.current.clearRegions();
      
      // 新しいリージョンを追加
      regionsRef.current.addRegion({
        start: regionStart,
        end: regionEnd,
        color: 'rgba(255, 87, 34, 0.3)',
        drag: true,
        resize: true,
      });
      
      setLoopRegion({ start: regionStart, end: regionEnd });
    }
  };

  // 選択区間の再生
  const playRegion = () => {
    if (wavesurfer && loopRegion.start < loopRegion.end) {
      wavesurfer.setTime(loopRegion.start);
      wavesurfer.play();
      
      setTimeout(() => {
        wavesurfer.pause();
      }, (loopRegion.end - loopRegion.start) * 1000);
    }
  };

  // ループ音源の生成
  const generateLoopedAudio = async () => {
    if (!audioFile || loopRegion.start >= loopRegion.end) {
      setError('ファイルまたは有効なループ区間が選択されていません');
      return;
    }

    if (!ffmpeg) {
      setError('FFmpegが利用できません。音声処理機能を使用するには、Chrome/Firefox/Safari等の最新ブラウザが必要です。');
      return;
    }

    setIsProcessing(true);
    setError('');
    setProcessingProgress(0);
    
    try {
      console.log('🎵 音声処理を開始...');
      
      // プログレス追跡用のイベントリスナーを設定
      ffmpeg.on('progress', ({ progress }: any) => {
        const progressPercent = Math.round(progress * 100);
        setProcessingProgress(progressPercent);
        console.log(`処理進行状況: ${progressPercent}%`);
      });

      // ファイルをFFmpegに読み込み
      console.log('📁 ファイル読み込み中...');
      await ffmpeg.writeFile('input.mp3', await fetchFile(audioFile));
      
      // ループ区間を抽出
      console.log('✂️  ループ区間を抽出中...');
      await ffmpeg.exec([
        '-i', 'input.mp3',
        '-ss', loopRegion.start.toString(),
        '-t', (loopRegion.end - loopRegion.start).toString(),
        '-c', 'copy',
        'loop_segment.mp3'
      ]);

      // リストファイルを作成
      console.log('📋 ループリストを作成中...');
      const listContent = Array(loopCount).fill('file \'loop_segment.mp3\'').join('\n');
      await ffmpeg.writeFile('list.txt', listContent);

      // ループを結合
      console.log('🔗 ループを結合中...');
      await ffmpeg.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'list.txt',
        '-c', 'copy',
        'output.mp3'
      ]);

      // 結果をダウンロード
      console.log('💾 ファイルをダウンロード準備中...');
      const data = await ffmpeg.readFile('output.mp3');
      const blob = new Blob([data as ArrayBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `looped_${audioFile.name}`;
      a.click();
      
      URL.revokeObjectURL(url);
      setSuccess(`🎉 ループ音源を生成しました！（${loopCount}回ループ、長さ: ${formatTime((loopRegion.end - loopRegion.start) * loopCount)}）`);
      
    } catch (err) {
      console.error('❌ 処理エラー:', err);
      setError('音源の処理中にエラーが発生しました。ファイル形式や区間設定を確認してください。');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  // 区間切り出し
  const extractRegion = async () => {
    if (!audioFile || loopRegion.start >= loopRegion.end) {
      setError('ファイルまたは有効な区間が選択されていません');
      return;
    }

    if (!ffmpeg) {
      setError('FFmpegが利用できません。音声処理機能を使用するには、Chrome/Firefox/Safari等の最新ブラウザが必要です。');
      return;
    }

    setIsProcessing(true);
    setError('');
    
    try {
      console.log('✂️  区間切り出しを開始...');
      await ffmpeg.writeFile('input.mp3', await fetchFile(audioFile));
      
      await ffmpeg.exec([
        '-i', 'input.mp3',
        '-ss', loopRegion.start.toString(),
        '-t', (loopRegion.end - loopRegion.start).toString(),
        '-c', 'copy',
        'extracted.mp3'
      ]);

      const data = await ffmpeg.readFile('extracted.mp3');
      const blob = new Blob([data as ArrayBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      const extractedDuration = formatTime(loopRegion.end - loopRegion.start);
      a.download = `extracted_${extractedDuration}_${audioFile.name}`;
      a.click();
      
      URL.revokeObjectURL(url);
      setSuccess(`🎵 区間を切り出しました！（長さ: ${extractedDuration}）`);
      
    } catch (err) {
      console.error('❌ 切り出しエラー:', err);
      setError('区間の切り出し中にエラーが発生しました。ファイル形式や区間設定を確認してください。');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    addRegion();
  }, [duration]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!audioFile) return;
      
      // スペースキーで再生/一時停止
      if (event.code === 'Space' && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        togglePlayback();
      }
      
      // Ctrl+Enterでループ生成
      if (event.ctrlKey && event.code === 'Enter') {
        event.preventDefault();
        if (!isProcessing && ffmpeg) {
          generateLoopedAudio();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [audioFile, isProcessing, ffmpeg]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        🎵 音声ループ生成アプリ
      </Typography>
      
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        BGMなどの音声ファイルからループ区間を選択して長尺音源を生成
        <br />
        💡 ショートカット: スペース（再生/停止）、Ctrl+Enter（ループ生成）
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* ファイル選択 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <input
                  type="file"
                  accept="audio/*,.mp3,.wav,.ogg,.m4a"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={() => fileInputRef.current?.click()}
                  size="large"
                >
                  MP3・音声ファイルを選択
                </Button>
                {audioFile && (
                  <Typography variant="body2" color="text.secondary">
                    {audioFile.name} ({Math.round(audioFile.size / 1024 / 1024 * 100) / 100} MB)
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 波形表示 */}
        {audioFile && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  波形表示
                </Typography>
                <Box ref={waveformRef} sx={{ mb: 2 }} />
                <Box display="flex" gap={1} alignItems="center">
                  <IconButton onClick={togglePlayback} color="primary">
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                  <Button onClick={playRegion} variant="outlined" size="small">
                    選択区間を再生
                  </Button>
                  <Button onClick={addRegion} variant="outlined" size="small">
                    ループ区間を設定
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* 設定パネル */}
        {audioFile && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ループ設定
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>ループ回数: {loopCount}回</Typography>
                  <Slider
                    value={loopCount}
                    onChange={(_, value) => setLoopCount(value as number)}
                    min={1}
                    max={100}
                    marks={[
                      { value: 1, label: '1' },
                      { value: 10, label: '10' },
                      { value: 50, label: '50' },
                      { value: 100, label: '100' },
                    ]}
                  />
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  選択区間
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  開始: {formatTime(loopRegion.start)} - 終了: {formatTime(loopRegion.end)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  区間長: {formatTime(loopRegion.end - loopRegion.start)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  生成後の長さ: {formatTime((loopRegion.end - loopRegion.start) * loopCount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* アクションボタン */}
        {audioFile && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  アクション
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={isProcessing ? <CircularProgress size={20} /> : <Download />}
                    onClick={generateLoopedAudio}
                    disabled={isProcessing || !ffmpeg}
                    size="large"
                  >
                    {isProcessing ? '処理中...' : 'ループ音源を生成'}
                  </Button>
                  
                  {isProcessing && processingProgress > 0 && (
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={processingProgress} 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary" align="center">
                        処理中: {processingProgress}%
                      </Typography>
                    </Box>
                  )}
                  
                  <Button
                    variant="outlined"
                    startIcon={<ContentCut />}
                    onClick={extractRegion}
                    disabled={isProcessing || !ffmpeg}
                  >
                    選択区間のみ切り出し
                  </Button>
                  
                  <Divider />
                  
                  <Button
                    variant="outlined"
                    startIcon={<AutoAwesome />}
                    disabled
                    size="small"
                  >
                    自動ループポイント検出（準備中）
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {!ffmpeg && !error && (
        <Paper sx={{ p: 2, mt: 3, bgcolor: 'info.light' }}>
          <Typography variant="body2" color="text.primary" align="center">
            🔄 FFmpegを初期化中...
            <br />
            音声処理機能の準備をしています
          </Typography>
        </Paper>
      )}

      {ffmpeg && (
        <Paper sx={{ p: 2, mt: 3, bgcolor: 'success.light' }}>
          <Typography variant="body2" color="text.primary" align="center">
            ✅ FFmpeg初期化完了！
            <br />
            すべての機能が利用可能です
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

export default App;
