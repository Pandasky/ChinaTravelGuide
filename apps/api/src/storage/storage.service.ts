import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('ALIYUN_OSS_REGION') || 'cn-hangzhou';
    const accessKeyId = this.configService.get<string>('ALIYUN_ACCESS_KEY_ID');
    const accessKeySecret = this.configService.get<string>('ALIYUN_ACCESS_KEY_SECRET');

    this.bucket = this.configService.get<string>('ALIYUN_OSS_BUCKET') || 'chinawise';

    if (accessKeyId && accessKeySecret) {
      // Alibaba Cloud OSS uses S3-compatible API
      this.s3Client = new S3Client({
        region,
        endpoint: `https://oss-${region}.aliyuncs.com`,
        credentials: {
          accessKeyId,
          secretAccessKey: accessKeySecret,
        },
      });
    }
  }

  async uploadFile(
    key: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<{ url: string; key: string }> {
    if (!this.s3Client) {
      throw new Error('Storage not configured');
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    const url = `https://${this.bucket}.oss-${this.configService.get<string>('ALIYUN_OSS_REGION') || 'cn-hangzhou'}.aliyuncs.com/${key}`;

    return { url, key };
  }

  async getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.s3Client) {
      throw new Error('Storage not configured');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    if (!this.s3Client) {
      throw new Error('Storage not configured');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  generateKey(folder: string, filename: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = filename.split('.').pop();
    return `${folder}/${timestamp}-${random}.${extension}`;
  }
}
