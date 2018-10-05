import { Injectable } from '@angular/core';

declare const utils: any;

@Injectable()
export class AppLoaderService {
    private isLoad = false;
    private isLoaderDisable = false;

    constructor() {}

    setLoadState(load) {
        this.isLoad  = load && !this.isLoaderDisable;
    }

    getLoadState = () => {
        return this.isLoad;
    }

    setLoaderDisable(flag) {
        this.isLoaderDisable = flag;
    }

}

