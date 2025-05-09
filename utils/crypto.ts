import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = "12345678901234567890123456789012";
const IV = "1234567890123456";

// Kiểm tra trước khi dùng
function getKey(): Buffer {
  if (!KEY || KEY.length !== 32) {
    throw new Error('❌ SECRET_KEY phải có đúng 32 ký tự (256-bit)');
  }
  return Buffer.from(KEY);
}

function getIV(): Buffer {
  if (!IV || IV.length !== 16) {
    throw new Error('❌ IV phải có đúng 16 ký tự (128-bit)');
  }
  return Buffer.from(IV);
}

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), getIV());
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}

export function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), getIV());
  let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}