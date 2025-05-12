import * as lucide from 'lucide-vue-next'

const icons = {
  'chevron-down': lucide.ChevronDown,
  'chevron-up': lucide.ChevronUp,
  'chevron-left': lucide.ChevronLeft,
  'chevrons-left': lucide.ChevronsLeft,
  'chevron-right': lucide.ChevronRight,
  'chevrons-right': lucide.ChevronsRight,
  'trash-2': lucide.Trash2,
  'star': lucide.Star,
  'user': lucide.User,
  'settings': lucide.Settings,
  'log-out': lucide.LogOut,
  'box': lucide.Box,
  'check-square': lucide.CheckSquare,
  'link': lucide.Link,
  'book': lucide.Book,
  'cloud': lucide.Cloud,
  'file': lucide.File,
  'folder': lucide.Folder,
  'code': lucide.Code,
  'server': lucide.Server,
  'droplet': lucide.Droplet,
  'folder-git-2': lucide.FolderGit2,
  'power': lucide.Power,
  'check': lucide.Check,
  'loader': lucide.Loader,
  'x-circle': lucide.XCircle,
  'search': lucide.Search,
  'menu': lucide.Menu,
  'edit': lucide.Edit,
  'x': lucide.X,
  'package': lucide.Package,
  'file-search': lucide.FileSearch,
  'more-horizontal': lucide.MoreHorizontal,
  'image': lucide.Image,
  'rotate-ccw': lucide.RotateCcw,
  'scan-search': lucide.ScanSearch,
  'between-horizontal-start': lucide.BetweenHorizontalStart,
  'code-xml': lucide.CodeXml,
  'file-code-2': lucide.FileCode2,
  'upload': lucide.Upload,
  'square-check-big': lucide.SquareCheckBig,
  'bird': lucide.Bird,
}

export function iconRandomPick()
{
  const iconNames = Object.keys(icons)
  return iconNames[Math.floor(Math.random() * iconNames.length)]
}

export default icons
