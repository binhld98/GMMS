import { Injectable } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

import { UserRepository } from '../repository/user.repository';
import { GroupRepository } from '../repository/group.repository';
import { GROUP_STATUS, Group } from '../models/group';
import {
  GROUP_USER_ROLE,
  GROUP_USER_STATUS,
  GroupUser,
} from '../models/group-user';

import {
  GroupDetailDto,
  GroupMasterDto,
  GroupUserDto,
} from '../dtos/group.dto';
import { UserDto } from '../dtos/user.dto';

@Injectable({ providedIn: 'root' })
export class GroupBusiness {
  public static readonly COLLECTION_NAME = 'users';

  constructor(
    private userRepository: UserRepository,
    private groupRepository: GroupRepository
  ) {}

  async getJoinedGroupsByUserId(userId: string): Promise<GroupMasterDto[]> {
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
          groupName: x.groupName,
          avatarUrl: x.avatarUrl,
          adminName: !!admin ? admin.userName : '',
        } as GroupMasterDto;
      });
  }

  async createNewGroup(
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
      role: GROUP_USER_ROLE.ADMIN,
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

  async getGroupDetail(groupId: string): Promise<GroupDetailDto | null> {
    const group = await this.groupRepository.getAsync(groupId);
    if (group == null) {
      return null;
    }

    const memberIds = group.users.map((x) => x.userId);
    const members = await this.userRepository.getManyAsync(memberIds);
    const admin = members.find((x) => x.id == group.adminId);

    const grpUsrDto = members.map((x) => {
      const grpUsr = group.users.find((y) => y.userId == x.id);

      return {
        userId: x.id,
        userName: x.userName,
        role: grpUsr?.role,
        joinedStatus: grpUsr?.status,
        joinedAt: grpUsr?.joinedAt,
      } as GroupUserDto;
    });

    return {
      id: group.id,
      groupName: group.groupName,
      description: group.groupDescription,
      adminId: group.adminId,
      adminName: admin?.userName,
      avatarUrl: group.avatarUrl,
      users: grpUsrDto,
    } as GroupDetailDto;
  }

  async findUsersByNameOrEmail(nameOrEmail: string): Promise<UserDto[] | []> {
    const users = await this.userRepository.findByNameOrEmailAsync(nameOrEmail);

    return users.map((x) => {
      return {
        id: x.id,
        userName: x.userName,
        email: x.email,
        avatarUrl: x.avatarUrl,
      } as UserDto;
    });
  }
}
