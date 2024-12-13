import { CONVERSION_OPTIONS, ERROR_MESSAGES } from './audioFormats';
import { AudioProcessingError } from '../errors/AudioError';

export async function convertAudioToWav(audioFile: File): Promise<Blob> {
  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    try {
      const audioBuffer = await decodeAudioDataWithRetry(audioContext, arrayBuffer);
      const offlineContext = new OfflineAudioContext({
        numberOfChannels: CONVERSION_OPTIONS.channels,
        length: Math.ceil(audioBuffer.duration * CONVERSION_OPTIONS.sampleRate),
        sampleRate: CONVERSION_OPTIONS.sampleRate
      });

      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();

      const renderedBuffer = await offlineContext.startRendering();
      const wavBlob = await encodeWavFile(renderedBuffer);

      return wavBlob;
    } finally {
      await audioContext.close();
    }
  } catch (error) {
    console.error('音声変換エラー:', error);
    throw new AudioProcessingError(ERROR_MESSAGES.CONVERSION_ERROR, error);
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
      return await context.decodeAudioData(buffer.slice(0));
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
    }
  }
  
  throw lastError;
}

async function encodeWavFile(audioBuffer: AudioBuffer): Promise<Blob> {
  const interleaved = new Float32Array(audioBuffer.length);
  audioBuffer.copyFromChannel(interleaved, 0);

  const pcmData = new Int16Array(interleaved.length);
  for (let i = 0; i < interleaved.length; i++) {
    const s = Math.max(-1, Math.min(1, interleaved[i]));
    pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  const wavHeader = createWavHeader({
    numChannels: CONVERSION_OPTIONS.channels,
    sampleRate: CONVERSION_OPTIONS.sampleRate,
    bitsPerSample: CONVERSION_OPTIONS.bitDepth
  });

  return new Blob([wavHeader, pcmData], { type: 'audio/wav' });
}

function createWavHeader(options: {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}): ArrayBuffer {
  const { numChannels, sampleRate, bitsPerSample } = options;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;

  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 32 + blockAlign, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, 0, true);

  return buffer;
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}