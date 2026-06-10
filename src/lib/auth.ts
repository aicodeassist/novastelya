const encoder = new TextEncoder();

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const keyData = encoder.encode(secret);
  return globalThis.crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs a payload using HMAC SHA-256 and Web Crypto API.
 * Returns a JWT-like token: base64url(payload).signatureHex
 */
export async function signToken(payload: any, secret: string): Promise<string> {
  const key = await getHmacKey(secret);
  const jsonStr = JSON.stringify(payload);
  const data = encoder.encode(jsonStr);
  const signatureBuffer = await globalThis.crypto.subtle.sign("HMAC", key, data);
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  
  const base64Payload = Buffer.from(jsonStr).toString("base64url");
  return `${base64Payload}.${signatureHex}`;
}

/**
 * Verifies a token and returns the payload if valid, otherwise null.
 */
export async function verifyToken(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [base64Payload, signatureHex] = parts;
    
    const jsonStr = Buffer.from(base64Payload, "base64url").toString("utf8");
    const payload = JSON.parse(jsonStr);
    
    // Check expiration if set
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    
    const key = await getHmacKey(secret);
    const data = encoder.encode(jsonStr);
    
    const signatureBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
    
    const isValid = await globalThis.crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      data
    );
    
    return isValid ? payload : null;
  } catch (e) {
    return null;
  }
}
