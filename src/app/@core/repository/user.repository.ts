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
  private readonly colRef: CollectionReference<DocumentData>;

  constructor(private fs: Firestore) {
    this.colRef = collection(this.fs, UserRepository.COLLECTION_NAME);
  }

  async getAsync(uid: string): Promise<User | null> {
    const docRef = doc(this.fs, UserRepository.COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as User;
  }

  async getManyAsync(ids: string[]): Promise<User[] | []> {
    const _query = query(this.colRef, where('id', 'in', ids));
    const docsSnap = await getDocs(_query);
    if (docsSnap.empty) {
      return [];
    }

    return docsSnap.docs.map((d) => d.data() as User);
  }

  async addAsync(user: User): Promise<User | null> {
    throw new Error('not yet implemented');
  }

  async updateAsync(user: User): Promise<boolean> {
    if (!user.id) {
      throw new Error('Entity must have id');
    }

    const docRef = doc(this.fs, UserRepository.COLLECTION_NAME, user.id);
    await setDoc(docRef, user);

    return true;
  }

  async unionGroupAsync(grpUsr: GroupUser): Promise<boolean> {
    if (!grpUsr.groupId || !grpUsr.userId) {
      throw new Error('Entity must have id');
    }

    const docRef = doc(this.fs, UserRepository.COLLECTION_NAME, grpUsr.userId);

    await updateDoc(docRef, {
      groups: arrayUnion(grpUsr),
    });

    return true;
  }

  async findByNameOrEmailAsync(nameOrEmail: string): Promise<User[] | []> {
    if (!nameOrEmail) {
      return [];
    }

    const _query = query(
      this.colRef,
      or(
        where('userName', '==', nameOrEmail),
        where('email', '==', nameOrEmail)
      )
    );
    const docsSnap = await getDocs(_query);
    if (docsSnap.empty) {
      return [];
    }

    return docsSnap.docs.map((d) => d.data() as User);
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

  async setGroups(userId: string, groupUsers: GroupUser[]) {
    const docRef = doc(this.fs, UserRepository.COLLECTION_NAME, userId);

    return updateDoc(docRef, {
      groups: groupUsers,
    });
  }
}
