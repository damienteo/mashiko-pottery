import cloudinaryLoader from '@/lib/cloudinaryLoader'

describe('cloudinaryLoader', () => {
  it('leaves local paths unchanged for the custom loader', () => {
    expect(
      cloudinaryLoader({
        src: '/home/hero-banner.webp',
        width: 750,
        quality: 75,
      })
    ).toBe('/home/hero-banner.webp')
  })

  it('leaves non-Cloudinary absolute URLs unchanged', () => {
    const src = 'https://cdn.example.com/hero.webp'
    expect(cloudinaryLoader({ src, width: 400, quality: 80 })).toBe(src)
  })

  it('inserts f_auto, q, w, c_limit after /upload/ on Cloudinary URLs', () => {
    const src =
      'https://res.cloudinary.com/demo/image/upload/v1/potters/1/photo.jpg'
    expect(cloudinaryLoader({ src, width: 750, quality: 75 })).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_75,w_750,c_limit/v1/potters/1/photo.jpg'
    )
  })
})
