
import { Multer } from 'multer';
export interface ICloudInterface {
  uploadFile(file:Express.Multer.File , path: string): Promise<string>;
  deleteFile(key:string): Promise<void>;

  getFile(key:string): Promise<Buffer>;

  genrateResignedUrl(file:Partial <Express.Multer.File> , path: string): Promise<string>;



}
