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
  file: File | null = null;
  fileError = '';

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileError = '';
    } else {
      this.fileError = 'Please select a valid file.';
      this.file = null;
    }
  }

  onSubmit(): void {
    // console.log(this.productForm.value);
    // if (!this.file) {
    //   this.fileError = 'Image file is required.';
    //   return;
    // }
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price.toString());
    if (this.file) {
      formData.append('image', this.file);
    }

    if (this.isEditMode && this.productId) {
      // Updating product
      this.productService
        .updateProduct(this.productId, this.productForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Error updating product:', err);
          },
        });
    } else {
      // Adding new product
      this.productService.addProductWithFile(formData).subscribe({
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
