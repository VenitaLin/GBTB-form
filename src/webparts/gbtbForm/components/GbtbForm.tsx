import * as React from "react";
import styles from "./GbtbForm.module.scss";
import * as App from "./GbtbFormApp";
import {
  DateTimePicker,
  DateConvention,
} from "@pnp/spfx-controls-react/lib/DateTimePicker";
import { useState } from "react";
import {
  Dropdown,
  IDropdownStyles,
  TextField,
} from "office-ui-fabric-react/lib";

export const GbtbForm = (props) => {
  let myFormRef;
  const [status, setStatus] = useState("ready");
  const [fullName, setFullName] = useState("");
  const [division, setDivision] = useState(null);
  const [department, setDepartment] = useState(null);
  const [IDOV, setIDOV] = useState(App.addDays(new Date(), 13));
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdownItemsWrapper: { maxHeight: "300px" },
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus("loading");
        const divResult = await App.getList(props.siteDetails, props.siteDetails.divisionListName);
        setDivisionList(App.formatDropList(divResult));
        const depResult = await App.getList(props.siteDetails, props.siteDetails.departmentListName);
        setDepartmentList(App.formatDropList(depResult));
        setStatus("ready");
      } catch (e) {
        console.log(e);
        setStatus("error");
      }
    };
    fetchData();
    App.getUser(props.siteDetails);
  }, []);

  const resetForm = (e) => {
    setFullName("");
    setDivision(null);
    setDepartment(null);
    setIDOV(App.addDays(new Date(), 13));
  };

  const submitForm = () => {
    const data = {
      fullName: fullName,
      division: divisionList[division].text,
      department: departmentList[department].text,
      IDOV: IDOV,
    };
    App.createForm(props.siteDetails, data).then(value => {
      alert("Form submitted successfully!");
      resetForm;
    }, reason => {
      console.log(reason);
      alert("Form submitted failed.");
    });
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
              <p>Division</p>
              <Dropdown
                options={divisionList}
                selectedKey={division}
                placeholder="Select your division"
                onChange={(e, selectedOption) => {
                  setDivision(selectedOption.key);
                }}
                styles={dropdownStyles}
              ></Dropdown>
            </label>
          </div>
          <div className={styles.item}>
            <label>
              <p>Department</p>
              <Dropdown
                options={departmentList}
                selectedKey={department}
                placeholder="Select your department"
                onChange={(e, selectedOption) => {
                  setDepartment(selectedOption.key);
                }}
                styles={dropdownStyles}
              ></Dropdown>
            </label>
          </div>
          <div className={styles.item}>
            <label>
              <p>Intended Date of Visit</p>
              <DateTimePicker
                dateConvention={DateConvention.Date}
                formatDate={(date: Date) => date.toLocaleDateString()}
                showLabels={false}
                value={IDOV}
                placeholder="Please select a date"
                onChange={(date) => setIDOV(date)}
                minDate={App.addDays(new Date(), 13)}
                maxDate={App.addDays(new Date(), 90)}
              />
            </label>
          </div>
          <div className={styles.item}>
            <p>
              <div className={styles.buttonItem}>
                <button
                  type="button"
                  className={styles.button}
                  onClick={submitForm}
                >
                  Submit
                </button>
                <button
                  type="reset"
                  className={styles.button}
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
