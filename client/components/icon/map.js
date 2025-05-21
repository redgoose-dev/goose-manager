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
  'file-search': lucide.FileSearch,
  'file-code-2': lucide.FileCode2,
  'file-image': lucide.FileImage,
  'folder': lucide.Folder,
  'folder-git-2': lucide.FolderGit2,
  'code': lucide.Code,
  'code-xml': lucide.CodeXml,
  'server': lucide.Server,
  'droplet': lucide.Droplet,
  'power': lucide.Power,
  'check': lucide.Check,
  'loader': lucide.Loader,
  'x-circle': lucide.XCircle,
  'search': lucide.Search,
  'menu': lucide.Menu,
  'edit': lucide.Edit,
  'x': lucide.X,
  'package': lucide.Package,
  'more-horizontal': lucide.MoreHorizontal,
  'image': lucide.Image,
  'rotate-ccw': lucide.RotateCcw,
  'scan-search': lucide.ScanSearch,
  'between-horizontal-start': lucide.BetweenHorizontalStart,
  'upload': lucide.Upload,
  'square-check-big': lucide.SquareCheckBig,
  'bird': lucide.Bird,
  'circle-slash': lucide.CircleSlash,
}

export function iconRandomPick()
{
  const iconNames = Object.keys(icons)
  return iconNames[Math.floor(Math.random() * iconNames.length)]
}

export default icons
