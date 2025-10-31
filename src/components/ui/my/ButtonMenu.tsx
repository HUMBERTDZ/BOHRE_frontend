import { DropdownMenuItem } from '../dropdown-menu'

interface props {
    onClick?: () => void;
    onMouseEnter?: () => void;
    className?: string;
}

export const ButtonMenu = ({ onClick, onMouseEnter, className }: props) => {
  return (
    <DropdownMenuItem onClick={onClick} onMouseEnter={onMouseEnter} className={className}>
      
    </DropdownMenuItem>
  )
}
