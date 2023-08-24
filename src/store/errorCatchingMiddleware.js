import {  isRejectedWithValue } from "@reduxjs/toolkit"; // utilitaire qui action de rejet

export const rtkQueryErrorLogger = () => (next) => (action) => {

    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these use matchers!
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!');
    window.location.href = "/errorServer";
  }

  return next(action);
};


