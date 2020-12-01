import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  
  private categoryselectSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categoryselectSubject.asObservable();

  products$ = combineLatest([
      this.productService.productWithCategory$, 
      this.categorySelectedAction$
        // .pipe(
        //   startWith(0)
        // )
    ]) 
      .pipe(
        map(([products, selectedCategoryId]) => 
          products.filter(
            (p)=> selectedCategoryId ? p.categoryId === selectedCategoryId : true)),
        catchError((err)=> {
          this.errorMessage = err;
          return EMPTY;
        })
      );

  
  categories$ = this.productCategoryService.productCategories$
  .pipe(
      tap((c)=> console.log(c)),
      catchError((err)=> {
        this.errorMessage = err;
            return EMPTY;
      })
  );

  sub: Subscription;

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categoryselectSubject.next(+categoryId);
  }
}
