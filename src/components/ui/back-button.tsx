'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  label?: string
  href?: string
  onClick?: () => void
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  icon?: 'arrow' | 'chevron'
  className?: string
  showIcon?: boolean
}

export function BackButton({
  label = 'Kembali',
  href,
  onClick,
  variant = 'outline',
  size = 'default',
  icon = 'arrow',
  className,
  showIcon = true,
  ...props
}: BackButtonProps) {
  const router = useRouter()
  
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }
  
  const IconComponent = icon === 'arrow' ? ArrowLeft : ChevronLeft
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {showIcon && <IconComponent className="h-4 w-4" />}
      {label}
    </Button>
  )
}

// Specialized back buttons for different contexts
export function AdminBackButton(props: Omit<BackButtonProps, 'variant'>) {
  return <BackButton variant="outline" {...props} />
}

export function PublicBackButton(props: Omit<BackButtonProps, 'variant'>) {
  return <BackButton variant="ghost" {...props} />
}

export function SimpleBackButton(props: Omit<BackButtonProps, 'variant' | 'showIcon'>) {
  return <BackButton variant="link" showIcon={false} {...props} />
}

export default BackButton
