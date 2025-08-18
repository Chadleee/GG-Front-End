import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CustomThemeProvider from './components/ThemeProvider.jsx'
import AppProvider from './contexts/AppContext.jsx'
import CharacterProvider from './contexts/CharacterContext.jsx'
import MemberProvider from './contexts/MemberContext.jsx'
import ChangeRequestProvider from './contexts/ChangeRequestContext.jsx'

createRoot(document.getElementById('root')).render(
  <CustomThemeProvider>
    <AppProvider>
      <CharacterProvider>
        <MemberProvider>
          <ChangeRequestProvider>
            <App />
          </ChangeRequestProvider>
        </MemberProvider>
      </CharacterProvider>
    </AppProvider>
  </CustomThemeProvider>,
)
