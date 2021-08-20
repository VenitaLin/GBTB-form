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
    fullName: props.fullName,
    division: props.division,
    department: props.department,
    IDOV: props.IDOV,
  };
  return _spForm;
};
