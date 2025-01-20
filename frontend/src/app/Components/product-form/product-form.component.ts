import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');

      if (this.productId) {
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: string): void {
    this.productService.getProductById(id).subscribe((product) => {
      console.log('loaded product', product);

      this.productForm.patchValue(product);
    });
  }

  onSubmit(): void {
    console.log(this.productForm.value);

    // if (this.productForm.invalid) {
    //   return;
    // }

    if (this.isEditMode && this.productId) {
      // Updating product
      this.productService
        .updateProduct(this.productId, this.productForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/']); // Redirect to the products list or another view
          },
          error: (err) => {
            console.error('Error updating product:', err);
          },
        });
    } else {
      // Adding new product
      this.productService.addProduct(this.productForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error adding product:', err);
        },
      });
    }
  }
}
