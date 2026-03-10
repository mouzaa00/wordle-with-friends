import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key";

export function encryptGameData(word, creator) {
  const encrypted = CryptoJS.AES.encrypt(
    `${word}|${creator}`,
    SECRET_KEY,
  ).toString();
  // Make it URL-safe
  return encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function decryptGameData(token) {
  const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const decrypted = CryptoJS.AES.decrypt(base64, SECRET_KEY);
  const text = decrypted.toString(CryptoJS.enc.Utf8);
  const [word, creator] = text.split("|");
  return { word, creator };
}
