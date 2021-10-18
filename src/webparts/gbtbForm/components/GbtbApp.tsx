import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { parseISO, addDays, subDays, formatISO } from "date-fns";

export const validateForm = (fullName, division, department, IDOV) => {
  if (!fullName || !division || !department || !IDOV) {
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
    isMailSent: props.isMailSent,
    CardNumber: props.cardNum,
  };
  return _spForm;
};

export const isDateAvailable = async (selectedDate, listName) => {
  const dateList: any[] = await sp.web.lists
    .getByTitle(listName)
    .items.select("IDOV")
    .filter(
      "IDOV eq '" + selectedDate.toISOString() + "' and status eq 'Active'"
    )
    .getAll();
  if (dateList.length >= 2) {
    return false;
  } else {
    return true;
  }
};

export const addItem = async (listName, data) => {
  let iar;
  if (isDateAvailable(listName, data.IDOV)){
    const _gbtbFormProps = setGbtbFormProps(data);
    iar = await sp.web.lists
      .getByTitle(listName)
      .items.add(_gbtbFormProps);
  }
  return iar;
};

export const getList = async (listName) => {
  let allItems: any[] = await sp.web.lists.getByTitle(listName).items.get();
  return allItems;
};

const formatBooking = (bookings) => {
  var result = [];
  for (let i = 0; i < bookings.length; i++) {
    if (bookings[i]) {
      const date = parseISO(bookings[i].IDOV).toLocaleDateString();
      result.push({
        key: bookings[i].ID,
        fullName: bookings[i].fullName,
        value: bookings[i].ID,
        status: bookings[i].status,
        IDOV: date,
        IDOVdate: bookings[i].IDOV,
        isMailSent: bookings[i].isMailSent == "True" ? true : false,
      });
    }
  }
  return result;
};

export const getBookings = async (listName) => {
  let user = await sp.web.currentUser();
  const allItems: any[] = await sp.web.lists
    .getByTitle(listName)
    .items.select("fullName", "Id", "IDOV", "status", "isMailSent")
    .filter("AuthorId eq '" + user.Id + "'")
    .getAll();
  return formatBooking(allItems);
};

export const isDisabledNewBookingBtn = (bookingList) => {
  let count = 0;
  for (let i = 0; i < bookingList.length; i++) {
    if (bookingList[i].status == "Active") {
      count += 1;
      if (count >= 2) {
        return true;
      }
    }
  }
  return false;
};

export const formatDivList = (data) => {
  var listItems = [];
  for (var k in data) {
    listItems.push({ key: k, text: data[k].Title });
  }
  return listItems;
};

export const formatDepList = (data, div) => {
  var listItems = [];
  for (var k in data) {
    if (data[k].Division == div) {
      listItems.push({ key: k, text: data[k].Title });
    }
  }
  return listItems;
};

export const cancelBooking = async (id, listName) => {
  const updatedItem = await sp.web.lists
    .getByTitle(listName)
    .items.getById(id)
    .update({
      status: "Cancelled",
    });
  return updatedItem;
};

export const getFullyBookedDates = async (listName) => {
  const dateList: any[] = await sp.web.lists
    .getByTitle(listName)
    .items.select("IDOV")
    .filter("status eq 'Active'")
    .getAll();
  let dic = {};
  let resultDates = [];
  for (let i = 0; i < dateList.length; i++) {
    if (dateList[i].IDOV in dic) {
      dic[dateList[i].IDOV] += 1;
    } else {
      dic[dateList[i].IDOV] = 1;
    }
  }
  Object.keys(dic).map((k) => {
    if (dic[k] >= 2) {
      resultDates.push(parseISO(k));
    }
  });
  return resultDates;
};

export const datesBlockFromActiveBooking = (date) => {
  let dateList = [];
  for (let i = 1; i < 31; i++) {
    dateList.push(addDays(parseISO(date), i));
  }
  for (let i = 1; i < 31; i++) {
    dateList.push(subDays(parseISO(date), i));
  }
  dateList.push(parseISO(date));
  return dateList;
};

export const getLatestActiveIDOV = (bookings) => {
  let countActive = 0;
  let date = null;
  for (let i = 0; i < bookings.length; i++) {
    if (bookings[i].status == "Active") {
      countActive += 1;
      date = bookings[i].IDOVdate;
    }
  }
  if (countActive == 1) {
    return date;
  }
};

export const getCardNumFromDate = async (listName, date) => {
  const allItems: any[] = await sp.web.lists
    .getByTitle(listName)
    .items.select("Id", "CardNumber")
    .filter(
      "IDOV eq '" +
        formatISO(date, { representation: "date" }) +
        "' and status eq 'Active'"
    )
    .getAll();
  let count = "One";
  if (allItems.length == 0) {
    return count;
  } else if (allItems[0].CardNumber == "One") {
    count = "Two";
  }
  return count;
};
