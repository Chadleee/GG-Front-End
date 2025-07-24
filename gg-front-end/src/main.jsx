import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CustomThemeProvider from './components/ThemeProvider.jsx'
import AppProvider from './contexts/AppContext.jsx'
import CharacterProvider from './contexts/CharacterContext.jsx'
import MemberProvider from './contexts/MemberContext.jsx'

createRoot(document.getElementById('root')).render(
  <CustomThemeProvider>
    <AppProvider>
      <CharacterProvider>
        <MemberProvider>
          <App />
        </MemberProvider>
      </CharacterProvider>
    </AppProvider>
  </CustomThemeProvider>,
)
