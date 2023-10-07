import { Injectable } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

import {
  GROUP_USER_ROLE,
  GROUP_USER_STATUS,
} from '../constants/common.constant';
import { CommonUtil } from '../utils/common.util';
import { UserRepository } from '../repositories/user.repository';
import { GroupRepository } from '../repositories/group.repository';
import { Group } from '../models/group';
import { GroupUser } from '../models/group-user';
import { GroupInUserDto, UserInGroupDto } from '../dtos/group.dto';
import { SimpleUserDto } from '../dtos/user.dto';

@Injectable()
export class GroupBusiness {
  public static readonly COLLECTION_NAME = 'users';

  constructor(
    private userRepository: UserRepository,
    private groupRepository: GroupRepository
  ) {}

  /**
   *
   * @param userId
   * @returns List groups in user - sort by group name
   */
  async getListGroupInUser(userId: string) {
    const user = await this.userRepository.getAsync(userId);
    if (user == null) {
      throw new Error('nullable user');
    }

    if (user.groups.length == 0) {
      return [];
    }
    const groupUserIds = user.groups.map((g) => g.groupId);
    const groups = await this.groupRepository.getManyAsync(groupUserIds);

    const adminIds = CommonUtil.arrayDistinct(groups, 'adminId').map(
      (g) => g.adminId
    );
    const admins = await this.userRepository.getManyAsync(adminIds);

    // PROCESS RESULTS
    return groups
      .map((g) => {
        const admin = admins.find((a) => a.id == g.adminId)!;
        const groupUser = user.groups.find((g) => g.groupId == g.groupId)!;
        return {
          groupId: g.id,
          groupName: g.groupName,
          adminId: admin.id,
          adminName: admin.userName,
          groupUserStatus: groupUser.groupUserStatus,
        } as GroupInUserDto;
      })
      .sort((a, b) => {
        return a.groupName.localeCompare(b.groupName);
      });
  }

  /**
   *
   * @param groupId
   * @returns List users in group - sort by user name
   */
  async getListUserInGroup(groupId: string) {
    const group = await this.groupRepository.getAsync(groupId);
    if (group == null) {
      throw new Error('nullable group');
    }

    const memberIds = group.users.map((u) => u.userId);
    const members = await this.userRepository.getManyAsync(memberIds);

    // PROCESS RESULTS
    return members
      .map((m) => {
        const groupUser = group.users.find((u) => u.userId == m.id)!;
        return {
          userId: m.id,
          userName: m.userName,
          role: groupUser.role,
          groupUserStatus: groupUser.groupUserStatus,
          invitedAt: groupUser.invitedAt?.toDate(),
          joinedAt: groupUser.joinedAt?.toDate(),
          deactivatedAt: groupUser.deactivatedAt?.toDate(),
          activatedAt: groupUser.activatedAt?.toDate(),
        } as UserInGroupDto;
      })
      .sort((a, b) => {
        return a.userName.localeCompare(b.userName);
      });
  }

  async createNewGroup(
    groupName: string,
    groupDescription: string,
    userId: string
  ) {
    const group = {
      id: null,
      creatorId: userId,
      createdAt: Timestamp.now(),
      isActive: true,
      groupName: groupName,
      groupDescription: groupDescription,
      adminId: userId,
      users: [],
    } as Group;

    // #1 add group
    const groupAdded = await this.groupRepository.addAsync(group);
    if (groupAdded == null) {
      throw new Error('cannot add new group');
    }

    // #2.1 update group
    const groupUser = {
      groupId: groupAdded.id!,
      userId: userId,
      invitorId: null,
      invitedAt: null,
      joinedAt: Timestamp.now(),
      deactivatedAt: null,
      activatedAt: null,
      groupUserStatus: GROUP_USER_STATUS.JOINED,
      role: GROUP_USER_ROLE.ADMIN,
    } as GroupUser;
    groupAdded.users = [groupUser];
    await this.groupRepository.updateAsync(groupAdded);

    // #2.2 update user
    await this.userRepository.unionGroupAsync(groupUser);

    const admin = (await this.userRepository.getAsync(groupAdded.adminId))!;
    const gu = groupAdded.users.find((u) => u.userId == userId)!;

    return {
      adminId: admin.id,
      adminName: admin.userName,
      groupId: groupAdded.id,
      groupName: groupAdded.groupName,
      groupUserStatus: gu.groupUserStatus,
    } as GroupInUserDto;
  }

