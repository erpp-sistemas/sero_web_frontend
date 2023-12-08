import { Paper, List } from "@mui/material";

const styles = {
  listItem: {
    padding: "0",
  },
  listItemText: {
    fontSize: "16px",
  },
  paper: {
    padding: "10px",
    paddingLeft: "10px",
    display: "flex",
    justifyContent: "center",
  },

  item: {
    display: "flex",
    alignItems: " center",
    gap: "40px",
    width: "300px",
    maxWidth: "100%",
    justifyContent: "space-between",
    paddingRight: "20px",
  },
  itemTitle: {
    fontWeight: "500",
    color: "#164388",
    margin: "0",
  },
  itemContent: {
    color: "#189c4b",
    margin: "0",
    textAlign: 'end'
  },
};


//import './styles/ListIData.css'

const ListDictionary = ({ children: _children, list }) => {
  return (
    <Paper style={styles.paper}>
      <List>
        {Object.entries(list).map(([term, content], _index) => (
          <li key={term} style={styles.item}>
            <p style={styles.itemTitle}>{term}</p>
            <p style={styles.itemContent}>{content}</p>
          </li>
        ))} 
      </List> 
    </Paper>
  );
};

export default ListDictionary;
