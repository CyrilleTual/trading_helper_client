import { createSlice } from "@reduxjs/toolkit";

// gestion de l'état de l'utilisateur 
const userSlice = createSlice({
  name: "user",
  initialState: {
    infos: null, // infos sous forme d'objet : id, alias, email et role
    isLogged: false, // est log ou non 
  },
  reducers: {
    signIn(state, action) {
      state.infos = action.payload;
      state.isLogged = true;
    },
    signOut(state, action) {
      state.infos = null;
      state.isLogged = false;
    },
  },
});

export const { signIn, signOut } = userSlice.actions;
export const userReducer = userSlice.reducer
