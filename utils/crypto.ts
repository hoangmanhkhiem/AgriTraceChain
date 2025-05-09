import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = process.env.SECRET_KEY!; // 32 bytes
const IV = process.env.IV!; // 16 bytes

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY), Buffer.from(IV));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

export function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY), Buffer.from(IV));
  let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}