import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { UserRepository } from '../repository/user.repository';
import { GroupRepository } from '../repository/group.repository';
import { GroupDto } from '../dtos/group.dto';

@Injectable({ providedIn: 'root' })
export class UserBusiness {
  public static readonly COLLECTION_NAME = 'users';

  constructor(
    private userRepository: UserRepository,
    private groupRepository: GroupRepository
  ) {}

  getJoinedGroupsByUserId(userId: string): Observable<GroupDto[]> {
    const subject = new Subject<GroupDto[]>();

    this._getJoinedGroupsByUserId(userId).then((x) => {
      subject.next(x);
    });

    return subject;
  }

  private async _getJoinedGroupsByUserId(userId: string): Promise<GroupDto[]> {
    // #1 --> user
    const usr = await this.userRepository.getAsync(userId);
    if (!usr) {
      throw new Error('user is null');
    }

    // #2 --> joined groups
    const grpUids = usr.groups.map((x) => x.groupId);
    if (grpUids.length == 0) {
      return [];
    }
    const grps = await this.groupRepository.getManyAsync(grpUids);
    if (grps.length == 0) {
      throw new Error('groups is empty');
    }

    // #3 --> administrators
    const admIds = grps.map((x) => x.adminId);
    const admins = await this.userRepository.getManyAsync(admIds);

    // PROCESS RESULTS
    return grps.map((x) => {
      const admin = admins.find((y) => y.id == x.adminId);

      return {
        id: x.id,
        name: x.groupName,
        avatarUrl: x.avatarUrl,
        admin: !!admin ? admin.userName : '',
      } as GroupDto;
    });
  }
}
