import { Injectable } from '@angular/core';
import {
  Firestore,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';

import { User } from '../models/user';
import { BaseRepository } from './base.repository';
import { GroupUser } from '../models/group-user';

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
    const usrQry = query(usrColRef, where('id', 'in', ids));
    const usrDocSnap = await getDocs(usrQry);
    if (usrDocSnap.empty) {
      return [];
    }

    return usrDocSnap.docs.map((x) => x.data() as User);
  }

  async addAsync(user: User): Promise<User | null> {
    throw new Error('not yet implemented');
  }

  async updateAsync(user: User): Promise<boolean> {
    if (!user.id) {
      throw new Error('Entity must have id');
    }

    const usrRef = doc(this.fs, UserRepository.COLLECTION_NAME, user.id!);
    await setDoc(usrRef, user);

    return true;
  }

  async unionGroupAsync(grpUsr: GroupUser) : Promise<boolean> {
    if (!grpUsr.groupId || !grpUsr.userId) {
      throw new Error('Entity must have id');
    }

    const usrRef = doc(this.fs, UserRepository.COLLECTION_NAME, grpUsr.userId);

    await updateDoc(usrRef, {
      groups: arrayUnion(grpUsr),
    });

    return true;
  }
}
