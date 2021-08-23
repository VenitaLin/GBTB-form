import * as React from "react";
import styles from "./GbtbForm.module.scss";
import { IGbtbFormProps } from "./IGbtbFormProps";
import { IGbtbFormState, initialSate } from "./IGbtbFormState";
import * as formData from "./GbtbFormData";
import * as Utils from "../utils";
import * as App from "./GbtbFormApp";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { addDays } from "date-fns";

export default class GbtbForm extends React.Component<
  IGbtbFormProps,
  IGbtbFormState
> {
  constructor(props: IGbtbFormProps, state: IGbtbFormState) {
    super(props);
    this.state = {
      ...initialSate,
    };
  }
  protected myFormRef;
  public render(): React.ReactElement<IGbtbFormProps> {
    return (
      <div className={styles.gbtbForm}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h2>Gardens By The Bay Booking Form</h2>
          </div>
          <form id="GbtbForm" ref={(el) => (this.myFormRef = el)}>
            <div className={styles.item}>
              <label>
                <p>Full name (as per NRIC)</p>
                <input
                  name="fullName"
                  required={true}
                  onChange={this.handleChange}
                  placeholder="Full Name (as per NRIC)"
                />
              </label>
            </div>
            <div className={styles.item}>
              <label>
                <p>Division</p>
                <select
                  name="division"
                  value={this.state.division}
                  onChange={this.handleChange}
                  required
                >
                  <option value="" hidden>
                    Choose an item
                  </option>
                  {formData.divisions.map((division, index) => (
                    <option key={index} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className={styles.item}>
              <label>
                <p>Department</p>
                <select
                  name="department"
                  value={this.state.department}
                  onChange={this.handleChange}
                  required
                >
                  <option value="" hidden>
                    Choose an item
                  </option>
                  {formData.departments.map((department, index) => (
                    <option key={index} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className={styles.item}>
              <label>
                <p>Intended Date of Visit</p>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    value={this.state.IDOV}
                    onChange={this.handleDateChange}
                    autoOk
                    orientation="landscape"
                    variant="static"
                    openTo="date"
                    disablePast={true}
                    maxDate={addDays(new Date(), 13)}
                    disableToolbar={false}
                    initialFocusedDate={new Date()}
                  />
              </MuiPickersUtilsProvider>
              </label>
            </div>
            <div className={styles.item}>
              <p>
                <div className={styles.buttonItem}>
                  <button
                    type="submit"
                    className={styles.button}
                    onClick={(e) => this.handleSubmit(e)}
                  >
                    Submit
                  </button>
                  <button
                    type="reset"
                    className={styles.button}
                    onClick={this.resetForm}
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
  }

  private handleChange = (e) => {
    this.setState(
      {
        ...this.state,
        [e.target.name]: e.target.value,
      },
      function () {
        console.log(this.state);
      }
    );
  };

  private handleDateChange = (date) => {
    this.setState(
      {
        ...this.state,
        IDOV: date
      }
    )
  }

  private resetForm = (e) => {
    this.myFormRef.reset();
    this.setState({
      ...initialSate,
    });
  };

  private createForm = () => {
    this.setState({
      status: "Creating item...",
    });

    let uri =
      this.props.siteUrl +
      "/_api/web/lists/getbytitle('" +
      this.props.listName +
      "')/items";

    this.setState({}, function () {
      let _spForm = App.setFormProps(this.state);
      Utils.postData(
        this.props.spHttpClient,
        uri,
        JSON.stringify(_spForm)
      ).then((response) => {
        if (response.status === 201) {
          this.resetForm();
          alert("Form submitted successfully!");
        } else {
          this.setState({
            msg: {
              error: "Form submission failed.",
            },
          });
        }
      });
    });
  };

  private handleValidation = () => {
    if (!App.validateForm(this.state)) {
      this.setState({
        status: "Invalid form",
        msg: { error: "Please fill up the required fields." },
      });
      return false;
    } else {
      this.setState({
        status: "Valid form!",
        msg: { error: "" },
      });
      return true;
    }
  };

  private handleSubmit = (e) => {
    e.preventDefault();
    this.setState(
      {
        status: "Validating form...",
      },
      function () {
        if (this.handleValidation()) {
          this.createForm();
        }
      }
    );
  };
}
