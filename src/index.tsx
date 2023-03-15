import * as ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { AppStateProvider } from './state/AppStateContext'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <DndProvider backend={HTML5Backend}>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </DndProvider>
)
