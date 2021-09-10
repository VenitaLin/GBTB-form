import * as React from "react";
import { useState } from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
} from "office-ui-fabric-react/lib/DetailsList";
import { CommandBar, ICommandBarStyles } from 'office-ui-fabric-react/lib/CommandBar';

export const Bookings = (props) => {
  const commandBarStyles: Partial<ICommandBarStyles> = { root: { marginBottom: '0px' } };
  const commandItems = [
    {
      key: "addBooking",
      text: "New Booking",
      iconProps: { iconName: "Add" },
      // onClick: this._onAddRow,
    },
    {
      key: "cancelBooking",
      text: "Cancel Booking",
      iconProps: { iconName: "Delete" },
      // onClick: this._onDeleteRow,
    },
  ];
  const [selectedItem, setSelectedItem] = useState(null);
  const columns = [
    {
      key: "column1",
      name: "Booking Name",
      fieldName: "name",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "column2",
      name: "Itended Date of Visit",
      fieldName: "IDOV",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "column3",
      name: "Status",
      fieldName: "status",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
  ];

  // const getKey = (item: any, index?: number) => {
  //   console.log(item);
  //   return item.key;
  // };
  if (props.bookings.length != 0){
    console.log(props.bookings);
    return (
      <div>
      <CommandBar
        styles={commandBarStyles}
        items={commandItems}
      />
      <DetailsList
        items={props.bookings}
        compact={false}
        columns={columns}
        selectionMode={SelectionMode.multiple}
        // getKey={getKey}
        setKey="multiple"
        layoutMode={DetailsListLayoutMode.justified}
        isHeaderVisible={true}
        selection={selectedItem}
        selectionPreservedOnEmptyClick={true}
        // onItemInvoked={this._onItemInvoked}
        enterModalSelectionOnTouch={true}
        ariaLabelForSelectionColumn="Toggle selection"
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
        checkButtonAriaLabel="Row checkbox"
      />
    </div>
    )
  }else {
    return (
      <div>
        <CommandBar
          styles={commandBarStyles}
          items={commandItems}
        />
        <div style={{ textAlign: "center", color: '#C2C9D6', fontSize: 'x-large',}}>No Existing Booking.</div>
      </div>
    );
  }
};