  /**
   *
   * @param nameOrEmail
   * @returns List of user - sort by user name
   */
  async findUsersByNameOrEmail(nameOrEmail: string) {
    const users = await this.userRepository.findByNameOrEmailAsync(nameOrEmail);

    return users
      .map((u) => {
        return {
          userId: u.id!,
          userName: u.userName,
          email: u.email,
          createdAt: u.createdAt.toDate(),
          creatorId: u.creatorId,
        } as SimpleUserDto;
      })
      .sort((a, b) => {
        return a.userName.localeCompare(b.userName);
      });
  }

  async inviteMembers(invitorId: string, groupId: string, userIds: string[]) {
    const groupUsers = userIds.map((id) => {
      return {
        groupId: groupId,
        userId: id,
        invitorId: invitorId,
        role: GROUP_USER_ROLE.MEMBER,
        groupUserStatus: GROUP_USER_STATUS.INVITED,
        invitedAt: Timestamp.now(),
        joinedAt: null,
        deactivatedAt: null,
        activatedAt: null,
      } as GroupUser;
    });

    await Promise.all([
      this.userRepository.bulkUnionGroupsAsync(groupUsers),
      this.groupRepository.bulkUnionUsersAsync(groupUsers),
    ]);

    const users = await this.userRepository.getManyAsync(userIds);

    return groupUsers
      .map((gu) => {
        const user = users.find((u) => u.id == gu.userId)!;

        return {
          userId: gu.userId,
          userName: user.userName,
          role: gu.role,
          groupUserStatus: gu.groupUserStatus,
          invitedAt: gu.invitedAt?.toDate(),
          joinedAt: gu.joinedAt?.toDate(),
          deactivatedAt: gu.deactivatedAt?.toDate(),
          activatedAt: gu.activatedAt?.toDate(),
        } as UserInGroupDto;
      })
      .sort((a, b) => {
        return a.userName.localeCompare(b.userName);
      });
  }

  private async updateMemberStatus(
    groupId: string,
    userId: string,
    status: GROUP_USER_STATUS
  ) {
    // #1 - group
    const group = await this.groupRepository.getAsync(groupId);
    if (group == null) {
      throw new Error('nullable group');
    }

    const groupUser1 = group.users.find((u) => {
      return u.groupId == groupId && u.userId == userId;
    });
    if (groupUser1 == null) {
      throw new Error('nullable group-user 1');
    }

    // #2 - user
    const user = await this.userRepository.getAsync(userId);
    if (!user) {
      throw new Error('nullable user');
    }

    const groupUser2 = user.groups.find((g) => {
      return g.groupId == groupId && g.userId == userId;
    });
    if (groupUser2 == null) {
      throw new Error('nullable group-user 2');
    }

    // #3 - updating
    groupUser1.groupUserStatus = status;
    groupUser2.groupUserStatus = status;
    if (status == GROUP_USER_STATUS.JOINED) {
      groupUser1.joinedAt = Timestamp.now();
      groupUser2.joinedAt = Timestamp.now();
    } else if (status == GROUP_USER_STATUS.DEACTIVATED) {
      groupUser1.deactivatedAt = Timestamp.now();
      groupUser2.deactivatedAt = Timestamp.now();
    } else if (status == GROUP_USER_STATUS.ACTIVATED) {
      groupUser1.activatedAt = Timestamp.now();
      groupUser2.activatedAt = Timestamp.now();
    }

    await Promise.all([
      this.groupRepository.setUsers(groupId, group.users),
      this.userRepository.setGroups(userId, user.groups),
    ]);
  }

  async deactivateMember(groupId: string, userId: string): Promise<void> {
    return this.updateMemberStatus(
      groupId,
      userId,
      GROUP_USER_STATUS.DEACTIVATED
    );
  }

  async activateMember(groupId: string, userId: string): Promise<void> {
    return this.updateMemberStatus(
      groupId,
      userId,
      GROUP_USER_STATUS.ACTIVATED
    );
  }
}
