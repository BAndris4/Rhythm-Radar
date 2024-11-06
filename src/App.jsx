import {Routes, Route, BrowserRouter} from 'react-router-dom'
import Login from "./pages/Login.jsx"
import Profile from "./pages/Profile.jsx"
import Tracks from './pages/Tracks.jsx'
import Artists from './pages/Artists.jsx'
import RecentlyPlayed from './pages/RecentlyPlayed.jsx'

function App() {
  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route index element={<Login></Login>}></Route>
            <Route path='/login' element={<Login></Login>}></Route>
            <Route path='/profile' element={<Profile></Profile>}></Route>
            <Route path='/tracks' element={<Tracks></Tracks>}></Route>
            <Route path='/artists' element={<Artists></Artists>}></Route>
            <Route path='/recently-played' element={<RecentlyPlayed></RecentlyPlayed>}></Route>
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
