import { AudioProcessingError } from '../errors/AudioError';
import { CONVERSION_OPTIONS, ERROR_MESSAGES } from './audioFormats';

export async function compressAudioFile(blob: Blob): Promise<Blob> {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    try {
      // iOSの場合はコンテキストを再開
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const audioBuffer = await decodeAudioDataWithRetry(audioContext, arrayBuffer);
      
      // 音声データの圧縮
      const offlineContext = new OfflineAudioContext({
        numberOfChannels: CONVERSION_OPTIONS.channels,
        length: Math.ceil(audioBuffer.duration * CONVERSION_OPTIONS.sampleRate),
        sampleRate: CONVERSION_OPTIONS.sampleRate
      });

      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;

      // 圧縮用のフィルターを追加
      const compressor = offlineContext.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      source.connect(compressor);
      compressor.connect(offlineContext.destination);
      source.start();

      const renderedBuffer = await offlineContext.startRendering();
      return await encodeCompressedAudio(renderedBuffer, blob.type);
    } finally {
      await audioContext.close();
    }
  } catch (error) {
    console.error('音声圧縮エラー:', error);
    throw new AudioProcessingError(ERROR_MESSAGES.FILE_TOO_LARGE, error);
  }
}

async function decodeAudioDataWithRetry(
  context: AudioContext, 
  buffer: ArrayBuffer, 
  retries = 3
): Promise<AudioBuffer> {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await new Promise((resolve, reject) => {
        const bufferCopy = buffer.slice(0);
        context.decodeAudioData(
          bufferCopy,
          resolve,
          (error) => reject(new Error(error?.message || 'デコードに失敗しました'))
        );
      });
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
    }
  }
  
  throw lastError;
}

async function encodeCompressedAudio(audioBuffer: AudioBuffer, originalType: string): Promise<Blob> {
  const interleaved = new Float32Array(audioBuffer.length);
  audioBuffer.copyFromChannel(interleaved, 0);

  const pcmData = new Int16Array(interleaved.length);
  for (let i = 0; i < interleaved.length; i++) {
    const s = Math.max(-1, Math.min(1, interleaved[i]));
    pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  // 元のファイル形式を維持
  return new Blob([pcmData], { type: originalType });
}