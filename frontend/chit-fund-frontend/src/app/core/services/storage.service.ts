import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbName = 'chitFundDB';
  private db: Promise<IDBPDatabase>;

  constructor() {
    this.db = this.initDB();
  }

  private async initDB() {
    return await openDB(this.dbName, 1, {
      upgrade(db: IDBPDatabase) {
        if (!db.objectStoreNames.contains('auth')) {
          db.createObjectStore('auth');
        }
      }
    });
  }

  async setItem(key: string, value: any): Promise<void> {
    const db = await this.db;
    await db.put('auth', value, key);
  }

  async getItem(key: string): Promise<any> {
    const db = await this.db;
    return await db.get('auth', key);
  }

  async removeItem(key: string): Promise<void> {
    const db = await this.db;
    await db.delete('auth', key);
  }

  async clear(): Promise<void> {
    const db = await this.db;
    await db.clear('auth');
  }
}