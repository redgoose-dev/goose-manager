import * as lucide from 'lucide-vue-next'

const icons = {
  'box': lucide.Box,
  'book': lucide.Book,
  'bubbles': lucide.Bubbles,
  'bird': lucide.Bird,
  'between-horizontal-start': lucide.BetweenHorizontalStart,
  'chevron-down': lucide.ChevronDown,
  'chevron-up': lucide.ChevronUp,
  'chevron-left': lucide.ChevronLeft,
  'chevrons-left': lucide.ChevronsLeft,
  'chevron-right': lucide.ChevronRight,
  'chevrons-right': lucide.ChevronsRight,
  'cloud': lucide.Cloud,
  'code': lucide.Code,
  'code-xml': lucide.CodeXml,
  'check': lucide.Check,
  'check-square': lucide.CheckSquare,
  'circle-slash': lucide.CircleSlash,
  'crop': lucide.Crop,
  'droplet': lucide.Droplet,
  'download': lucide.Download,
  'edit': lucide.Edit,
  'external-link': lucide.ExternalLink,
  'ellipsis': lucide.Ellipsis,
  'file': lucide.File,
  'file-search': lucide.FileSearch,
  'file-code-2': lucide.FileCode2,
  'file-image': lucide.FileImage,
  'folder': lucide.Folder,
  'folder-git-2': lucide.FolderGit2,
  'file-down': lucide.FileDown,
  'image': lucide.Image,
  'log-out': lucide.LogOut,
  'link': lucide.Link,
  'loader': lucide.Loader,
  'menu': lucide.Menu,
  'more-horizontal': lucide.MoreHorizontal,
  'power': lucide.Power,
  'package': lucide.Package,
  'rotate-ccw': lucide.RotateCcw,
  'star': lucide.Star,
  'settings': lucide.Settings,
  'server': lucide.Server,
  'search': lucide.Search,
  'scan-search': lucide.ScanSearch,
  'square-check-big': lucide.SquareCheckBig,
  'trash-2': lucide.Trash2,
  'user': lucide.User,
  'upload': lucide.Upload,
  'x-circle': lucide.XCircle,
  'x': lucide.X,
}

export function iconRandomPick()
{
  const iconNames = Object.keys(icons)
  return iconNames[Math.floor(Math.random() * iconNames.length)]
}

export default icons
