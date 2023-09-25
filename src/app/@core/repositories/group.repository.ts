import { Injectable } from '@angular/core';

import {
  CollectionReference,
  Firestore,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';

import { BaseRepository } from './base.repository';
import { Group } from '../models/group';
import { GroupUser } from '../models/group-user';

@Injectable()
export class GroupRepository implements BaseRepository<Group> {
  public static readonly COLLECTION_NAME = 'groups';
  private readonly colRef: CollectionReference<DocumentData>;

  constructor(private fs: Firestore) {
    this.colRef = collection(this.fs, GroupRepository.COLLECTION_NAME);
  }

  async getAsync(id: string): Promise<Group | null> {
    const docRef = doc(this.fs, GroupRepository.COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as Group;
  }

  async getManyAsync(ids: string[]): Promise<Group[] | []> {
    const _query = query(this.colRef, where('id', 'in', ids));
    const docsSnap = await getDocs(_query);

    if (docsSnap.empty) {
      return [];
    }

    return docsSnap.docs.map((d) => d.data() as Group);
  }

  async addAsync(group: Group): Promise<Group | null> {
    const docRef = await addDoc(this.colRef, group);

    if (docRef.id) {
      group.id = docRef.id;
      return group;
    }

    return null;
  }

  async updateAsync(group: Group): Promise<boolean> {
    if (!group.id) {
      throw new Error('Entity must have id');
    }

    const docRef = doc(this.fs, GroupRepository.COLLECTION_NAME, group.id);
    await setDoc(docRef, group);

    return true;
  }

  async bulkUnionUsersAsync(groupUsers: GroupUser[]): Promise<void> {
    const b = writeBatch(this.fs);

    groupUsers.forEach((gu) => {
      if (!gu.groupId) {
        return;
      }
      const docRef = doc(this.fs, GroupRepository.COLLECTION_NAME, gu.groupId);
      b.update(docRef, {
        users: arrayUnion(gu),
      });
    });

    return b.commit();
  }

  async setUsers(groupId: string, groupUsers: GroupUser[]) {
    const docRef = doc(this.fs, GroupRepository.COLLECTION_NAME, groupId);

    return updateDoc(docRef, {
      users: groupUsers,
    });
  }
}
