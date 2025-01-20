import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
  }

  editProduct(id: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to edit a product.');
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(productId: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete a product.');
      this.router.navigate(['/login']);
      return;
    }
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.loadProducts(); // Refresh the product list
      },
      error: (err) => {
        console.error('Error deleting product:', err);
      },
    });
  }
}
