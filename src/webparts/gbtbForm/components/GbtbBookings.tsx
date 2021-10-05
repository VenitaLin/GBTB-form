import * as React from "react";
import { useState, useEffect } from "react";
import { useBoolean } from "@uifabric/react-hooks";
import {
  getTheme,
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  Modal,
  IconButton,
  IIconProps,
  CommandBarButton,
  TooltipHost,
  ITooltipHostStyles,
  Stack,
  IStackStyles,
  IColumn,
} from "office-ui-fabric-react/lib/";
import { GbtbForm } from "./GbtbForm";
import * as App from "./GbtbApp";
export const Bookings = ({
  updateCancelBooking,
  updateNewBooking,
  sortBookings,
  ...props
}) => {
  const [msg, setMsg] = useState("");
  const [isCancelBtnDisabled, setIsCancelBtnDisabled] = useState(true);
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const [selectedItem, setSelectedItem] = useState<Object | undefined>(
    undefined
  );
  const addIcon: IIconProps = { iconName: "Add" };
  const cancelBookingIcon: IIconProps = { iconName: "Delete" };
  const cancelIcon: IIconProps = { iconName: "Cancel" };
  const calloutProps = { gapSpace: 0 };
  const hostStyles: Partial<ITooltipHostStyles> = {
    root: { display: "inline-block" },
  };
  const cancelBooking = async () => {
    await App.cancelBooking(
      selectedItem[0].key,
      props.siteDetails.GbtbListName
    );
    await updateCancelBooking();
    alert("Booking has been cancelled.");
  };
  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedItem(selection.getSelection());
    },
  });
  const stackStyles: Partial<IStackStyles> = { root: { height: 44 } };
  const theme = getTheme();
  const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: "auto",
      marginTop: "4px",
      marginRight: "2px",
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };
  const _onColumnClick = (
    ev: React.MouseEvent<HTMLElement>,
    column: IColumn
  ) => {
    const newColumns = columns.slice();
    const currColumn: IColumn = newColumns.filter(
      (currCol) => column.key === currCol.key
    )[0];

    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    sortBookings(column);
    setColumns(newColumns);
  };
  const initialColumns = [
    {
      key: "column1",
      name: "Full Name",
      fieldName: "fullName",
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
    },
    {
      key: "column2",
      name: "Intended Date of Visit",
      fieldName: "IDOV",
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
      onColumnClick: _onColumnClick,
    },
    {
      key: "column3",
      name: "Status",
      fieldName: "status",
      minWidth: 100,
      maxWidth: 200,
      isResizable: false,
      isSorted: false,
      isSortedDescending: false,
      onColumnClick: _onColumnClick,
    },
  ];
  const [columns, setColumns] = useState(initialColumns);

  useEffect(() => {
    if (props.status == "loading") {
      setMsg("Loading...");
    }
    if (props.bookings.length < 1) {
      setMsg("No Existing Bookings.");
    }
    if (
      selectedItem &&
      selectedItem[0] &&
      selectedItem[0].status == "Cancelled"
    ) {
      setIsCancelBtnDisabled(true);
    } else if (
      selectedItem &&
      selectedItem[0] &&
      !App.isWithin2W(selectedItem[0].IDOVdate)
    ) {
      setIsCancelBtnDisabled(false);
    } else {
      setIsCancelBtnDisabled(true);
    }
  }, [props, selectedItem]);

  return (
    <div>
      <Stack horizontal styles={stackStyles}>
        <TooltipHost
          content="Maximum 2 active bookings for each staff."
          calloutProps={calloutProps}
          styles={hostStyles}
          hidden={!props.isDisabledNewBookBtn}
        >
          <CommandBarButton
            iconProps={addIcon}
            styles={stackStyles}
            text="New Booking"
            disabled={props.isDisabledNewBookBtn}
            onClick={showModal}
          />
        </TooltipHost>
        <TooltipHost
          content="Cancel booking is not available if intended date of visit is within 14 days from current date."
          calloutProps={calloutProps}
          styles={hostStyles}
          hidden={!isCancelBtnDisabled}
        >
          <CommandBarButton
            styles={stackStyles}
            iconProps={cancelBookingIcon}
            text="Cancel Booking"
            disabled={isCancelBtnDisabled}
            onClick={cancelBooking}
          />
        </TooltipHost>
      </Stack>
      {props.bookings.length < 1 && (
        <div
          style={{
            textAlign: "center",
            color: "#C2C9D6",
            fontSize: "x-large",
          }}
        >
          {msg}
        </div>
      )}
      {props.bookings.length > 0 && (
        <DetailsList
          items={props.bookings}
          compact={false}
          columns={columns}
          selectionMode={SelectionMode.single}
          setKey="single"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          selection={selection}
          selectionPreservedOnEmptyClick={true}
          enterModalSelectionOnTouch={true}
        />
      )}
      {props.isFormAvailable && (
        <Modal isOpen={isModalOpen} onDismiss={hideModal} isBlocking={false}>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
          <GbtbForm
            siteDetails={props.siteDetails}
            updateNewBooking={updateNewBooking}
            hideModal={hideModal}
            activeBookingDate={props.activeBookingDate}
          />
        </Modal>
      )}
    </div>
  );
};
