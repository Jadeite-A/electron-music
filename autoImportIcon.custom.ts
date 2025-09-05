export const ElementPlusIconsResolver = (options = { prefix: 'Use' }) => {
  return (name: string) => {
    const { prefix } = options

    if (!name.startsWith(prefix)) {
      return
    }

    const iconName = name.slice(prefix.length)
    return { importName: iconName, path: '@element-plus/icons-vue' }
  }
}
