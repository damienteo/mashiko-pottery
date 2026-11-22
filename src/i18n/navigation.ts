import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// helper components/hooks that automatically prefix links, redirects, etc.
export const { Link, usePathname, useRouter, redirect, getPathname } =
  createNavigation(routing)
