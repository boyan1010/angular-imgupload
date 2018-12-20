import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-components';
  myForm: FormGroup;
  imgs = [{ src: 'assets/imgs/angular.svg', first: true}, { src: 'assets/imgs/vue.svg'}, { src: 'assets/imgs/react.svg'}];
  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      productImgs: [this.imgs]
    });
  }

  onSubmit({value, valid}, ev: Event) {
    console.log(JSON.stringify(value), valid );
  }

  ngOnInit(): void {
    // setTimeout(() => {
    //   console.log('setTimeout');

    //   this.imgs.push({
    //     src: 'assets/imgs/angular.svg'
    //   });
    //   this.myForm.get('productImgs').setValue(this.imgs);
    // }, 5000);
  }
}
