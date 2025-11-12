import { PokemonCard } from '../PokemonCard';
import styles from './styles.module.scss';

interface Props {
    pokemonsUrls?: string[] | null;
    page: number;
    perPage: number;
}

/*En el pokemonsUrls realizamos la paginación de los elementos de la página
organizando los items de la api en 12 secciones en total 
*/
export const PokemonList = ({pokemonsUrls, page, perPage}: Props) => {
    return (
        <div className={styles.pokemons}>
            {pokemonsUrls?.slice((page - 1) * perPage, (page - 1) * perPage + perPage)
            .map((pokemonsUrl) => (
                <PokemonCard key={pokemonsUrl} url={pokemonsUrl} />
            ))}
        </div>
    )
}