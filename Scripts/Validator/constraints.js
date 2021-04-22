export const registerConstraints = {
  emailAddress: {
    presence: {
      allowEmpty: false,
      message: '^Please enter an email address.'
    },
    email: {
      message: '^Please enter a valid email address.'
    },
  },
  dob: {
    presence: {
      allowEmpty: false,
      message: '^Please specify a birthday.'
    },
    datetime: {
      dateOnly: false,
      latest: new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      message: '^You must be at least 18 year olds to register.'
    }
  },
  firstName: {
    presence: {
      allowEmpty: false,
      message: '^Please specify a first name.'
    }
  },
  lastName: {
    presence: {
      allowEmpty: false,
      message: '^Please specify a last name.'
    }
  },
  confirmPassword: {
    equality: {
      attribute: 'password',
      message: '^Please ensure passwords match.'
    }
  }
};
