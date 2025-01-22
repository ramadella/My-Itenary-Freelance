
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from '../src/components/dashboard'
import Wisata from '../src/components/wisata/wisata'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/wisata' element={<Wisata />} />

      </Routes>
    </BrowserRouter>

  );
}

export default App;
