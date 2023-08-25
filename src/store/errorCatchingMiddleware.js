import {isRejectedWithValue } from "@reduxjs/toolkit"; // utilitaire qui action de rejet

export const rtkQueryErrorLogger = () => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these use matchers!

  if (isRejectedWithValue(action)) {
    const errorCode = action.payload.status;
    if (errorCode === 404) {
      window.location.href = "/notFound";
    } else if (errorCode !== 401 && errorCode !== 400 && errorCode !== 422) {
      window.location.href = "/errorServer";
    }
    console.warn("We got a rejected action!");
  }

  return next(action);
};
