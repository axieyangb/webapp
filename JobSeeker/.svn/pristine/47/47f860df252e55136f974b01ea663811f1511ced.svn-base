import { Injectable } from '@angular/core';
import { Pager } from './pager';
@Injectable()
export class PagerService {

    getPager(totalNum: number, currentPage: number = 1, pageSize: number = 10): Pager {
        let pager = new Pager();
        pager.currentPage=currentPage;
        pager.totalNum = totalNum;
        pager.pageSize=pageSize;
        pager.totalPages = Math.ceil(totalNum / pageSize);

        if (pager.totalPages <= 10) {
            pager.startPage = 1;
            pager.endPage = pager.totalPages;
        } else {
            if (currentPage <= 6) {
                pager.startPage = 1;
                pager.endPage = 10;
            } else if (currentPage + 4 >= pager.totalPages) {
                pager.startPage = pager.totalPages - 9;
                pager.endPage = pager.totalPages;
            }
            else {
                pager.startPage = currentPage - 5;
                pager.endPage = currentPage + 4;
            }
        }
        pager.startIndex = (currentPage - 1) * pageSize;
        pager.endIndex = Math.min(pager.startIndex + pageSize - 1, totalNum - 1);
        pager.pages = [];
        for (var i: number = pager.startPage; i < pager.endPage + 1; i++) {
            pager.pages[i - pager.startPage] = i;
        }
        
        return pager;


    }
}