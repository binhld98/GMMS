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

@Injectable({ providedIn: 'root' })
export class GroupRepository implements BaseRepository<Group> {
  public static readonly COLLECTION_NAME = 'groups';
  private readonly grpColRef: CollectionReference<DocumentData>;

  constructor(private fs: Firestore) {
    this.grpColRef = collection(this.fs, GroupRepository.COLLECTION_NAME);
  }

  async getAsync(id: string): Promise<Group | null> {
    const grpRef = doc(this.fs, GroupRepository.COLLECTION_NAME, id);
    const grpDocSnap = await getDoc(grpRef);
    if (!grpDocSnap.exists()) {
      return null;
    }

    return grpDocSnap.data() as Group;
  }

  async getManyAsync(ids: string[]): Promise<Group[]> {
    const grpQry = query(this.grpColRef, where('id', 'in', ids));
    const grpsDocSnap = await getDocs(grpQry);

    if (grpsDocSnap.empty) {
      return [];
    }

    return grpsDocSnap.docs.map((d) => d.data() as Group);
  }

  async addAsync(group: Group): Promise<Group | null> {
    const grpRef = await addDoc(this.grpColRef, group);

    if (grpRef.id) {
      group.id = grpRef.id;
      return group;
    }

    return null;
  }

  async updateAsync(group: Group): Promise<boolean> {
    if (!group.id) {
      throw new Error('Entity must have id');
    }

    const grpRef = doc(this.fs, GroupRepository.COLLECTION_NAME, group.id!);
    await setDoc(grpRef, group);

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
