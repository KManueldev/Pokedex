import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './index.scss'
import { Home, PokeDetail } from './pages';
import PokemonProvider from './context/PokemonContext';

const router = createHashRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/:pokeId',
    element: <PokeDetail />
  }
])

createRoot(document.getElementById('root')!).render(
  
  <PokemonProvider>
    <RouterProvider router={router}/>
  </PokemonProvider>
    
  
);
