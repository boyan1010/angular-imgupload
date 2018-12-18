import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { Component, Input, forwardRef, OnInit } from '@angular/core';

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

}
