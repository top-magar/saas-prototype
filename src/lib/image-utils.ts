// Image optimization utilities

export const generateBlurDataURL = (width: number = 8, height: number = 8): string => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, width, height)
  }
  
  return canvas.toDataURL()
}

export const getImageSizes = (breakpoints: Record<string, string>): string => {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
    .join(', ')
}

export const defaultImageSizes = {
  mobile: '100vw',
  tablet: '50vw', 
  desktop: '33vw'
}

export const responsiveSizes = getImageSizes({
  '768px': defaultImageSizes.mobile,
  '1200px': defaultImageSizes.tablet,
  '9999px': defaultImageSizes.desktop
})