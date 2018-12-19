import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-imgs-upload',
  templateUrl: './imgs-upload.component.html',
  styleUrls: ['./imgs-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ImgsUploadComponent),
    multi: true,
  }, {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ImgsUploadComponent),
    multi: true
  }]
})
export class ImgsUploadComponent implements ControlValueAccessor, OnInit {
  @Input() items: any;
  @Input() max = 1;
  uploadImg = [];
  imgs;
  private imgFileInfo = {};
  private propagateChange = (_: any) => {};
  constructor() {
    // 模拟的数据
    this.imgs = [
      {
        src: 'assets/imgs/angular.svg',
        first: true
      },
      {
        src: 'assets/imgs/vue.svg',
        first: false
      },
      {
        src: 'assets/imgs/react.svg',
        first: false
      },
      {
        src: 'assets/imgs/jQuery.svg',
        first: false
      },
      {
        src: 'assets/imgs/ionic.svg',
      }
    ];
  }

  ngOnInit(): void {
    this.uploadImg = this.uploadImg.concat(this.items ? this.items : this.imgs);
  }




  /**
   * @description 表单控件值发生改变时，调用该方法
   * @param  obj 表单控件的新值
   * @memberof ImgsUploadComponent
   */
  writeValue(obj: any): void {
    console.log('writeValue');
    console.log(obj);
    if ( obj && obj !== '') {
      this.uploadImg = obj;
    }
  }
  registerOnChange(fn: any): void {
    console.log('registerOnchange');
    this.propagateChange = fn;


  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState(isDisabled: boolean): void {

  }

  add() {
    if (this.uploadImg.length >= this.max) {
      console.log(this);
      return;
    }
    this.upload().then((value: any) => {
      this.uploadImg.push({src: value});
      this.uploadImg.length === 1 ? this.setFirst() : '';
      this.propagateChange(this.uploadImg);
    });
  }

  validate(control: FormControl): {[key: string]: any} {
    // 传入1-5张图片
    let length = this.uploadImg.length;
    if ( length > this.max) {
      return {
        imgsError: `您已选择${length}张图片，至多选择${this.max}张图片`
      };
    }
    if ( length < 1 ) {
      return {
        imgsError: '至少选择一张图片'
      };
    }
    return null;
  }

  delete(index) {
    this.uploadImg.splice(index, 1);
    index === 0 && this.uploadImg.length ? this.setFirst() : '';
    this.propagateChange(this.uploadImg);
  }

  setFirst() {
    this.uploadImg[0]['first'] = true;
  }

  upload(): Promise<any> {
    return new Promise((resolve, reject) => {
      const random = Math.floor(Math.random() * 4);
      setTimeout(() => {
        // 模拟异步事件
        resolve(this.imgs[random].src);
      });
    });
  }


  selectPic(ev: Event) {
    console.log(ev);
    const file = ev.target['files'][0];
    console.log(file);
    const maxSize = 1024 * 1024 * 10; // 设置为10 M
    // 检查文件类型
    if(['jpeg', 'png', 'gif', 'jpg'].indexOf(file.type.split("/")[1]) < 0) {
      // 报错
      return false;
    }

    // 文件大小限制
    if(file.size > maxSize) {
      return false;
    }
    // 将file转换成dataUrl
    this.transformFileToDataUrl(file).then(({dataURL, isComperss}) => {
      return this.compressImg(dataURL, isComperss);
    }).then((dataURL) => {
      return this.processToBlob(dataURL);
    }).then((formData) => {
      this.uploadData(formData);
    }).catch((err) => {
      console.log(err);
    });
  }

  uploadData(formData) {
    // 这里用ajax发送，我这里就是联系一下原生的ajax。。。请忽略
    const xhr = new XMLHttpRequest;
    xhr.upload.addEventListener('progress', (e) => {
      console.log(e.loaded / e.total);
    });

    xhr.addEventListener('error', () => {
      console.log('error');
    });
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        const result = JSON.stringify(xhr.responseText);
        if(xhr.status == 200) {
          console.log('succes');
        }else {
          // shibai
        }
      }
    }
    xhr.open('POST', '/url', true);
    xhr.send(formData);
    setTimeout(() => {
      console.log('success');
      
    }, 2000);
  }

  compressImg(dataURL: string, isCompress: boolean = false) {
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

        if(isCompress){
            compressedDataUrl = canvas.toDataURL(this.imgFileInfo['type'], 0.2);
        } else {
            compressedDataUrl = canvas.toDataURL(this.imgFileInfo['type'], 1);
        }
        console.log(compressedDataUrl);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => {
        reject(err);
      }
    });
      
      
    
  }

  transformFileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const compassMaxSize = 200 * 1024;
    
      this.imgFileInfo['type'] = file.type;
      this.imgFileInfo['size'] =file.size;
      this.imgFileInfo['name'] = file.name;
      this.imgFileInfo['lastModifiedDate ']= file.lastModifiedDate;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target['result'];
        let isComperss = result.length < compassMaxSize ? false : true;
        resolve({dataURL: result, isCompress: isComperss});
      };
      reader.onerror = (err) => {
        reject(err);
      }
      reader.readAsDataURL(file);
    });
    
  } 

  processToBlob(dataURL) {
    // 这里使用二进制方式处理dataUrl
    return new Promise((resolve) => {
      const binaryString = window.atob(dataURL.split(',')[1]);
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const intArray = new Uint8Array(arrayBuffer);
      const imgFile = this.imgFileInfo;

      for (let i = 0, j = binaryString.length; i < j; i++) {
          intArray[i] = binaryString.charCodeAt(i);
      }

      const data = [intArray];
      console.log(data);

      let blob;

      blob = new Blob(data, { type: imgFile['type'] });
      

      // blob 转file
      const fileOfBlob = new File([blob], imgFile['name']);
      const formData = new FormData();
      // type
      formData.append('type', imgFile['type']);
      // size
      formData.append('size', '' + fileOfBlob.size);
      // name
      formData.append('name', imgFile['name']);
      // lastModifiedDate
      formData.append('lastModifiedDate', imgFile['lastModifiedDate']);
      // append 文件
      formData.append('file', blob);
      resolve(formData);

    });
    

   
    
  }

  

}
