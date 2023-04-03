import { useRef } from 'react'
import { useDrop } from 'react-dnd'
import { CardDragItem } from './DragItem'
import { CardContainer } from '../styles'
import { useAppState } from '../state/AppStateContext'
import { useItemDrag } from '../utils/useItemDrag'


interface CardProps {
  text: string
  index: number
  id: string
  columnId: string
  isPreview?: boolean
}

export const Card = ({ text, columnId, id, index, isPreview }: CardProps) => {
  const { dispatch } = useAppState()
  const ref = useRef<HTMLDivElement>(null)
  const { drag } = useItemDrag({ type: 'CARD', index, id, columnId, text })

  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item: CardDragItem) {
      if (item.id === id) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index
      const sourceColumn = item.columnId
      const targetColumn = columnId

      dispatch({
        type: 'MOVE_TASK',
        payload: {
          dragIndex,
          hoverIndex,
          sourceColumn,
          targetColumn,
        },
      })
      item.index = hoverIndex
      item.columnId = targetColumn
    },
  })

  drag(drop(ref))

  return (
    <CardContainer
      ref={ref}
    >
      {text}
    </CardContainer>
  )
}
