import { useRouter } from 'vue-router'

export const router = useRouter()

console.log('🐦‍🔥 router', router)
export default {
  push: router.push,
  replace: router.replace,
  go: router.go
}
