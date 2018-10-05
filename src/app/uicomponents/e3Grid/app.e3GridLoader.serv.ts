import {AppE3GridService} from './app.e3Grid.Service';
import { Injectable } from '@angular/core';
import {gridOptions} from './E3GridOptions';
import * as _ from 'lodash';
declare const $: any;
@Injectable()
export class AppE3GridLoader {
    private gridOptions = null;
    constructor(private appE3GridService: AppE3GridService) {
        this.gridOptions = gridOptions;
    }

    init = (paramOptions) => {
    }
}
