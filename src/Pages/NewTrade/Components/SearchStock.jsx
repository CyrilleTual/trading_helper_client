import { useState, useEffect } from "react";
import { useSearchStocksQuery } from "../../../store/slice/tradeApi";

function SearchStock({selectedItem, setSelectedItem} ) {

    const [stock, setstock] = useState({
      id: 0,
      title: "",
      isin: 0,
      place: "",
      ticker: "",
    });
  

  const handleInputChange = (e) => {
    setstock({ ...stock, title: e.target.value });
  };


  const { data: searchResult, isSuccess: searchIsSuccess } =
    useSearchStocksQuery(stock.title);

  return (
    <>
      <form>
        <label htmlFor="stock">stock :</label>
        <input
          type="stock"
          name="stock"
          id="stock"
          value={stock.title}
          onChange={handleInputChange}
        />
      </form>
      {!searchIsSuccess ? (
        <p>Recherche par nom</p>
      ) : (
        <>
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
        </>
      )}
    </>
  );
}

export default SearchStock;
