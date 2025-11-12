import { createContext, useEffect, useState } from "react";
import type { AllPokemonsResult, PokemonsByTypeResult, PokeType } from "../interface/types";
import axios from "axios";

interface ContextProps {
    types: PokeType[]
    filterSelected: PokeType
    pokemonsFiltered: string[] | null
    changeTypeSelected: (type: PokeType) => void
}
// Se crea un objeto con las propiedades de ContextProps
export const PokemonContext = createContext<ContextProps>({} as ContextProps)

const PokemonProvider = ({children}: any) => {
    
    let allPokemonUrl = "https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0";
    
    const defaultState: PokeType = {
        name: "All",
        url: allPokemonUrl,
    }

    const[allPokemons, setAllPokemons] = useState(null);
    const[pokemonsFiltered, setPokemonsFiltered] = useState(null);

    const [types, setTypes] = useState([defaultState]);
    const [filterSelected, setFilterSelected] = useState(defaultState);

    const changeTypeSelected = async (type: PokeType) => {
        setFilterSelected(type);
        
        const { data } = await axios.get(type?.url!);
        let pokemons = data?.pokemon?.map(
            ({pokemon}: PokemonsByTypeResult) => pokemon?.url
        );

        type.name !== "All"
        ? setPokemonsFiltered(pokemons)
        : setPokemonsFiltered(allPokemons);


    };

    const getPokemonsType = async () => {
        const { data } = await axios.get("https://pokeapi.co/api/v2/type");
        
        setTypes([...types, ...data.results]);
    };

    //Función para traer todos los pokemons
    const getAllPokemons = async () => {
        const { data } = await axios.get(allPokemonUrl);

        let pokemons = data?.results?.map(
            (pokemon: AllPokemonsResult) => pokemon?.url
        );

        setAllPokemons(pokemons);
        setPokemonsFiltered(pokemons);

    }

    //Nos trae todos los pokemones
    useEffect(() => {
        getPokemonsType();
        getAllPokemons();
    }, [])


    return (
        <PokemonContext.Provider value={
            {
                types, 
                filterSelected, 
                pokemonsFiltered, 
                changeTypeSelected,
            }}>
            {children}
        </PokemonContext.Provider>
    )
}


export default PokemonProvider