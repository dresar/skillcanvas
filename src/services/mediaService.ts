import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const bucket = import.meta.env.VITE_S3_BUCKET || 'uploads';
const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
const endpoint = import.meta.env.VITE_S3_ENDPOINT as string | undefined;
const cdnBaseUrl = (import.meta.env.VITE_CDN_URL as string | undefined)?.replace(/\/$/, '');

const client = new S3Client({
  region,
  endpoint,
  forcePathStyle: Boolean(endpoint),
  credentials: import.meta.env.VITE_AWS_ACCESS_KEY_ID && import.meta.env.VITE_AWS_SECRET_ACCESS_KEY ? {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

export type MediaUpload = { key: string; url: string; contentType: string; size: number };

export function mediaUrl(key: string): string {
  if (cdnBaseUrl) return `${cdnBaseUrl}/${key}`;
  if (endpoint) return `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export async function uploadMedia(file: File, folder = 'skills'): Promise<MediaUpload> {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
  const key = `${folder}/${crypto.randomUUID()}-${safeName}`;
  if (import.meta.env.VITE_S3_UPLOAD_ENABLED === 'true') {
    await client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: file, ContentType: file.type }));
  }
  return { key, url: mediaUrl(key), contentType: file.type, size: file.size };
}

export function isMediaConfigured(): boolean {
  return Boolean(import.meta.env.VITE_CDN_URL || import.meta.env.VITE_S3_UPLOAD_ENABLED === 'true');
}
