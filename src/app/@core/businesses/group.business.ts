import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { UserRepository } from '../repository/user.repository';
import { GroupRepository } from '../repository/group.repository';
import { GroupDto } from '../dtos/group.dto';
import { GROUP_STATUS, Group } from '../models/group';
import { GROUP_USER_STATUS, GroupUser } from '../models/group-user';
import { Timestamp } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class GroupBusiness {
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
    const grpUids = usr.groups
      .filter((x) => !!x.groupId)
      .map((x) => x.groupId!);

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
    return grps
      .sort((a, b) => {
        return a.createdAt.seconds - b.createdAt.seconds;
      })
      .map((x) => {
        const admin = admins.find((y) => y.id == x.adminId);

        return {
          id: x.id,
          name: x.groupName,
          avatarUrl: x.avatarUrl,
          admin: !!admin ? admin.userName : '',
        } as GroupDto;
      });
  }

  createNewGroup(
    groupName: string,
    groupDescription: string,
    userId: string
  ): Observable<string | null> {
    const subject = new Subject<string | null>();

    this._createNewGroup(groupName, groupDescription, userId).then((x) => {
      subject.next(x);
    });

    return subject;
  }

  private async _createNewGroup(
    groupName: string,
    groupDescription: string,
    userId: string
  ): Promise<string | null> {
    const groupUser = {
      groupId: null,
      userId: userId,
      invitorId: null,
      invitedAt: null,
      joinedAt: Timestamp.now(),
      status: GROUP_USER_STATUS.JOINED,
    } as GroupUser;

    const group = {
      id: null,
      creatorId: userId,
      createdAt: Timestamp.now(),
      modifiedInfos: [],
      isActive: true,
      groupName: groupName,
      groupDescription: groupDescription,
      avatarUrl: '/assets/logo.svg',
      adminId: userId,
      status: GROUP_STATUS.CREATED,
      users: [groupUser],
    } as Group;

    // #1 add group
    const groupAdded = await this.groupRepository.addAsync(group);
    if (!groupAdded) {
      return null;
    }

    // #2 update group + user
    group.id = groupAdded.id;
    groupUser.groupId = groupAdded.id;

    const updatedResults = await Promise.all([
      this.groupRepository.updateAsync(group),
      this.userRepository.unionGroupAsync(groupUser),
    ]);

    if (updatedResults.indexOf(false) == -1) {
      return groupAdded.id;
    }

    return null;
  }
}
