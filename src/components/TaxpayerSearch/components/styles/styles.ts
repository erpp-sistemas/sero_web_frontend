import Styles from "../Custom/Styles";

const styles: Styles  = {
  card: {
    width: "500px",
    maxWidth: "100%",
  },
  title: {
    color: 'rgb(35, 97, 152)',
    width: '100%', 
    margin: '20px',
    textShadow: '-9px 13px 17px #4c5b69',
    fontWeight: '700',
  },
  container: {
    display: 'flex',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignContent: 'space-around',
    gap: '20px'
  },
  containerArticle: {
    flexGrow: 1,
    maxWidth: '350px',
    boxShadow: '0px 0px 1px 1px',
    borderRadius: '10px',
    padding: '10px'
  },
  article: { 
    justifyContent: "center",
    flexGrow: 1
  },
  listItem: {
    padding: "0", // Elimina el relleno de los elementos de lista
  },
  listItemText: {
    fontSize: "16px", // Tamaño de fuente de los elementos de lista
  },
  paper: {
    padding: "20px", // Espacio interior del papel
  },
  iconSubtitle: {
    fontSize: "25px",
  },
  when_files_dragging: {
    
  }
};

export default styles;