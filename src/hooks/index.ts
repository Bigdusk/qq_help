import FingerprintJS from '@fingerprintjs/fingerprintjs';

export async function createFingerprint() {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result.visitorId;
    return visitorId
}

/**
 * 时间格式 普通时间戳转换时间
 * @param value 时间戳
 */
export function changeTime(value: any) {
    return new Date(value*1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
}

export function uniqueArrayOfObjects<T extends object>(arr: T[]): T[] {
    const seen = new Set<string>();
    return arr.filter(item => {
      const strItem = JSON.stringify(item);
      if (seen.has(strItem)) {
        return false;
      }
      seen.add(strItem);
      return true;
    });
  }

  //暂停
export const sleep = (ms: number): Promise<void> => {
  return new Promise(r => setTimeout(r, ms))
}