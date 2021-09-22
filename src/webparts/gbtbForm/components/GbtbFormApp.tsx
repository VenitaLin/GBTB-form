import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { differenceInDays, parseISO, addDays, subDays } from "date-fns";

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
  };
  return _spForm;
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

const formatBooking = (bookings) => {
  var result = [];
  for (let i = 0; i < bookings.length; i++) {
    if (bookings[i]) {
      const date = parseISO(bookings[i].IDOV).toLocaleDateString();
      result.push({
        key: bookings[i].ID,
        name: bookings[i].Title,
        value: bookings[i].ID,
        status: bookings[i].status,
        IDOV: date,
        IDOVdate: bookings[i].IDOV,
      });
    }
  }
  return result;
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

export const formatDropList = (data) => {
  var listItems = [];
  for (var k in data) {
    listItems.push({ key: k, text: data[k].Title });
  }
  return listItems;
};

export const isWithin2W = (IDOV) => {
  var today = new Date();
  let countDays = differenceInDays(parseISO(IDOV), today);
  if (countDays <= 14) {
    return true;
  } else {
    return false;
  }
};

export const cancelBooking = async (id, ListName) => {
  const updatedItem = await sp.web.lists
    .getByTitle(ListName)
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

export const checkDateAvailable = async (selectedDate, listName) => {
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
