
import styles from './InvocacionButton.module.scss';

interface Props {
  onClick: () => void;
}

export const InvocacionButton = ({ onClick }: Props) => {
  return (
    <button onClick={onClick} className={styles.invocacionButton}>
      <span>Invocar Modelo 3D</span>
    </button>
  );
};