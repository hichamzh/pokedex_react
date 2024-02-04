import { useState, useEffect, useRef } from 'react'
import { Spinner, Input  } from "@material-tailwind/react";
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [filterData, setFilterdata ] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingImage, setLoadingImage] = useState(true)
  const img = useRef()

  useEffect(() => {
    const API = async () => {
      try {
        setLoading(true)
        const response  =  await fetch('https://pokeapi.co/api/v2/pokemon/?limit=500')
        const result = await response.json()

        const pokemonData = await Promise.all(
          result.results.map( async(pokemon) => {
            const pokemonResponse = await fetch(pokemon.url)
            return await pokemonResponse.json()
          })
        )
        setData(pokemonData)
        setFilterdata(pokemonData)
        setLoading(false)
        setLoadingImage(false)

      } 
      
      catch (error){
        console.log(console.error("erreur lors de la récupération d'api ", error));
      }
    }
    
    API()
  }, [])
  
  useEffect (() => {
    const filtre  = data.filter(pokemon => pokemon.name.toLowerCase().includes(search.toLowerCase()))
    setFilterdata(filtre)
  }, [data, search])
  
  const handleChange =  (e) => {
    setSearch(e.target.value)
    console.log(e.target.value);
  }

  const handleImage = (id) => {
    
  }
  

  return (
    <>
    <Input
    label="Name Pokemon" 
    value={search}
    onChange={handleChange}
    
    />
        {loadingImage ? (
          <div className='grid place-items-center h-[80vh]'>
            <Spinner className="h-16 w-16 text-gray-900/50" />
          </div>
          )  
          
          : (
            
            <div className='grid grid-cols-3 gap-5 mt-5'>
            {filterData.map((pokemon) => (
              <div  className='border rounded-lg flex justify-center items-center flex-col'  key={pokemon.name}>
               {
                loadingImage
                 ? (
                  
                   <Spinner className="h-16 w-16 text-gray-900/50"/>
                ) 
                : (
                  <>
                  
                  <p>{pokemon.name}</p>
                    <img
                  loading='eager'
                  ref={img} 
                  src={pokemon.sprites.other["official-artwork"].front_default} 
                  alt={pokemon.name} 
                  className="w-full h-full"
                
                  />
                  </>
                    )
                    
                  }
                </div>
            ))}
            </div>
           
        )

      }
    </>
  )

}

export default App
