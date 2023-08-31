export type Result<T, E> = Success<T> | Failure<E>

export class Success<T> {
  readonly isSuccess = true
  readonly isFailure = false
  constructor(readonly value: T) {}
}

export class Failure<E> {
  readonly isSuccess = false
  readonly isFailure = true
  constructor(readonly value: E) {}
}
