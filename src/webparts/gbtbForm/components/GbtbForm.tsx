import * as React from "react";
import styles from "./GbtbForm.module.scss";
import * as App from "./GbtbFormApp";
import { useState, useEffect } from "react";
import {
  Dropdown,
  IDropdownStyles,
  TextField,
  PrimaryButton,
  Label,
} from "office-ui-fabric-react/lib";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { sp } from "@pnp/sp";
import { addDays } from "date-fns";
import { debounce } from "@microsoft/sp-lodash-subset";

export const GbtbForm = ({ updateNewBooking, hideModal, ...props }) => {
  let myFormRef;
  const defaultDisableDates = {
    after: addDays(new Date(), 91),
    before: addDays(new Date(), 14),
  };
  const [status, setStatus] = useState("ready");
  const [fullName, setFullName] = useState("");
  const [division, setDivision] = useState(null);
  const [department, setDepartment] = useState(null);
  const [IDOV, setIDOV] = useState(addDays(new Date(), 13));
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [disableDate, setDisableDate] = useState([defaultDisableDates]);
  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdownItemsWrapper: { maxHeight: "300px" },
  };
  const [errMsg, setErrMsg] = useState("");
  const _setIDOV = async (selectedDate) => {
    const isDateAvailable = await App.checkDateAvailable(
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
  useEffect(() => {
    sp.setup({
      spfxContext: props.siteDetails.context,
    });

    const fetchData = async () => {
      try {
        setStatus("loading");
        const divResult = await App.getList(props.siteDetails.divisionListName);
        setDivisionList(App.formatDropList(divResult));
        const depResult = await App.getList(
          props.siteDetails.departmentListName
        );
        setDepartmentList(App.formatDropList(depResult));
        await App.getFullyBookedDates(props.siteDetails.GbtbListName).then(
          (dateList) => {
            const dBFAB = App.datesBlockFromActiveBooking(
              props.activeBookingDate
            );
            const disDate = [...dateList, ...dBFAB];
            const newDisDate = [...disDate, defaultDisableDates];
            setDisableDate(newDisDate);
          }
        );
        setStatus("ready");
      } catch (e) {
        setStatus("error");
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    updateNewBooking();
    setFullName("");
    setDivision(null);
    setDepartment(null);
    setIDOV(addDays(new Date(), 13));
  };

  const submitForm = () => {
    var data = {
      fullName: fullName,
      division: divisionList[division].text,
      department: departmentList[department].text,
      IDOV: IDOV,
      status: "Active",
    };
    App.addItem(props.siteDetails.GbtbListName, data).then(
      (value) => {
        alert("Form submitted successfully!");
        hideModal();
        resetForm();
      },
      (reason) => {
        alert("Form submitted failed.");
      }
    );
  };
  const [bookedDetails, setBookedDetails] = React.useState("");
  const showWhomBook = async (date) => {
    const nameList = await App.getWhomBookedFromDate(
      props.siteDetails.GbtbListName,
      date
    );
    if (nameList.length == 1){
      setBookedDetails(nameList[0] + " has booked this date.");
    } else if (nameList.length == 2){
      setBookedDetails(nameList[0] + " and "+ nameList[1] + " have booked this date.");
    }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const debouncedHandleMouseEnter = debounce((date) => {
    setIsHovered(true);
    showWhomBook(date);
  }, 1200);

  const handlOnMouseLeave = () => {
    setIsHovered(false);
    setBookedDetails("");
    debouncedHandleMouseEnter.cancel();
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
            <label>
              <Dropdown
                label="Division"
                options={divisionList}
                selectedKey={division}
                placeholder="Select your division"
                onChange={(e, selectedOption) => {
                  setDivision(selectedOption.key);
                }}
                styles={dropdownStyles}
                required
              ></Dropdown>
            </label>
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
                styles={dropdownStyles}
                required
              ></Dropdown>
            </label>
          </div>
          <div className={styles.item}>
            <label>
              <Label required>Intended Date of Visit</Label>
              <div className={styles.errMsg}>{errMsg}</div>
              <div>{isHovered && bookedDetails}</div>
              <DayPicker
                selectedDays={IDOV}
                onDayClick={(selectedDate) => _setIDOV(selectedDate)}
                disabledDays={disableDate}
                onDayMouseEnter={(date) => debouncedHandleMouseEnter(date)}
                onDayMouseLeave={handlOnMouseLeave}
                numberOfMonths={2}
                pagedNavigation
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
