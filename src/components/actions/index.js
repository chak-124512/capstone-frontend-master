export const getData = (rowData, colData) => {
  // alert(data);
  return {
    type: "TOKEN_DATA",
    payload: { rowData, colData }
  };
};

export const setToken = data => {
  alert(data);
  return {
    type: "SET_TOKEN",
    payload: data
  };
};
