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

export const VESTING = [
  { locktime: 7, discount: 0.05 },
  { locktime: 30, discount: 0.25 },
  { locktime: 60, discount: 0.35 },
  { locktime: 90, discount: 0.4 },
]
