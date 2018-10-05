import { Component , OnInit, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import {AppLoaderService} from './services/app.loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges, AfterViewInit  {
  title = 'app';
  constructor(private loader: AppLoaderService, private cd: ChangeDetectorRef) {}

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.cd.detectChanges();
  }

  ngAfterViewInit () {
    this.cd.detectChanges();
  }

  getLoader = () => {
    return this.loader.getLoadState() || false;
  }

}
