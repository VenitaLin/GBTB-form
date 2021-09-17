import * as React from "react";
import { useState, useEffect } from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from "office-ui-fabric-react/lib/DetailsList";
import {
  CommandBar,
  ICommandBarStyles,
} from "office-ui-fabric-react/lib/CommandBar";
import { GbtbForm } from "./GbtbForm";
import * as App from "./GbtbFormApp";

export const Bookings = (props) => {
  const commandBarStyles: Partial<ICommandBarStyles> = {
    root: { marginBottom: "0px" },
  };
  const [msg, setMsg] = useState("");
  const [newBookStatus, setNewBookStatus] = useState(false);
  const [cancelBookStatus, setCacelbookingStatus] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const addBooking = () => {
    setShowForm(!showForm);
  };
  const cancelBooking = () => {
    console.log(selection);
  };
  const [selectedItem, setSelectedItem] = useState<Object | undefined>(
    undefined
  );
  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedItem(selection.getSelection());
    },
  });

  const commandItems = [
    {
      key: "addBooking",
      text: "New Booking",
      iconProps: { iconName: "Add" },
      onClick: addBooking,
      disabled: props.isDisabledNewBookBtn,
    },
    {
      key: "cancelBooking",
      text: "Cancel Booking",
      iconProps: { iconName: "Delete" },
      onClick: cancelBooking,
      disabled: cancelBookStatus,
    },
  ];
  const columns = [
    {
      key: "column1",
      name: "Booking Name",
      fieldName: "name",
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
    },
    {
      key: "column2",
      name: "Itended Date of Visit",
      fieldName: "IDOV",
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
    },
    {
      key: "column3",
      name: "Status",
      fieldName: "status",
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
    },
  ];

  useEffect(() => {
    if (props.status == "loading") {
      setMsg("Loading...");
    } else if (props.bookings.length == 0) {
      setMsg("No Existing Booking.");
    }
    if (selectedItem && selectedItem[0] && !App.isWithin2W(selectedItem[0].IDOV)){
      setCacelbookingStatus(false)
    }
  }, [selectedItem]);

  if (props.bookings.length != 0) {
    return (
      <div>
        <CommandBar styles={commandBarStyles} items={commandItems} />
        <DetailsList
          items={props.bookings}
          compact={false}
          columns={columns}
          selectionMode={SelectionMode.single}
          // getKey={getKey}
          setKey="single"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          selection={selection}
          selectionPreservedOnEmptyClick={true}
          // onItemInvoked={this._onItemInvoked}
          enterModalSelectionOnTouch={true}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="Row checkbox"
        />
        {showForm && <GbtbForm siteDetails={props.siteDetails} />}
      </div>
    );
  } else {
    return (
      <div>
        <CommandBar styles={commandBarStyles} items={commandItems} />
        <div
          style={{ textAlign: "center", color: "#C2C9D6", fontSize: "x-large" }}
        >
          {msg}
          {showForm && <GbtbForm siteDetails={props.siteDetails} />}
        </div>
      </div>
    );
  }
};
