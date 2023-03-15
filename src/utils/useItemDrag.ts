import { DragItem } from './../components/DragItem'
import { useEffect } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useAppState } from "../state/AppStateContext";

//useItemDrag hook returns a drag method that accepts the ref of a draggable 
//element. 
//We start dragging the item - the hook will dispatch a SET_DRAG_ITEM action 
//to save the item in the app state.
//When we stop dragging it will dispatch this action again with undefined as payload

export const useItemDrag = (item: DragItem) => {
    const { dispatch } = useAppState()
    const [ , drag, preview ] = useDrag({
        type: item.type,
     
        item: () => {
            dispatch({
                type: 'SET_DRAGGED_ITEM',
                payload: item
            })
            return item
        },

        end: () =>
        dispatch({
            type: 'SET_DRAGGED_ITEM',
            payload: undefined
        }),
    })

    //Hide the default drag preview

    useEffect(() => {
        preview(getEmptyImage(), {captureDraggingState: true});
     }, [preview]);
     
    return {drag}
}