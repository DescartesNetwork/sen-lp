export enum PoolStatus {
  Frozen = 2,
  Active = 1,
}

export enum OrderState {
  Uninitialized = 0,
  Open = 1,
  Approved = 2,
  Done = 3,
  Rejected = 4,
  Canceled = 5,
}

export enum PoolTabs {
  Sentre = 'sentre-pools',
  Deposited = 'deposited-pools',
  YourPools = 'your-pools',
  Community = 'community-pools',
}

export enum QueryParams {
  details = 'details',
  address = 'poolAddress',
  category = 'category',
}

export const VESTING = [
  { locktime: 7, discount: 0.025 },
  { locktime: 30, discount: 0.12 },
  { locktime: 60, discount: 0.265 },
  { locktime: 90, discount: 0.45 },
]
