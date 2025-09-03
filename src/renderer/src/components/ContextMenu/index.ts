export const getPosInfo = (x, y, clientY = 0, binding) => {
  // window width/height
  const windowW = window.innerWidth
  const windowH = window.innerHeight

  // distance to window right
  // const dtr = windowW - clientX;
  // distance to window bottom
  const dtb = windowH - clientY

  let realW = 150
  const { useDefaultsAll, menuItems } = binding
  menuItems.forEach((item) => {
    if (item.label) {
      const compW = item.label.length * 6 + 38
      if (compW > realW) {
        realW = compW
      }
    }
  })
  const realH = useDefaultsAll
    ? (3 + menuItems.length) * 12 * 2 + 0.4 * 12 * 2
    : menuItems.length * 12 * 2 + 0.4 * 12 * 2

  let displayX = x
  let displayY = y
  // 获取最大深度
  function getTreeDepth(items) {
    let max = 0
    items.forEach((item) => {
      if (item?.subItems?.length) {
        max = Math.max(getTreeDepth(item.subItems), max)
      }
    })
    return 1 + max
  }
  const maxDep = getTreeDepth(menuItems)
  const endX = realW * maxDep + displayX
  let direction = 'right'
  if (endX > windowW) {
    // left;
    direction = 'left'
    displayX = displayX - realW
  }

  // Here the height identification is compatible with 20px height.
  // Because here, if the mouse is particularly close to the bottom, the menu displayed close to the bottom of the browser window is not particularly user-friendly.
  if (dtb <= realH + 20) {
    displayY -= realH
  }
  return { displayX, displayY, direction }
}
