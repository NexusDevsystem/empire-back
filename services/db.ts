import { Item, Contract, Client } from '../types';

const DB_NAME = 'EmpireERP_DB';
const DB_VERSION = 4; // Bumped for Employees

export const STORES = {
    ITEMS: 'items',
    CONTRACTS: 'contracts',
    CLIENTS: 'clients',
    APPOINTMENTS: 'appointments',
    TRANSACTIONS: 'transactions',
    EMPLOYEES: 'employees'
};

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            if (!db.objectStoreNames.contains(STORES.ITEMS)) {
                db.createObjectStore(STORES.ITEMS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.CONTRACTS)) {
                db.createObjectStore(STORES.CONTRACTS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.CLIENTS)) {
                db.createObjectStore(STORES.CLIENTS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.APPOINTMENTS)) {
                db.createObjectStore(STORES.APPOINTMENTS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.TRANSACTIONS)) {
                db.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORES.EMPLOYEES)) {
                db.createObjectStore(STORES.EMPLOYEES, { keyPath: 'id' });
            }
        };
    });
};

export const getAll = <T>(storeName: string): Promise<T[]> => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await initDB();
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
};

export const save = <T>(storeName: string, data: T): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await initDB();
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
};

export const remove = (storeName: string, id: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await initDB();
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
};

// Batch save for initialization or migration
export const saveAll = <T>(storeName: string, dataArray: T[]): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await initDB();
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);

            dataArray.forEach(item => store.put(item));

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        } catch (error) {
            reject(error);
        }
    });
};
