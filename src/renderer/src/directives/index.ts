const getAllDirectives = () => {
  const modules: any = import.meta.glob('./utils/**/*.ts', { eager: true })

  const directives = Object.keys(modules).reduce((directive, directivePath) => {
    const directiveName = directivePath.replace('utils/', '').replace(/^\.\/(.*)\.\w+$/, '$1')
    directive[directiveName] = modules[directivePath].default
    return directive
  }, {})

  return directives
}

export default {
  install: async (Vue) => {
    const directives = getAllDirectives()
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
  }
}
