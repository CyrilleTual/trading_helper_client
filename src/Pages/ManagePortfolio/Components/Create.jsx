import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styles from "./create.module.css";
import { useGetCurrenciesQuery, useNewPortfolioMutation } from "../../../store/slice/tradeApi";
import { useNavigate } from "react-router-dom";

function Create({setCreate}) {
  const navigate = useNavigate();
  // id user
  const userId = useSelector((state) => state.user.infos.id);
  // recup des devises

  //const currencies = [{ id:1, title:"un"}]
  const { data: currencies, isSuccess, isError } = useGetCurrenciesQuery();

  // newportfolio 

  const [createPortfolio] = useNewPortfolioMutation();
  // formulaire
  const initials = {
    title: "",
    comment: "",
    userId: userId,
    deposit: 0,
    currencyId: 0,
    status: "active",
  };


  const [values, setValues] = useState(initials);

  // set de la valeur par défaut de le liste des devises
  useEffect(() => {
    if (isSuccess) {
      const toset = currencies[0].id;
      setValues({ ...values, currencyId: toset });
    }
  }, [currencies]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const go = async(datas) => {
     try {
       const res = await createPortfolio(datas);
       console.log(res);
       setValues({...values, ...initials })
       setCreate(false);
     } catch (err) {
      console.log(err);
    }
  }




  const handleSubmit = (e) => {
    e.preventDefault();
    const datas ={
      title: values.title,
      comment: values.comment,
      deposit: values.deposit,
      user_id: +values.userId,
      currency_id: +values.currencyId,
      status: values.status
    }
    go(datas)
  };

  return (
    <main>
      <h2>Création d'un nouveau portefeuille</h2>

      {isSuccess && (
        <form className={styles.form} onSubmit={handleSubmit} method="POST ">
          <label className={styles.label} htmlFor="title">
            designation
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={values.title}
            onChange={handleChange}
          />

          <label className={styles.label} htmlFor="comment">
            Commentaire
          </label>
          <input
            type="text"
            id="comment"
            name="comment"
            value={values.comment}
            onChange={handleChange}
          />
          <label className={styles.label} htmlFor="deposit">
            solde initial
          </label>
          <input
            type="number"
            id="deposit"
            name="deposit"
            min="0"
            value={values.deposit}
            onChange={handleChange}
          />
          <select
            onChange={handleChange}
            id="currencyId"
            name="currencyId"
            value={values.currencyId}
          >
            {currencies.map((currency, i) => (
              <option key={i} value={currency.id}>
                {currency.title}
              </option>
            ))}
          </select>
          <input type="submit" value="Validation" />
        </form>
      )}
    </main>
  );
}

export default Create;
