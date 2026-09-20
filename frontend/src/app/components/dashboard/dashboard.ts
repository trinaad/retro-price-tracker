import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemsService } from '../../services/items';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  items = inject(ItemsService);

  newName = signal('');
  newSearchTerm = signal('');
  newTargetPrice = signal<number | null>(null);

  ngOnInit() {
    this.items.loadItems();
  }

  async onAddItem() {
    if (!this.newName() || !this.newSearchTerm() || !this.newTargetPrice()) return;

    await this.items.addItem(this.newName(), this.newSearchTerm(), this.newTargetPrice()!);

    this.newName.set('');
    this.newSearchTerm.set('');
    this.newTargetPrice.set(null);
  }

  async onDelete(id: number) {
    await this.items.deleteItem(id);
  }
}
