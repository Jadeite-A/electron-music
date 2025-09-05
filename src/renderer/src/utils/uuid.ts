import { v4 } from 'uuid'

export const isUUID = (str: unknown): str is string => {
  return (
    typeof str === 'string' &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str)
  )
}

export default {
  uuid: () => {
    return v4()
  }
}
