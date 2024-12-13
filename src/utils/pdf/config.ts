export const PDF_CONFIG = {
  defaultMargins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  container: {
    width: '800px',
    className: 'pdf-container prose prose-sm max-w-none'
  },
  canvas: {
    scale: 2,
    quality: 0.95,
    imageType: 'JPEG'
  }
} as const;