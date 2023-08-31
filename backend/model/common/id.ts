import uuid from 'uuid'
import * as zod from 'zod'

export const idSchema = zod.string().uuid()

export type IdValue = zod.infer<typeof idSchema>

export class Id {
  value: IdValue

  constructor() {
    const id = uuid.v4()
    idSchema.parse(id)
    this.value = id
    Object.freeze(this)
  }
}
