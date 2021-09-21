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
  CommandBar,
  ICommandBarStyles,
  IconButton,
  IIconProps,
  CommandBarButton,
  TooltipHost,
  ITooltipHostStyles,
  Stack,
  IStackStyles,
} from "office-ui-fabric-react/lib/";
import { GbtbForm } from "./GbtbForm";
import * as App from "./GbtbFormApp";

export const Bookings = ({
  updateCancelBooking,
  updateNewBooking,
  ...props
}) => {
  const commandBarStyles: Partial<ICommandBarStyles> = {
    root: { marginBottom: "0px" },
  };
  const [msg, setMsg] = useState("");
  const [cancelBookStatus, setCacelbookingStatus] = useState(true);
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const [selectedItem, setSelectedItem] = useState<Object | undefined>(
    undefined
  );
  const cancelBooking = async () => {
    await App.cancelBooking(
      selectedItem[0].key,
      props.siteDetails.GbtbListName
    );
    await updateCancelBooking();
    alert("Booking has been cancelled.");
    hideModal();
  };
  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedItem(selection.getSelection());
    },
  });

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
  const columns = [
    {
      key: "column2",
      name: "Intended Date of Visit",
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
  const stackStyles: Partial<IStackStyles> = { root: { height: 44 } };
  useEffect(() => {
    if (props.status == "loading") {
      setMsg("Loading...");
    } else if (props.bookings.length == 0) {
      setMsg("No Existing Bookings.");
    }
    if (
      selectedItem &&
      selectedItem[0] &&
      !App.isWithin2W(selectedItem[0].IDOVdate)
    ) {
      setCacelbookingStatus(false);
    } else if (
      selectedItem &&
      selectedItem[0] &&
      App.isWithin2W(selectedItem[0].IDOVdate)
    ) {
      setCacelbookingStatus(true);
    } else {
      setCacelbookingStatus(true);
    }
  }, [selectedItem]);
  const commandItems = [
    {
      key: "addBooking",
      text: "New Booking",
      iconProps: { iconName: "Add" },
      onClick: showModal,
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
  const addIcon: IIconProps = { iconName: "Add" };
  const cancelBookingIcon: IIconProps = { iconName: "Delete" };
  const cancelIcon: IIconProps = { iconName: "Cancel" };
  const calloutProps = { gapSpace: 0 };
  const hostStyles: Partial<ITooltipHostStyles> = {
    root: { display: "inline-block" },
  };

  if (props.bookings.length != 0) {
    return (
      <div>
        {/* <CommandBar styles={commandBarStyles} items={commandItems} /> */}
        <Stack horizontal styles={stackStyles}>
          <TooltipHost
            content="This is the tooltip content"
            calloutProps={calloutProps}
            styles={hostStyles}
          >
            <CommandBarButton
              iconProps={addIcon}
              text="New Booking"
              disabled={props.isDisabledNewBookBtn}
              onClick={showModal}
            />
          </TooltipHost>
          <TooltipHost
            content="This is the tooltip content"
            calloutProps={calloutProps}
            styles={hostStyles}
          >
            <CommandBarButton
              iconProps={cancelIcon}
              text="Cancel Booking"
              disabled={cancelBookStatus}
              onClick={cancelBooking}
            />
          </TooltipHost>
        </Stack>
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
        {props.isFormAvailable && (
          <Modal isOpen={isModalOpen} onDismiss={hideModal} isBlocking={false}>
            <IconButton
              styles={iconButtonStyles}
              iconProps={cancelBookingIcon}
              ariaLabel="Close popup modal"
              onClick={hideModal}
            />
            <GbtbForm
              siteDetails={props.siteDetails}
              updateNewBooking={updateNewBooking}
              activeBookingDate={props.activeBookingDate}
              hideModal={hideModal}
            />
          </Modal>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {/* <CommandBar styles={commandBarStyles} items={commandItems} /> */}
        <Stack horizontal styles={stackStyles}>
          <TooltipHost
            content="Maximun 2 active bookings for each person."
            calloutProps={calloutProps}
            styles={hostStyles}
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
            content="Cancel booking is not available if intended date of visit is within 14 days."
            calloutProps={calloutProps}
            styles={hostStyles}
          >
            <CommandBarButton
              styles={stackStyles}
              iconProps={cancelBookingIcon}
              text="Cancel Booking"
              disabled={cancelBookStatus}
              onClick={cancelBooking}
            />
          </TooltipHost>
        </Stack>

        <div
          style={{ textAlign: "center", color: "#C2C9D6", fontSize: "x-large" }}
        >
          {msg}
          {props.isFormAvailable && (
            <Modal
              isOpen={isModalOpen}
              onDismiss={hideModal}
              isBlocking={false}
            >
              <IconButton
                styles={iconButtonStyles}
                iconProps={cancelIcon}
                ariaLabel="Close popup modal"
                onClick={hideModal}
              />
              <GbtbForm
                siteDetails={props.siteDetails}
                updateNewBooking={updateNewBooking}
                activeBookingDate={props.activeBookingDate}
                hideModal={hideModal}
              />
            </Modal>
          )}
        </div>
      </div>
    );
  }
};
