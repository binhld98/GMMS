import { Injectable } from '@angular/core';

import { Firestore, collection, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { BaseRepository } from './base.repository';
import { Group } from '../models/group';

@Injectable({ providedIn: 'root' })
export class GroupRepository implements BaseRepository<Group> {
  public static readonly COLLECTION_NAME = 'groups';

  constructor(private fs: Firestore) {}

  async getAsync(id: string): Promise<Group | null> {
    const grpRef = doc(this.fs, GroupRepository.COLLECTION_NAME, id);
    const grpDocSnap = await getDoc(grpRef);
    if (!grpDocSnap.exists()) {
      return null;
    }

    return grpDocSnap.data() as Group;
  }

  async getManyAsync(ids: string[]): Promise<Group[]> {
    const grpColRef = collection(this.fs, GroupRepository.COLLECTION_NAME);
    const grpQry = query(grpColRef, where('id', 'in', ids));
    const grpsDocSnap = await getDocs(grpQry);

    if (grpsDocSnap.empty) {
      return [];
    }

    return grpsDocSnap.docs.map(x => x.data() as Group);
  }
}
