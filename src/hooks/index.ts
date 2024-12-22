import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { invoke } from '@tauri-apps/api/core';
//获取游览器指纹
/**
   * @deprecated 游览器指纹容易在系统更新或者其他操作导致系统变更的情况下发生改变，用uuid方法替代
   */
export async function createFingerprint() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const visitorId = result.visitorId;
  return visitorId
}
//获取电脑唯一uuid根据主板
export async function gte_uuid() {
  const uuid = await invoke('get_uuid')
  return uuid
}

/**
 * 时间格式 普通时间戳转换时间
 * @param value 时间戳
 */
export function changeTime(value: any) {
  return new Date(value * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')
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
import * as XLSX from 'xlsx';
//导出表格
/*
    * @description:
    * @param {Object} json 服务端发过来的数据
    * @param {String} name 导出Excel文件名字
   
    * @param {String} titleArr 导出Excel表头
   
    * @param {String} sheetName 导出sheetName名字
    * @return:
    */
export function exportExcel(json: any, name: string, titleArr: string[], sheetName: string) {

  // 想要隐藏的字段
  const fieldsToHide = ['area', 'level', 'title_expire_time', 'unfriendly', 'card_changeable', 'is_robot', 'shut_up_timestamp'];

  json.forEach((item: any) => {
    fieldsToHide.forEach(field => {
      delete item[field];
    });
  });

  /* convert state to workbook */
  var data = new Array();
  var keyArray = new Array();
  const getLength = function (obj: any) {
    var count = 0;
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        count++;
      }
    }
    return count;
  };
  for (const key1 in json) {
    if (json.hasOwnProperty(key1)) {
      const element = json[key1];
      var rowDataArray = new Array();
      for (const key2 in element) {
        if (element.hasOwnProperty(key2)) {
          const element2 = element[key2];
          rowDataArray.push(element2);
          if (keyArray.length < getLength(element)) {
            keyArray.push(key2);
          }
        }
      }
      data.push(rowDataArray);
    }
  }
  // keyArray为英文字段表头
  data.splice(0, 0, keyArray, titleArr);
  console.log('data', data);
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  // 此处隐藏英文字段表头
  var wsrows = [{ hidden: true }];
  ws['!rows'] = wsrows; // ws - worksheet
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  /* generate file and send to client */
  XLSX.writeFile(wb, name + '.xlsx');
}