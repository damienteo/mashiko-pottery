import { uniqueGalleryImages } from '@/lib/catalog/galleryImages'

describe('uniqueGalleryImages', () => {
  it('drops empty values and duplicates, keeping first occurrence', () => {
    expect(
      uniqueGalleryImages([
        'a.jpg',
        null,
        'a.jpg',
        'b.jpg',
        undefined,
        '',
        'b.jpg',
      ])
    ).toEqual(['a.jpg', 'b.jpg'])
  })
})
