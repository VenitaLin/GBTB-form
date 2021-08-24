export const validateForm = (props) => {
  if (
    !props.fullName ||
    !props.division ||
    !props.department
  ) {
    return false;
  } else {
    return true;
  }
};

export const setFormProps = (props) => {
  let _spForm = {
    Title: props.fullName,
    division: props.division,
    department: props.department,
    IDOV: props.IDOV,
  };
  return _spForm;
};

export const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}