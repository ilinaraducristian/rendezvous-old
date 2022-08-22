import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client as Minio } from 'minio';

@Injectable()
export class MinioService {

  client: Minio;

  constructor(private readonly configService: ConfigService) {
    this.client = new Minio({
      endPoint: configService.get<string>('MINIO_ENDPOINT'),
      accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: configService.get<string>('MINIO_SECRET_KEY'),
      useSSL: configService.get<string>('MINIO_SSL').toLowerCase() === 'false' ? false : true,
      port: parseInt(configService.get<string>('MINIO_PORT'))
    });
  }

}