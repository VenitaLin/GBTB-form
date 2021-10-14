import * as React from "react";
import * as App from "./GbtbApp";
import { Bookings } from "./GbtbBookings";
import { useState, useEffect } from "react";
import { sp } from "@pnp/sp";
import { orderBy } from "lodash";
export const HomePage = (props) => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [isDisabledNewBookBtn, setIsDisabledNewBookBtn] = useState(false);
  const [activeBookingDate, setActiveBookingDate] = useState(null);
  const [currColumn, setCurrColumn] = useState([
    {
      key: "column2",
      name: "Intended Date of Visit",
      fieldName: "IDOV",
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
      isSorted: true,
      isSortedDescending: true,
    },
  ]);
  const fetchData = async () => {
    try {
      setStatus("loading");
      await App.getBookings(props.GbtbListName).then((bookingsList) => {
        setBookings(bookings);
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
  const onColumnClick = (newCol) => {
    setCurrColumn(newCol);
  };
  const sortBookings = (oriBookings, column) => {
    const sortedBookings = orderBy(
      oriBookings,
      column.fieldName,
      column.isSortedDescending ? "desc" : "asc"
    );
    return sortedBookings;
  };
  useEffect(() => {
    sp.setup({
      spfxContext: props.context,
    });
    fetchData();
  }, [bookings]);
  return (
    <div>
      <Bookings
        updateCancelBooking={updateCancelBooking}
        updateNewBooking={updateNewBooking}
        bookings={sortBookings(bookings, currColumn)}
        status={status}
        siteDetails={props}
        isDisabledNewBookBtn={isDisabledNewBookBtn}
        isFormAvailable={!isDisabledNewBookBtn}
        activeBookingDate={activeBookingDate}
        sortBookings={onColumnClick}
      />
    </div>
  );
};
