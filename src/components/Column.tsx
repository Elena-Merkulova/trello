import { useRef } from 'react'
import { ColumnContainer, ColumnTitle } from '../styles'
import { useDrop } from 'react-dnd'
import { AddNewItem } from './AddNewItem'
import { useAppState } from '../state/AppStateContext'
import { Card } from './Card'
import { useItemDrag } from '../utils/useItemDrag'
import { DragItem } from './DragItem'
import { isHidden } from '../utils/isHidden'

interface ColumnProps {
  text: string
  index: number
  id: string
  isPreview?: boolean
}

//Call useAppState to get the data.
//Then get the column by index. That is why we are passing it as a prop
//to the Column component.
//Then we iterate over the cards and render the Card components.
export const Column = ({ text, index, id, isPreview }: ColumnProps) => {
  const { state, dispatch } = useAppState()
  const ref = useRef<HTMLDivElement>(null)

  const { drag } = useItemDrag({ type: 'COLUMN', id, index, text })

  //Move the column. We pass the accepted item type and then define the hover callback.
  //The hover callback is triggered whenever you move the dragged item above the drop target.
  //Inside the hover callback we check that dragIndex and hoverIndex are not the same.
  //Which means we are not hovering above the dragged item.
  //If the gragIndex and hoverIndex are different - we dispatch a MOVE_LIST action.

  const [, drop] = useDrop({
    accept: ['COLUMN', 'CARD'],
    hover(item: DragItem) {
      if (item.type === 'COLUMN') {
        const dragIndex = item.index
        const hoverIndex = index

        if (dragIndex === hoverIndex) {
          return
        }

        dispatch({ type: 'MOVE_LIST', payload: { dragIndex, hoverIndex } })

        item.index = hoverIndex
      } else {
        const dragIndex = item.index
        const hoverIndex = 0
        const sourceColumn = item.columnId
        const targetColumn = id

        if (sourceColumn === targetColumn) {
          return
        }

        dispatch({
          type: 'MOVE_TASK',
          payload: { dragIndex, hoverIndex, sourceColumn, targetColumn },
        })

        item.index = hoverIndex
        item.columnId = targetColumn
      }
    },
  })

  drag(drop(ref))

  return (
    <ColumnContainer
      isPreview={isPreview}
      ref={ref}
      isHidden={isHidden(isPreview, state.draggedItem, 'COLUMN', id)}
    >
      <ColumnTitle> {text} </ColumnTitle>
      {state.lists[index].tasks.map((task, i) => (
        <Card
          id={task.id}
          text={task.text}
          key={task.id}
          index={i}
          columnId={id}
        />
      ))}
      <AddNewItem
        toggleButtonText='+ Add another task'
        onAdd={(text) =>
          dispatch({ type: 'ADD_TASK', payload: { text, taskId: id } })
        }
        dark
      />
    </ColumnContainer>
  )
}
