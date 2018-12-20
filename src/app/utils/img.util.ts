import { EventEmitter } from '@angular/core';
const imgTypes: Array<string> = ['jpeg', 'png', 'gif', 'jpg'];
const compassMaxSize = 200 * 1024;
export const emit = new EventEmitter();
export const isImage = (fileName: string) => {
  return imgTypes.indexOf(fileName) > 0 ? true : false;
};

export const transformFileToDataUrl = function(file) {
  console.log(this);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target['result'];
      file.isCompress = result.length < compassMaxSize ? false : true;
      resolve(result);
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};

export const compressImg = function(dataURL) {
  console.log(this);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let compressedDataUrl;
      if (this.isCompress) {
          compressedDataUrl = canvas.toDataURL(this.type, 0.2);
      } else {
          compressedDataUrl = canvas.toDataURL(this.type, 1);
      }
      emit.emit(compressedDataUrl);
      resolve(compressedDataUrl);
    };
    img.onerror = (err) => {
      reject(err);
    };
  });
};


export const processToBlob = function(dataURL) {
  console.log(this);
  // 这里使用二进制方式处理dataUrl
  return new Promise((resolve) => {
    const binaryString = window.atob(dataURL.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i);
    }
    const data = [intArray];
    let blob;
    blob = new Blob(data, { type: this.type });
    // blob 转file
    const fileOfBlob = new File([blob], this.name);
    const formData = new FormData();
    // type
    formData.append('type', this.type);
    // size
    formData.append('size', '' + fileOfBlob.size);
    // name
    formData.append('name', this.name);
    // lastModifiedDate
    formData.append('lastModifiedDate', this.lastModifiedDate);
    // append 文件
    formData.append('file', blob);
    console.log(formData.get('size'));
    console.log(formData);
    resolve(formData);
  });
};

export const compress = function(file) {
  return transformFileToDataUrl.call(this, file).then((dataURL) => {
    return compressImg.call(this, dataURL);
  }).then(compressedDataURL =>
    processToBlob.call(this, compressedDataURL)
  );
};


