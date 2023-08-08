import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styles from "./create.module.css";
import {
  useGetCurrenciesQuery,
  useNewPortfolioMutation,
} from "../../../store/slice/tradeApi";
import BtnCancel from "../../../Components/UI/BtnCancel";
import BtnSubmit from "../../../Components/UI/BtnSubmit";

function Create({ setCreate }) {

  // id user
  const userId = useSelector((state) => state.user.infos.id);
  // recup des devises //const currencies = [{ id:1, title:"un"}]
  const { data: currencies, isSuccess } = useGetCurrenciesQuery()

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
    // eslint-disable-next-line
  }, [currencies]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const go = async (datas) => {
    try {
      await createPortfolio(datas);
      setValues({ ...values, ...initials });
      setCreate(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const datas = {
      title: values.title,
      comment: values.comment,
      deposit: values.deposit,
      user_id: +values.userId,
      currency_id: +values.currencyId,
      status: values.status,
    };
    go(datas);
  };

  const cancel= () =>{
    setValues({ ...values, ...initials });
    setCreate(false);
  }

  return (
    <>
      <h2>Création d'un nouveau portefeuille</h2>

      {isSuccess && (
        <form
          className={styles.form_create}
          onSubmit={handleSubmit}
          method="POST "
        >
          <label htmlFor="title">désignation</label>

          <div className={styles.input_wrap}>
            <input
              type="text"
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
            />
          </div>

          <label htmlFor="comment">commentaires</label>

          <div className={styles.input_wrap}>
            <input
              type="text"
              id="comment"
              name="comment"
              value={values.comment}
              onChange={handleChange}
            />
          </div>

          <label htmlFor="deposit">solde initial</label>

          <div className={styles.input_wrap_initAmout}>
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
                  {currency.abbr}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.btns}>
            <BtnCancel value="Abandon" action={cancel} />
            <BtnSubmit value="Validation" />
          </div>
        </form>
      )}
    </>
  );
}

export default Create;
