import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/site-users/web";

export const validateForm = (props) => {
  if (!props.fullName || !props.division || !props.department) {
    return false;
  } else {
    return true;
  }
};

const setGbtbFormProps = (props) => {
  let _spForm = {
    Title: "Gardens by The Bay Booking",
    fullName: props.fullName,
    division: props.division,
    department: props.department,
    IDOV: props.IDOV,
    status: props.status,
  };
  return _spForm;
};

export const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addItem = async (listName, data) => {
  let _gbtbFormProps = setGbtbFormProps(data);
  const iar: IItemAddResult = await sp.web.lists
    .getByTitle(listName)
    .items.add(_gbtbFormProps);
  return iar;
};

export const getList = async (listName) => {
  let allItems: any[] = await sp.web.lists.getByTitle(listName).items.get();
  return allItems;
};

export const getBookings = async (listName) => {
  let user = await sp.web.currentUser();
  const allItems: any[] = await sp.web.lists
    .getByTitle(listName)
    .items.select("Title", "Id", "IDOV", "status")
    .filter("AuthorId eq '" + user.Id + "'")
    .getAll();
  return formatBooking(allItems);
};

export const formatDropList = (data) => {
  var listItems = [];
  for (var k in data) {
    listItems.push({ key: k, text: data[k].Title });
  }
  return listItems;
};

const formatBooking = (bookings) => {
  var result = [];
  for (let i = 0; i < 200; i++) {
    if (bookings[i]) {
      result.push({
        key: bookings[i].ID,
        name: bookings[i].Title,
        value: bookings[i].ID,
        status: bookings[i].status,
        IDOV: bookings[i].IDOV,
      });
    }
  }
  return result;
};
