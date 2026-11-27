// Lokale Speicherung im Browser (IndexedDB). Nichts verlässt das Gerät.

export type Condition = 'mint' | 'gut' | 'gebraucht' | 'defekt';

export interface Owned {
  phoneId: string;
  photo: Blob;
  caughtAt: string; // ISO-Datum
  condition: Condition;
  note: string;
}

const DB_NAME = 'retro-handy-dex';
const STORE = 'owned';

let dbPromise: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'phoneId' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(req.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

export const getAll = () => tx<Owned[]>('readonly', (s) => s.getAll());
export const put = (o: Owned) => tx('readwrite', (s) => s.put(o));
export const remove = (id: string) => tx('readwrite', (s) => s.delete(id));
export const clear = () => tx('readwrite', (s) => s.clear());

// ---------- Backup ----------

interface BackupEntry extends Omit<Owned, 'photo'> {
  photo: string; // data URL
}

function blobToDataUrl(b: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(b);
  });
}

export async function exportBackup(): Promise<Blob> {
  const all = await getAll();
  const entries: BackupEntry[] = await Promise.all(
    all.map(async (o) => ({ ...o, photo: await blobToDataUrl(o.photo) })),
  );
  const json = JSON.stringify({ app: 'retro-handy-dex', version: 1, entries });
  return new Blob([json], { type: 'application/json' });
}

export async function importBackup(file: File): Promise<number> {
  const data = JSON.parse(await file.text());
  if (data?.app !== 'retro-handy-dex' || !Array.isArray(data.entries)) {
    throw new Error('Das ist keine Handy-Dex-Sicherung.');
  }
  for (const e of data.entries as BackupEntry[]) {
    const photo = await (await fetch(e.photo)).blob();
    await put({ ...e, photo });
  }
  return data.entries.length;
}
