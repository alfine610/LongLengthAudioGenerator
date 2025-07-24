import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Alert,
  Grid,
  Slider,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  PlayArrow,
  Pause,
} from '@mui/icons-material';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';

interface LoopRegion {
  start: number;
  end: number;
}

function SimpleApp() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopRegion, setLoopRegion] = useState<LoopRegion>({ start: 0, end: 0 });
  const [loopCount, setLoopCount] = useState<number>(10);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  
  const waveformRef = useRef<HTMLDivElement>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (file && file.type === 'audio/mpeg') {
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
      setError('MP3ファイルを選択してください');
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    addRegion();
  }, [duration]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        MP3波形ループ生成アプリ（プレビュー版）
      </Typography>
      
      <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        BGMの波形表示・区間選択・プレビュー再生が可能です
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
                  accept="audio/mpeg"
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
                  MP3ファイルを選択
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

        {/* 情報パネル */}
        {audioFile && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  現在の状態
                </Typography>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  現在はプレビュー版です。
                  <br />
                  波形表示・区間選択・プレビュー再生が可能です。
                </Alert>
                
                <Alert severity="warning">
                  音声処理機能（ループ音源生成・切り出し）は開発中です。
                  <br />
                  ブラウザ互換性の問題により一時的に無効化されています。
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default SimpleApp;
