import { Injectable } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';

import { User } from '../models/user';
import { BaseRepository } from './base.repository';
import { GroupUser } from '../models/group-user';
import { DocumentData } from 'rxfire/firestore/interfaces';

@Injectable({ providedIn: 'root' })
export class UserRepository implements BaseRepository<User> {
  public static readonly COLLECTION_NAME = 'users';
  private readonly usrColRef: CollectionReference<DocumentData>;

  constructor(private fs: Firestore) {
    this.usrColRef = collection(this.fs, UserRepository.COLLECTION_NAME);
  }

  async getAsync(uid: string): Promise<User | null> {
    const usrRef = doc(this.fs, UserRepository.COLLECTION_NAME, uid);
    const usrDocSnap = await getDoc(usrRef);
    if (!usrDocSnap.exists()) {
      return null;
    }

    return usrDocSnap.data() as User;
  }

  async getManyAsync(ids: string[]): Promise<User[]> {
    const usrQry = query(this.usrColRef, where('id', 'in', ids));
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

  async unionGroupAsync(grpUsr: GroupUser): Promise<boolean> {
    if (!grpUsr.groupId || !grpUsr.userId) {
      throw new Error('Entity must have id');
    }

    const usrRef = doc(this.fs, UserRepository.COLLECTION_NAME, grpUsr.userId);

    await updateDoc(usrRef, {
      groups: arrayUnion(grpUsr),
    });

    return true;
  }

  async findByNameOrEmailAsync(nameOrEmail: string): Promise<User[] | []> {
    if (!nameOrEmail) {
      return [];
    }

    const usrQry = query(
      this.usrColRef,
      or(
        where('userName', '==', nameOrEmail),
        where('email', '==', nameOrEmail)
      ),
      orderBy('userName')
    );
    const usrDocSnap = await getDocs(usrQry);
    if (usrDocSnap.empty) {
      return [];
    }

    return usrDocSnap.docs.map((x) => x.data() as User);
  }

  async bulkUnionGroupsAsync(groupUsers: GroupUser[]): Promise<void> {
    const b = writeBatch(this.fs);

    groupUsers.forEach((gu) => {
      const docRef = doc(this.fs, UserRepository.COLLECTION_NAME, gu.userId);
      b.update(docRef, {
        groups: arrayUnion(gu),
      });
    });

    return b.commit();
  }
}
