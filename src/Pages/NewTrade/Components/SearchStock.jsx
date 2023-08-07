import { useState } from "react";
import { useSearchStocksQuery } from "../../../store/slice/tradeApi";
import styles from "./searchStock.module.css";

function SearchStock({ selectedItem, setSelectedItem }) {

  const [stock, setstock] = useState({
    id: 0,
    title: "",
    isin: 0,
    place: "",
    ticker: "",
  });

  const [skip, setSkip] = useState(true);

  const { data: searchResult, isSuccess: searchIsSuccess } =
    useSearchStocksQuery(stock.title, { skip });

  const handleInputChange = (e) => {
    setstock({ ...stock, title: e.target.value });
    e.target.value.length > 2 ? setSkip(false) : setSkip(true);
  };

  return (
    <div className={styles.search}>
      <h2>Sélection d'instrument : </h2>
      <form>
        <label htmlFor="stock">votre recherche :  </label>
        <input
          type="stock"
          name="stock"
          id="stock"
          placeholder="minimum 3 caractères"
          value={stock.title}
          onChange={handleInputChange}
          autoFocus
        />
      </form>
      {searchIsSuccess  && searchResult.length===0 &&
      <p> Aucun resultat </p>
      }
      {searchIsSuccess  && searchResult.length>0 &&
        <>
          <table>
            <thead>
              <tr>
                <th>code Isin</th>
                <th>nom</th>
                <th>ticker</th>
                <th>place</th>
              </tr>
            </thead>
            <tbody>
              {searchResult.map((item, i) => (
                <tr
                  key={i}
                  onClick={() =>
                    setSelectedItem({
                      id: item.id,
                      title: item.title,
                      isin: item.isin,
                      place: item.place,
                      ticker: item.ticker,
                    })
                  }
                >
                  <td>{item.isin}</td>
                  <td>{item.title}</td>
                  <td>{item.ticker}</td>
                  <td>{item.place}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      }
    </div>
  );
}

export default SearchStock;
