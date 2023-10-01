export enum GROUP_USER_STATUS {
  JOINED = 1,
  WAIT_CONFIRM = 2,
  DEACTIVATED = 3,
}

export enum GROUP_USER_ROLE {
  ADMIN = 1,
  MEMBER = 2,
}

export enum GROUP_STATUS {
  CREATED = 1,
}

export enum PAYMENT_STATUS {
  DRAFT = 1,
  WAIT_APPROVE = 2,
  REJECTED = 3,
  APPROVED = 4,
  SETTLED = 5,
  DUPPLICATE_SETTLED = 6,
}

export enum TAG_COLOR {
  DEFAULT = 'default',
  MAGENTA = 'magenta',
  RED = 'red',
  VOLCANO = 'volcano',
  ORANGE = 'orange',
  GOLD = 'gold',
  YELLOW = 'yellow',
  LIME = 'lime',
  GREEN = 'green',
  CYAN = 'cyan',
  BLUE = 'blue',
  GEEKBLUE = 'geekblue',
  PURPLE = 'purple',
}
