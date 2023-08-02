import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetPortfoliosByUserQuery } from "../../store/slice/tradeApi";
import styles from "./managePortfolio.module.css";
import Details from "./Components/Details";
import BtnAction from "../../Components/UI/BtnAction";
import Create from "./Components/Create";
import Existing from "./Components/Existing";

function ManagePortfolio() {
  const id = useSelector((state) => state.user.infos.id);

  // liste des portfolios
  const {
    data: portfolios,
    isLoading
  } = useGetPortfoliosByUserQuery(id);

  const [manageExisting, setManageExisting] = useState(false);
  const [create, setCreate] = useState(false);

  const handleClickManage = () => {
    setManageExisting(!manageExisting);
    if (create) setCreate(false);
  };
  const handleClickCreate = () => {
    setCreate(!create);
    if (manageExisting) setManageExisting(false);
  };

  return (
    <>
      {isLoading ? (
        <p>loading</p>
      ) : (
        <div>
          <main className={styles.managePort}>
            <h1>Gestion des portefeuilles</h1>
            <table>
              <thead>
                <tr>
                  <th>portefeuille</th>
                  <th>versé</th>
                  <th>exposition</th>
                  <th>liquidités</th>
                  <th>valorisation</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map((item, i) => (
                  <Details key={i} portfolio={item} />
                ))}
              </tbody>
            </table>

            <BtnAction
              value={"Gérer existant"}
              action={handleClickManage}
            />
            <BtnAction
              value={"Créer  nouveau "}
              action={handleClickCreate}
            />

            {manageExisting && 
              <Existing portfolios={portfolios} isLoading={isLoading} />
            }
            {create && 
              <Create setCreate={setCreate}/>
            }
            
          </main>
        </div>
      )}
    </>
  );
}

export default ManagePortfolio;
