import { Injectable } from '@angular/core';

import { Firestore, collection, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { User } from '../models/user';
import { BaseRepository } from './base.repository';

@Injectable({ providedIn: 'root' })
export class UserRepository implements BaseRepository<User> {
  public static readonly COLLECTION_NAME = 'users';

  constructor(private fs: Firestore) {}

  async getAsync(uid: string): Promise<User | null> {
    const usrRef = doc(this.fs, UserRepository.COLLECTION_NAME, uid);
    const usrDocSnap = await getDoc(usrRef);
    if (!usrDocSnap.exists()) {
      return null;
    }

    return usrDocSnap.data() as User;
  }

  async getManyAsync(ids: string[]): Promise<User[]> {
    const usrColRef = collection(this.fs, UserRepository.COLLECTION_NAME);
    const usrQry = query(usrColRef, where('id', 'in', ids))
    const usrDocSnap = await getDocs(usrQry);
    if (usrDocSnap.empty) {
      return [];
    }

    return usrDocSnap.docs.map(x => x.data() as User);
  }
}
