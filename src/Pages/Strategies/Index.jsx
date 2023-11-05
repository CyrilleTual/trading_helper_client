import {  useSelector } from "react-redux";
import { Loading } from "../../Components/Loading/Index";
import {
  useGetStategiesByUserIdQuery,
} from "../../store/slice/tradeApi";
import { useState} from "react";
import styles from "./strategies.module.css";
import BtnAction from "../../Components/UI/BtnAction";

import Create from "./Components/Create";
import Existing from "./Components/Existing";


function Strategies() {
  // liste des portfolios de l'user
  let id = useSelector((state) => state.user.infos.id);

   const {
     data: strategies,
     isLoading,
     isError,
   } = useGetStategiesByUserIdQuery(id);

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
        <Loading />
      ) : (
        !isError && (
          <main className={styles.manageStrategies}>
            <h1>Gestion des stratégies</h1>
            {strategies.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Dénomination</th>
                  </tr>
                </thead>
                <tbody>
                  {strategies.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className={styles.wrapper}>
              <div className={styles.btns}>
                {strategies.length > 0 && (
                  <BtnAction
                    value={"Gérer existant"}
                    action={handleClickManage}
                    name={"gérer existant"}
                  />
                )}
                <BtnAction
                  value={"Créer  nouveau "}
                  action={handleClickCreate}
                  name={"nouveau"}
                />
              </div>

              {manageExisting && (
                <Existing
                  strategies={strategies}
                  isLoading={isLoading}
                  setManageExisting={setManageExisting}
                />
              )}
              {create && <Create setCreate={setCreate} strategies={strategies} />}
            </div>
          </main>
        )
      )}
    </>
  );
}

export default Strategies