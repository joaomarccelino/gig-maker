import Compressor from 'compressorjs';

function compressImage(file: File, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: quality,
      success: (compressedFile) => {
        resolve(compressedFile as File);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export default compressImage