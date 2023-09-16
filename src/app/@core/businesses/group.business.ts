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
import { InviteUserDto } from '../dtos/user.dto';

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
      .filter((g) => !!g.groupId)
      .map((g) => g.groupId!);

    if (grpUids.length == 0) {
      return [];
    }
    const grps = await this.groupRepository.getManyAsync(grpUids);
    if (grps.length == 0) {
      throw new Error('groups is empty');
    }

    // #3 --> administrators
    const admIds = grps.map((g) => g.adminId);
    const admins = await this.userRepository.getManyAsync(admIds);

    // PROCESS RESULTS
    return grps
      .map((g) => {
        const admin = admins.find((y) => y.id == g.adminId);

        return {
          id: g.id,
          groupName: g.groupName,
          avatarUrl: g.avatarUrl,
          adminId: !!admin ? admin.id : '',
          adminName: !!admin ? admin.userName : '',
        } as GroupMasterDto;
      })
      .sort((a, b) => {
        return a.groupName.localeCompare(b.groupName);
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

    const memberIds = group.users.map((u) => u.userId);
    const members = await this.userRepository.getManyAsync(memberIds);
    const admin = members.find((m) => m.id == group.adminId);

    const grpUsrDto = members
      .map((m) => {
        const grpUsr = group.users.find((y) => y.userId == m.id);

        return {
          userId: m.id,
          userName: m.userName,
          role: grpUsr?.role,
          joinedStatus: grpUsr?.status,
          joinedAt: grpUsr?.joinedAt,
        } as GroupUserDto;
      })
      .sort((a, b) => {
        return a.userName.localeCompare(b.userName);
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

  async findUsersByNameOrEmail(
    nameOrEmail: string
  ): Promise<InviteUserDto[] | []> {
    const users = await this.userRepository.findByNameOrEmailAsync(nameOrEmail);

    return users
      .map((u) => {
        return {
          id: u.id,
          userName: u.userName,
          email: u.email,
          avatarUrl: u.avatarUrl,
        } as InviteUserDto;
      })
      .sort((a, b) => {
        return a.userName.localeCompare(b.userName);
      });
  }

  async inviteMembers(
    invitorId: string,
    groupId: string,
    userIds: string[]
  ): Promise<boolean> {
    const groupUsers = userIds.map((id) => {
      return {
        groupId: groupId,
        userId: id,
        invitorId: invitorId,
        invitedAt: Timestamp.now(),
        joinedAt: null,
        status: GROUP_USER_STATUS.WAIT_CONFIRM,
        role: GROUP_USER_ROLE.MEMBER,
      } as GroupUser;
    });

    try {
      await Promise.all([
        this.userRepository.bulkUnionGroupsAsync(groupUsers),
        this.groupRepository.bulkUnionUsersAsync(groupUsers),
      ]);
      return true;
    } catch (error) {
      return false;
    }
  }

  private async updateMemberStatus(
    groupId: string,
    userId: string,
    status: GROUP_USER_STATUS
  ): Promise<void> {
    // #1 - group
    const group = await this.groupRepository.getAsync(groupId);
    if (!group) {
      throw new Error('group does not exist');
    }

    const groupUser1 = group.users.find((u) => {
      return u.groupId == groupId && u.userId == userId;
    });
    if (!groupUser1) {
      throw new Error('group-user does not exist');
    }

    // #2 - user
    const user = await this.userRepository.getAsync(userId);
    if (!user) {
      throw new Error('user does not exist');
    }

    const groupUser2 = user.groups.find((g) => {
      return g.groupId == groupId && g.userId == userId;
    });
    if (!groupUser2) {
      throw new Error('group-user does not exist');
    }

    // #3 - updating
    groupUser1.status = status;
    groupUser2.status = status;
    if (
      status == GROUP_USER_STATUS.JOINED &&
      groupUser1.joinedAt == null &&
      groupUser2.joinedAt == null
    ) {
      groupUser1.joinedAt = Timestamp.now();
      groupUser2.joinedAt = Timestamp.now();
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
    return this.updateMemberStatus(groupId, userId, GROUP_USER_STATUS.JOINED);
  }
}
