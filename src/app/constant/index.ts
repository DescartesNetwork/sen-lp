export enum PoolStatus {
  Frozen = 2,
  Active = 1,
}

export const VESTING = [
  { locktime: 7, discount: 0.1 },
  { locktime: 15, discount: 0.25 },
  { locktime: 30, discount: 0.35 },
  { locktime: 60, discount: 0.4 },
]
