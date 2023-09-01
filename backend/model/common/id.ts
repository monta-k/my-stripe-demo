import { v4 as uuidv4 } from 'uuid'
import * as zod from 'zod'

export const idSchema = zod.string().uuid()

export type IdValue = zod.infer<typeof idSchema>

export class Id {
  value: IdValue

  constructor() {
    const id = uuidv4()
    idSchema.parse(id)
    this.value = id
    Object.freeze(this)
  }
}
