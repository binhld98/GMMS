import { Injectable } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';

import { Payment } from '../models/payment';
import { BaseRepository } from './base.repository';
import { DocumentData } from 'rxfire/firestore/interfaces';

@Injectable({ providedIn: 'root' })
export class PaymentRepository implements BaseRepository<Payment> {
  public static readonly COLLECTION_NAME = 'payments';
  private readonly colRef: CollectionReference<DocumentData>;

  constructor(private fs: Firestore) {
    this.colRef = collection(this.fs, PaymentRepository.COLLECTION_NAME);
  }

  async getAsync(uid: string): Promise<Payment | null> {
    const docRef = doc(this.fs, PaymentRepository.COLLECTION_NAME, uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }

    return docSnap.data() as Payment;
  }

  async getManyAsync(ids: string[]): Promise<Payment[] | []> {
    const _query = query(this.colRef, where('id', 'in', ids));
    const docsSnap = await getDocs(_query);
    if (docsSnap.empty) {
      return [];
    }

    return docsSnap.docs.map((d) => d.data() as Payment);
  }

  async addAsync(payment: Payment): Promise<Payment | null> {
    const docRef = await addDoc(this.colRef, payment);

    if (docRef.id) {
      payment.id = docRef.id;
      return payment;
    }

    return null;
  }

  async updateAsync(payment: Payment): Promise<boolean> {
    if (!payment.id) {
      throw new Error('Entity must have id');
    }

    const docRef = doc(this.fs, PaymentRepository.COLLECTION_NAME, payment.id);
    await setDoc(docRef, payment);

    return true;
  }
}
