import './App.css';
import Create from './components/Create';
import Read from './components/Read';
import Update from './components/Update';
import UsersData from './components/usersData';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<UsersData />}></Route>
        <Route path='/create' element={<Create />}></Route>
        <Route path='/update/:id' element={<Update />}></Route>
        <Route path='/read/:id' element={<Read />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
