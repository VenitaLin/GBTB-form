import * as React from "react";
import * as App from "./GbtbFormApp";
import { Bookings } from "./GbtbBookings";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp";
import { orderBy, cloneDeep } from "lodash";

export const HomePage = (props) => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [isDisabledNewBookBtn, setIsDisabledNewBookBtn] = useState(false);
  const [activeBookingDate, setActiveBookingDate] = useState(null);
  const [currColumn, setCurrColumn] = useState("status");
  const fetchData = async () => {
    try {
      setStatus("loading");
      await App.getBookings(props.GbtbListName).then((bookingsList) => {
        setBookings(orderBy(bookingsList, "status", "asc"));
        setIsDisabledNewBookBtn(App.isDisabledNewBookingBtn(bookingsList));
        setActiveBookingDate(App.getLatestActiveIDOV(bookingsList));
        setStatus("ready");
      });
    } catch (e) {
      setStatus("error");
    }
  };
  const updateCancelBooking = () => {
    fetchData();
  };
  const updateNewBooking = () => {
    fetchData();
  };
  const sortBookings = (currColumn) => {
    const sortedBookings = orderBy(
      bookings,
      currColumn.fieldName,
      currColumn.isSortedDescending ? "desc" : "asc"
    );
    return sortedBookings;
  };
  const updateColumn = (newCol) => {
    setCurrColumn(newCol);
  };
  useEffect(() => {
    sp.setup({
      spfxContext: props.context,
    });
    fetchData();
    const sortedBookings = sortBookings(currColumn);
    setBookings(sortedBookings);
  }, [currColumn]);
  return (
    <div>
      <Bookings
        updateCancelBooking={updateCancelBooking}
        updateNewBooking={updateNewBooking}
        bookings={bookings}
        status={status}
        siteDetails={props}
        isDisabledNewBookBtn={isDisabledNewBookBtn}
        isFormAvailable={!isDisabledNewBookBtn}
        activeBookingDate={activeBookingDate}
        sortBookings={sortBookings}
        updateColumn={updateColumn}
      />
    </div>
  );
};
