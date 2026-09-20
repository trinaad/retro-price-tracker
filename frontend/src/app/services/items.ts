import { Injectable, signal } from '@angular/core';

export interface TrackedItem {
  id: number;
  name: string;
  search_term: string;
  target_price: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private apiUrl = 'http://localhost:3001/api/items';

  items = signal<TrackedItem[]>([]);

  async loadItems() {
    const res = await fetch(this.apiUrl);
    const data = await res.json();
    this.items.set(data);
  }

  async addItem(name: string, search_term: string, target_price: number) {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, search_term, target_price }),
    });
    const newItem = await res.json();
    await this.loadItems(); // refresh the list
    return newItem;
  }

  async deleteItem(id: number) {
    await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
    await this.loadItems();
  }
}
