import { XYCoord, useDragLayer } from 'react-dnd'
import { CustomDragLayerContainer } from '../styles'
import { Column } from './Column'
import { Card } from './Card'

//Get the dragged item coordinates from react-dnd and
//generate the styles with the transform attribute to move the preview around.

function getItemStyles(currentOffset: XYCoord | null): React.CSSProperties {
  if (!currentOffset) {
    return {
      display: 'none',
    }
  }

  const { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

//Create a CustomDragLayer component.
//Use useDragLayer hook to obtain isDragging flag and currently dragged item object.
//Then we render layout if isDragging is true, otherwise, we return null and render
//nothing.
//Use an actual Column component to render a preview. We pass it id, index and text
//from the item object.

export const CustomDragLayer: React.FC = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }))

  if (!isDragging) {
    return null
  }

  return isDragging ? (
    <CustomDragLayerContainer>
      <div style={getItemStyles(currentOffset)}>
        {item.type === 'COLUMN' ? (
          <Column
            id={item.id}
            text={item.text}
            index={item.index}
            isPreview={true}
          />
        ) : (
          <Card
            columnId={item.columnId}
            id={item.id}
            text={item.text}
            index={item.index}
            isPreview={true}
          />
        )}
      </div>
    </CustomDragLayerContainer>
  ) : null
}
