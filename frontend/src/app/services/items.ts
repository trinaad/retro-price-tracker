import { Injectable, signal } from '@angular/core';

export interface TrackedItem {
  id: number;
  name: string;
  search_term: string;
  target_price: number;
  email: string;
  created_at: string;
  last_price: number | null;
  last_checked: string | null;
}

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private apiUrl = 'http://localhost:3001/api/items';

  items = signal<TrackedItem[]>([]);

  getSavedEmail(): string | null {
    return localStorage.getItem('retro_tracker_email');
  }

  saveEmail(email: string) {
    localStorage.setItem('retro_tracker_email', email);
  }

  async loadItems() {
    const res = await fetch(this.apiUrl);
    const data = await res.json();
    this.items.set(data);
  }

  async addItem(name: string, search_term: string, target_price: number, email: string) {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, search_term, target_price, email }),
    });
    const newItem = await res.json();
    await this.loadItems();
    return newItem;
  }

  async deleteItem(id: number) {
    await fetch(`${this.apiUrl}/${id}`, { method: 'DELETE' });
    await this.loadItems();
  }

  async previewSearch(term: string) {
    const res = await fetch(
      `http://localhost:3001/api/items/search-preview/${encodeURIComponent(term)}`,
    );
    return res.json();
  }

  async checkNow() {
    await fetch('http://localhost:3001/api/check-now', { method: 'POST' });
    await this.loadItems(); // refresh to show updated "last seen" prices
  }
}
