const initialState = {
  action: {
    type: "test",
    payload: "test"
  }
};
const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "TOKEN_DATA":
      // console.log(action);
      return { ...state, action };
    case "SET_TOKEN":
      console.log(action);
      return { ...state, action };
  }
};

export default reducer;
