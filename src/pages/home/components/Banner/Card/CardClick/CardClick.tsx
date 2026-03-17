import { Link } from "react-router-dom"
import { Card } from "../Card"
interface CardClickProps {
    children: React.ReactNode
    to: string
    bg: string
}

export const CardClick = ({children, to, bg}: CardClickProps) => {
  return (
    <Card className="group h-96">
        <Link className="h-full flex justify-center items-center" to={to}>
            <span 
                style={{backgroundImage: `url(${bg})`}}
                className='absolute w-full h-full bg-cover bg-center contrast-75 group-hover:contrast-75 group-hover:brightness-50 group-hover:scale-110 transition-all ease-in-out'>
            </span>
            <p className="text-2xl text-primary z-10 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out">{children}</p>
        </Link>
    </Card>
  )
}
