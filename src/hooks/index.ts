import FingerprintJS from '@fingerprintjs/fingerprintjs';

export async function createFingerprint() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    return visitorId
}