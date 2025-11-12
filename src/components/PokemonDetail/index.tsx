
import { useState } from "react";
import type { IPokemon } from "../../interface/interfaces";
import { background } from "../../utils/BackgroundsByType";
import { Loader } from "../Loader";
import { BaseStats } from "./components/BaseStats";
import { Header } from "./components/Header";
import { PokeTypes } from "./components/PokeTypes";
import { Stats } from "./components/Stats";
import { Title } from "./components/Title";
import { InvocacionButton } from "./components/InvocacionButton/InvocacionButton";
import { PokeViewer } from "./components/PokeViewer/Pokemon3DViewer";


import styles from "./styles.module.scss";


interface Props {
  pokemon: IPokemon | null;
}

export const PokemonDetail = ({ pokemon }: Props) => {
  const [show3D, setShow3D] = useState(false);
  
  /* @ts-ignore */
  const backgroundSelected = background[pokemon?.types[0]?.type?.name];

  if (!pokemon) {
    return (
      <div
        style={{ background: backgroundSelected }}
        className={styles.loadingContainer}
      >
        <Loader size={50} color="fff" />
      </div>
    );
  }

  return (
    <div style={{ background: backgroundSelected }} className={styles.bg}>
      <Header pokemon={pokemon} />
      <div className={styles.info}>
        <img
          src={
            pokemon?.sprites?.other?.dream_world?.front_default ||
            pokemon?.sprites?.front_default
          }
          alt={pokemon?.name}
        />
        <PokeTypes pokemon={pokemon} />
        <Title content="About" backgroundSelected={backgroundSelected} />
        <Stats pokemon={pokemon} />
        <Title content="Base Stats" backgroundSelected={backgroundSelected} />
        <BaseStats pokemon={pokemon} backgroundSelected={backgroundSelected} />
        <InvocacionButton onClick={() => setShow3D(true)} />
        
      </div>
      
      {show3D && (
        <PokeViewer
          pokemonId={pokemon.id} 
          onClose={() => setShow3D(false)} 
        />
      )}
    </div>
  );
};