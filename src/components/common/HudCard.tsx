import { ReactNode } from 'react'

interface HudCardProps {
    children: ReactNode
    className?: string
    title?: string
    subtitle?: string
    action?: ReactNode
    noPadding?: boolean
    clickable?: boolean
    onClick?: () => void
    style?: React.CSSProperties
}

const HudCard = ({
    children,
    className = '',
    title,
    subtitle,
    action,
    noPadding = false,
    clickable = false,
    onClick,
    style,
}: HudCardProps) => {
    return (
        <div
            className={`hud-card hud-card-bottom rounded-lg ${className} ${clickable ? 'cursor-pointer hover-accent-bg transition-all duration-300' : ''}`}
            onClick={onClick}
            style={clickable ? { cursor: 'pointer', ...style } : style}
        >
            {(title || action) && (
                <div className="flex items-center justify-between px-5 py-4 border-b border-hud-border-secondary">
                    <div>
                        {title && (
                            <h3 className="font-semibold text-hud-text-primary">{title}</h3>
                        )}
                        {subtitle && (
                            <p className="text-sm text-hud-text-muted mt-0.5">{subtitle}</p>
                        )}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={noPadding ? '' : 'p-5'}>
                {children}
            </div>
        </div>
    )
}

export default HudCard
