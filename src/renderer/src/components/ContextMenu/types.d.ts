export interface Separator {
  type: 'separator',
  value?: string
}
export interface MenuItem {
  value?: string,
  label: string,
  icon?: string,
  subItems?: Array<MenuItem | Separator>
  click?: () => void
}

export interface ContextMenuOptions {
  visible: boolean,
  menuItems: Array<MenuItem | Separator>,
  useIcon?: boolean,
  useDefaultsAll?: boolean,
  useDefaults?: string[]
}

export default ContextMenuOptions;
