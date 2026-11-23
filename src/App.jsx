import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Login from './components/pages/login.jsx'
import Info from './components/pages/info.jsx'
import BeforeTuto from './components/pages/beforetuto.jsx'
import Tuto from './components/pages/tuto.jsx'
import MainPage from './components/pages/main.jsx'

function App() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('splash')
  const [userName, setUserName] = useState('회원')

  useEffect(() => {
    if (screen !== 'splash') return undefined

    const timeoutId = window.setTimeout(() => setScreen('login'), 3000)
    return () => window.clearTimeout(timeoutId)
  }, [screen])

  useEffect(() => {
    if (screen !== 'info') return undefined

    const timeoutId = window.setTimeout(() => setScreen('beforetuto'), 5000)
    return () => window.clearTimeout(timeoutId)
  }, [screen])

  function handleLoginSuccess(user) {
    const name =
      user?.kakao_account?.profile?.nickname ??
      user?.profile?.nickname ??
      user?.properties?.nickname ??
      user?.nickname ??
      user?.name ??
      user?.displayName

    setUserName(typeof name === 'string' && name.trim() ? name.trim() : '회원')
    setScreen('info')
  }

  if (screen === 'splash') {
    return <MainPage />
  }

  if (screen === 'info') {
    return (
      <Info
        name={userName}
        onContinue={() => setScreen('beforetuto')}
      />
    )
  }

  if (screen === 'beforetuto') {
    return <BeforeTuto onSelect={() => setScreen('tuto')} />
  }

  if (screen === 'tuto') {
    return <Tuto onContinue={() => navigate('/units/unit1')} />
  }

  return (
    <Login
      onLoginSuccess={handleLoginSuccess}
      onSkipTutorial={() => navigate('/units/unit1')}
    />
  )
}

export default App
