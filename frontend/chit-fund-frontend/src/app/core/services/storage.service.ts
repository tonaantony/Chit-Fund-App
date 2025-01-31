// import { Injectable } from '@angular/core';
// import { openDB, IDBPDatabase } from 'idb';

// @Injectable({
//   providedIn: 'root'
// })
// export class StorageService {
//   private dbName = 'chitFundDB';
//   private db: Promise<IDBPDatabase>;

//   constructor() {
//     this.db = this.initDB();
//   }

//   private async initDB() {
//     return await openDB(this.dbName, 1, {
//       upgrade(db: IDBPDatabase) {
//         if (!db.objectStoreNames.contains('auth')) {
//           db.createObjectStore('auth');
//         }
//       }
//     });
//   }

//   async setItem(key: string, value: any): Promise<void> {
//     const db = await this.db;
//     await db.put('auth', value, key);
//   }

//   async getItem(key: string): Promise<any> {
//     const db = await this.db;
//     return await db.get('auth', key);
//   }

//   async removeItem(key: string): Promise<void> {
//     const db = await this.db;
//     await db.delete('auth', key);
//   }

//   async clear(): Promise<void> {
//     const db = await this.db;
//     await db.clear('auth');
//   }
// }

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbName = 'chitFundDB';
  private db: Promise<IDBPDatabase | null>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.db = this.initDB();
    } else {
      this.db = Promise.resolve(null);
    }
  }

  private async initDB() {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    
    try {
      return await openDB(this.dbName, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('auth')) {
            db.createObjectStore('auth');
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize IndexedDB, falling back to memory storage:', error);
      return null;
    }
  }

  async setItem(key: string, value: any): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const db = await this.db;
      if (db) {
        await db.put('auth', value, key);
      } else {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Storage operation failed, using sessionStorage:', error);
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  async getItem(key: string): Promise<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      const db = await this.db;
      if (db) {
        return await db.get('auth', key);
      } else {
        const value = sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
    } catch (error) {
      console.error('Storage operation failed, using sessionStorage:', error);
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
  }

  async removeItem(key: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const db = await this.db;
      if (db) {
        await db.delete('auth', key);
      } else {
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Storage operation failed, using sessionStorage:', error);
      sessionStorage.removeItem(key);
    }
  }

  async clear(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const db = await this.db;
      if (db) {
        await db.clear('auth');
      } else {
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Storage operation failed, using sessionStorage:', error);
      sessionStorage.clear();
    }
  }
}