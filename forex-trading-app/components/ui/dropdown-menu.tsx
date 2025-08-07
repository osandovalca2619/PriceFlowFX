import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative inline-block">{children}</div>
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ 
  asChild, 
  children 
}) => {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      'data-dropdown-trigger': true
    })
  }
  return <div data-dropdown-trigger>{children}</div>
}

interface DropdownMenuContentProps {
  align?: 'start' | 'center' | 'end'
  className?: string
  children: React.ReactNode
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ 
  align = 'start',
  className,
  children 
}) => {
  return (
    <div className={cn(
      "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      align === 'end' && 'right-0',
      align === 'center' && 'left-1/2 -translate-x-1/2',
      className
    )}>
      {children}
    </div>
  )
}

interface DropdownMenuItemProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ 
  className,
  children,
  onClick 
}) => {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface DropdownMenuLabelProps {
  className?: string
  children: React.ReactNode
}

export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({ 
  className,
  children 
}) => {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
      {children}
    </div>
  )
}

export const DropdownMenuSeparator: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
}