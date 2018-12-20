import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Component, Input, forwardRef, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { isImage, compress, emit } from '../../utils/img.util';
import { Renderer2, ElementRef, ViewContainerRef
} from '@angular/core';
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
export class ImgsUploadComponent implements ControlValueAccessor, OnInit, AfterViewInit{
  @Input() items: any;
  @Input() max = 1;
  uploadImg = [];
  imgs;
  private imgFileInfo = {};
  private propagateChange = (_: any) => {};

  constructor(private el: ElementRef, private render2: Renderer2, private viewRef: ViewContainerRef
    ) {
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

  ngAfterViewInit(): void {
    emit.subscribe((url) => {
      console.log(url);
      this.render(url);
    });
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

  render(url) {
    if (this.uploadImg.length >= this.max) {
      console.log(this);
      return;
    }
    this.uploadImg.push({src: url});
    this.uploadImg.length === 1 ? this.setFirst() : '';
    this.propagateChange(this.uploadImg);
  }

  validate(control: FormControl): {[key: string]: any} {
    // 传入1-5张图片
    const length = this.uploadImg.length;
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
    
    console.log(ev.target['files']);
    const file = ev.target['files'][0];
    const maxSize = 1024 * 1024 * 10; // 设置为10 M
    console.log(file);
    // 检查文件类型
    if (!isImage(file.type.split('/')[1])) {
      console.log('error');
      // 报错
      throw new Error('该文件不是图片');
    }
    // 文件大小限制
    if (file.size > maxSize) {
      throw new Error('文件太大');
    }
    this.imgFileInfo['type'] = file.type;
    this.imgFileInfo['size'] = file.size;
    this.imgFileInfo['name'] = file.name;
    this.imgFileInfo['lastModifiedDate '] = file.lastModifiedDate;
    compress.call(file, file).then((result) => {
      this.uploadData(result);
    }).catch((err) => {
      console.log(err);
    });

    // 将file转换成dataUrl
    // transformFileToDataUrl(file).then(({dataURL, isComperss}) => {
    //   return compressImg(dataURL, isComperss, file.type);
    // }).then((dataURL) => {
    //   return processToBlob(dataURL, this.imgFileInfo);
    // }).then((formData) => {
    //   this.uploadData(formData);
    // }).catch((err) => {
    //   console.log(err);
    // });
  }

  uploadData(formData) {
    // 这里用ajax发送，我这里就是联系一下原生的ajax。。。请忽略
    // const xhr = new XMLHttpRequest;
    // xhr.upload.addEventListener('progress', (e) => {
    //   console.log(e.loaded / e.total);
    // });

    // xhr.addEventListener('error', () => {
    //   console.log('error');
    // });
    // xhr.onreadystatechange = () => {
    //   if (xhr.readyState === 4) {
    //     const result = JSON.stringify(xhr.responseText);
    //     if (xhr.status === 200) {
    //       // success
    //     } else {
    //       // fail
    //     }
    //   }
    // };
    // xhr.open('POST', '/url', true);
    // xhr.send(formData);
    setTimeout(() => {
      console.log('success');
    }, 500);
  }


}
