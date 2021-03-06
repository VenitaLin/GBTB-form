import * as React from "react";
import styles from "./GbtbForm.module.scss";
import * as App from "./GbtbApp";
import { useState, useEffect } from "react";
import {
  Dropdown,
  TextField,
  PrimaryButton,
  Calendar,
  Label,
  IDropdown,
} from "office-ui-fabric-react/lib";
import { sp } from "@pnp/sp";
import { addDays } from "date-fns";

const DayPickerStrings = {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],

  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],

  shortDays: ["S", "M", "T", "W", "T", "F", "S"],

  goToToday: "Go to today",
  weekNumberFormatString: "Week number {0}",
};

export const GbtbForm = ({ updateNewBooking, hideModal, ...props }) => {
  let myFormRef;
  const earliestDate = addDays(new Date(), 3);
  const [status, setStatus] = useState("ready");
  const [fullName, setFullName] = useState("");
  const [division, setDivision] = useState(null);
  const [department, setDepartment] = useState(null);
  const [IDOV, setIDOV] = useState(null);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [fullyBookedDate, setFullyBookedDate] = useState([]);
  const [daysFromActiveBookings, setDaysFromActiveBookings] = useState([]);
  const [disableDate, setDisableDate] = useState([]);
  const dropdownRef = React.createRef<IDropdown>();
  const [errMsg, setErrMsg] = useState("");
  const _setIDOV = async (selectedDate) => {
    const isDateAvailable = await App.isDateAvailable(
      selectedDate,
      props.siteDetails.GbtbListName
    );
    if (isDateAvailable) {
      setErrMsg("");
      setIDOV(selectedDate);
    } else {
      setErrMsg(
        "Selected date has been fully booked. Please select another date."
      );
    }
  };
  const fetchDropdownData = async () => {
    try {
      setStatus("loading");
      const divResult = await App.getList(props.siteDetails.divisionListName);
      setDivisionList(App.formatDivList(divResult));
      const depResult = await App.getList(props.siteDetails.departmentListName);
      setDepartmentList(App.formatDivList(depResult));
      await App.getFullyBookedDates(props.siteDetails.GbtbListName).then(
        (dateList) => {
          setFullyBookedDate(dateList);
          const dBFAB = App.datesBlockFromActiveBooking(
            props.activeBookingDate
          );
          setDaysFromActiveBookings(dBFAB);
          const disDate = [...dateList, ...dBFAB];
          setDisableDate(disDate);
        }
      );
      setStatus("ready");
    } catch (e) {
      setStatus("error");
    }
  };
  useEffect(() => {
    sp.setup({
      spfxContext: props.siteDetails.context,
    });
    fetchDropdownData();
  }, []);

  const resetForm = () => {
    updateNewBooking();
    setFullName("");
    setDivision(null);
    setDepartment(null);
    setIDOV(earliestDate);
  };

  const submitForm = async () => {
    const cardNum = await App.getCardNumFromDate(
      props.siteDetails.GbtbListName,
      IDOV
    );
    var data = {
      fullName: fullName,
      division: divisionList[division].text,
      department: departmentList[department].text,
      IDOV: IDOV,
      status: "Active",
      isMailSent: "False",
      cardNum: cardNum,
    };
    App.addItem(props.siteDetails.GbtbListName, data).then(
      (value) => {
        if (value) {
          alert("Form submitted successfully!");
          hideModal();
          resetForm();
        } else {
          alert("Form submitted failed. Please try again.");
          hideModal();
          resetForm();
        }
      },
      (reason) => {
        console.log(reason);
        alert("Form submitted failed. Please try again.");
        hideModal();
        resetForm();
      }
    );
  };

  return (
    <div className={styles.gbtbForm}>
      <div className={styles.container}>
        <div className={styles.title}>
          <h2>Gardens By The Bay Booking Form</h2>
        </div>
        <form id="GbtbForm" ref={(el) => (myFormRef = el)}>
          <div className={styles.item}>
            <TextField
              label="Full name (as per NRIC)"
              value={fullName}
              required
              placeholder="Full Name (as per NRIC)"
              onChange={(e, newValue) => {
                setFullName(newValue);
              }}
            />
          </div>
          <div className={styles.item}>
            <Dropdown
              componentRef={dropdownRef}
              label="Division"
              options={divisionList}
              selectedKey={division}
              placeholder="Select your division"
              onChange={(e, selectedOption) => {
                setDivision(selectedOption.key);
              }}
              calloutProps={{ calloutMaxHeight: 300 }}
              required
            ></Dropdown>
          </div>
          <div className={styles.item}>
            <label>
              <Dropdown
                label="Department"
                options={departmentList}
                selectedKey={department}
                placeholder="Select your department"
                onChange={(e, selectedOption) => {
                  setDepartment(selectedOption.key);
                }}
                calloutProps={{ calloutMaxHeight: 300 }}
                required
              ></Dropdown>
            </label>
          </div>
          <div className={styles.item}>
            <label>
              <Label required>Intended Date of Visit</Label>
              <div className={styles.errMsg}>{errMsg}</div>
              <Calendar
                onSelectDate={(selectedDate) => _setIDOV(selectedDate)}
                isMonthPickerVisible={true}
                showGoToToday={false}
                value={IDOV}
                strings={DayPickerStrings}
                highlightSelectedMonth={true}
                minDate={earliestDate}
                maxDate={addDays(new Date(), 91)}
                restrictedDates={disableDate}
              />
            </label>
          </div>
          <div className={styles.item}>
            <p>
              <div className={styles.buttonItem}>
                <PrimaryButton
                  text="Submit"
                  type="button"
                  onClick={submitForm}
                  disabled={
                    !App.validateForm(fullName, division, department, IDOV)
                  }
                />
                <PrimaryButton text="Reset" type="reset" onClick={resetForm} />
              </div>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
