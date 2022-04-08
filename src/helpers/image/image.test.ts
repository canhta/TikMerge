import sharp from 'sharp';

export const compressImage = async (image: Buffer, width: number, height: number): Promise<Buffer> => {
  return await sharp(image).resize(width, height).toBuffer();
};
