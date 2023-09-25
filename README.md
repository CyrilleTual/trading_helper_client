# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# Gestion du statut visiteur :
# Dans un composant qui utilise l'id de l'user il faut substituer l'id de l'user suivi 
# à celui de l'utilisateur suivant par ce code :

```  /// gestion du statut visiteur //////////////////////////////////////

  const role = useSelector((state) => state.user.infos.role);

  let id = useSelector((state) => state.user.infos.id);
  let isVisitor = false

  if (role.substring(0, 7) === "visitor") {
    id = role.substring(8);
    isVisitor = true
  }
```

