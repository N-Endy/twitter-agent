import crypto from "node:crypto";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
function getKey(secret) {
    return crypto.createHash("sha256").update(secret).digest();
}
export function encryptString(value, secret) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(secret), iv);
    const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString("hex")}.${authTag.toString("hex")}.${encrypted.toString("hex")}`;
}
export function decryptString(payload, secret) {
    const [ivHex, authTagHex, encryptedHex] = payload.split(".");
    if (!ivHex || !authTagHex || !encryptedHex) {
        throw new Error("Invalid encrypted payload");
    }
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(secret), Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedHex, "hex")),
        decipher.final()
    ]);
    return decrypted.toString("utf8");
}
