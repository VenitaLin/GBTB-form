import * as Utils from "../utils";
import axios from "axios";

export const validateForm = (props) => {
  if (!props.fullName || !props.division || !props.department) {
    return false;
  } else {
    return true;
  }
};

export const setFormProps = (props) => {
  let _spForm = {
    Title: props.fullName,
    division: props.division,
    department: props.department,
    IDOV: props.IDOV,
  };
  return _spForm;
};

export const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const createForm = (siteDetails, data) => {
  let uri =
    siteDetails.siteUrl +
    "/_api/web/lists/getbytitle('" +
    siteDetails.formListName +
    "')/items";

  let _spForm = setFormProps(data);
  return new Promise((resolve, reject) => {
    Utils.postData(siteDetails.spHttpClient, uri, JSON.stringify(_spForm)).then(
      (response) => {
        if (response.status === 201) {
          resolve(true);
        } else {
          reject(response);
        }
      }
    );
  });
};

export const getList = async (siteDetails, listName) => {
  let uri =
    siteDetails.siteUrl +
    "/_api/web/lists/getbytitle('" +
    listName +
    "')/items";

  var result = {};
  await axios.get(uri).then((response) => {
    if (response.status === 200) {
      result = response.data.value;
    }
  });
  return result;
};

export const formatDropList = (data) => {
  var listItems = [];
  for (var k in data) {
    listItems.push({ key: k, text: data[k].Title });
  }
  return listItems;
}

export const getUser = (siteDetails) => {
  console.log( siteDetails.context.pageContext);
}