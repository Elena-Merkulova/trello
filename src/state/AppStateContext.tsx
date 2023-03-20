import React, { createContext, useReducer, useContext, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { findItemIndexById } from '../utils/findItemIndexById'
import { moveItem } from '../utils/moveItem'
import { DragItem } from '../components/DragItem'

//Define types for appData

export interface AppState {
  lists: List[]
  draggedItem?: DragItem
}

interface Task {
  id: string
  text: string
}

interface List {
  id: string
  text: string
  tasks: Task[]
}

//Provide the type for AppStateContext

interface AppStateContextProps {
  state: AppState
  dispatch: (action: Action) => void
}

//Create context using createContext method

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
)

//Create provider

export const AppStateProvider = ({ children }: React.PropsWithChildren<{}>) => {
  //Provide dispatch through the context
  const [state, dispatch] = useReducer(
    appStateReducer, JSON.parse(localStorage.getItem('items') || '{}')
  )
  
  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(state))
  }, [state])

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  )
}
//Using data from global context, implement custom hook
//Define useAppState function and
//Retrieve the  value from AppStateContext using useContext hook

export const useAppState = () => {
  return useContext(AppStateContext)
}

//Add an Action type by using discriminated union

type Action =
  | {
      type: 'ADD_LIST'
      payload: string
    }
  | {
      type: 'ADD_TASK'
      payload: {
        text: string
        taskId: string
      }
    }
  | {
      type: 'MOVE_LIST' //When we start dragging the column - we remember
      //the original position of it and
      payload: {
        //then pass it as dragIndex.
        dragIndex: number //When we hover other columns we take their positions
        hoverIndex: number //and use them as a hoverIndex.
      }
    }
  | {
      type: 'SET_DRAGGED_ITEM'
      payload: DragItem | undefined
    }
  | {
      type: 'MOVE_TASK'
      payload: {
        dragIndex: number
        hoverIndex: number
        sourceColumn: string
        targetColumn: string
      }
    }

//Define reducer

const appStateReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_LIST': {
      return {
        ...state,
        lists: [
          ...state.lists,
          { id: uuidv4(), text: action.payload, tasks: [] },
        ],
      }
    }
    case 'ADD_TASK': {
      //Find the target list index and save it to the constant.
      //Push a new task object to the list with that index.
      //Then return a new object, created from the old state
      //using object spread syntax.
      const targetListIndex = findItemIndexById(
        state.lists,
        action.payload.taskId
      )
      state.lists[targetListIndex].tasks.push({
        id: uuidv4(),
        text: action.payload.text,
      })

      return {
        ...state,
      }
    }
    case 'MOVE_LIST': {
      const { dragIndex, hoverIndex } = action.payload
      state.lists = moveItem(state.lists, dragIndex, hoverIndex)
      return {
        ...state,
      }
    }
    case 'SET_DRAGGED_ITEM': {
      return {
        ...state,
        draggedItem: action.payload,
      }
    }
    case 'MOVE_TASK': {
      const { dragIndex, hoverIndex, sourceColumn, targetColumn } =
        action.payload
      //sourceColumn and targetColumn are column ids so first, we find their
      //corresponding indices in column arrays. Then we use splice to remove
      //the card from the source column and then another splice to add it to
      //the target column.
      const sourceLaneIndex = findItemIndexById(state.lists, sourceColumn)
      const targetLaneIndex = findItemIndexById(state.lists, targetColumn)
      const item = state.lists[sourceLaneIndex].tasks.splice(dragIndex, 1)[0]
      state.lists[targetLaneIndex].tasks.splice(hoverIndex, 0, item)

      return {
        ...state,
      }
    }
    default: {
      return state
    }
  }
}
