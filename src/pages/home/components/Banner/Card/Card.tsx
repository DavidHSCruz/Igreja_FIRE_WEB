interface CardProps {
  children?: React.ReactNode
  className?: string
}

export const Card = ({ children, className }: CardProps) => {
  return <div className={`${className} bg-quaternary rounded-2xl relative overflow-hidden`}>{children}</div>
}

