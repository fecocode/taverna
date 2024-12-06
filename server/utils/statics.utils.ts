import { RuntimeConfig } from "nuxt/schema";
import { v2 as cloudinary } from 'cloudinary';
import { PassThrough } from 'stream';

export async function createCloudinaryClient(runtimeConfig: RuntimeConfig) {
  cloudinary.config({
    cloud_name: runtimeConfig.CLOUDINARY_CLOUD_NAME,
    api_key: runtimeConfig.CLOUDINARY_API_KEY,
    api_secret: runtimeConfig.CLOUDINARY_API_SECRET
  });

  return cloudinary;
}

export async function uploadStaticImage(runtimeConfig: RuntimeConfig, file: Buffer, path: string, format: 'webp' | 'gif'): Promise<string | undefined> {
  const cloudinaryClient = await createCloudinaryClient(runtimeConfig);

  const uploadResult = await new Promise<{ secure_url: string } | undefined>((resolve, reject) => {
    const uploadStream = cloudinaryClient.uploader.upload_stream(
      {
        folder: path,
        format: format,
        quality: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const bufferStream = new PassThrough();
    bufferStream.end(file);
    bufferStream.pipe(uploadStream);
  });

  return uploadResult?.secure_url;
}
