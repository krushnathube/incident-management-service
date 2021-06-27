interface AuthErrors {
  username?: string;
  password?: string;
}

interface IncidentErrors {
  title?: string;
  assignee?: string;
  description?: string;
  type?: string;
}

export const registerValidator = (username: string, password: string) => {
  const errors: AuthErrors = {};

  if (
    !username ||
    username.trim() === "" ||
    username.length > 20 ||
    username.length < 3
  ) {
    errors.username = "Username must be in range of 3-20 characters length.";
  }

  if (!/^[a-zA-Z0-9-_]*$/.test(username)) {
    errors.username = "Username must have alphanumeric characters only.";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be atleast 6 characters long.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const loginValidator = (username: string, password: string) => {
  const errors: AuthErrors = {};

  if (!username || username.trim() === "") {
    errors.username = "Username field must not be empty.";
  }

  if (!password) {
    errors.password = "Password field must not be empty.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const incidentTitleError = (title: string) => {
  if (!title || title.trim() === "" || title.length > 60 || title.length < 3) {
    return "Title must be in range of 3-60 characters length.";
  }
};

export const incidentAssigneeError = (assigneeId: string) => {
  if (!assigneeId || assigneeId === "") {
    return "Assignee must required.";
  }

  if (assigneeId.length !== 36) {
    return "Assignee must contain valid UUIDs.";
  }
};

export const createIncidentValidator = (
  title: string,
  assigneeId: string,
  description: string,
  type: string
) => {
  const errors: IncidentErrors = {};
  const titleError = incidentTitleError(title);
  const assigneeError = incidentAssigneeError(assigneeId);

  if (titleError) {
    errors.title = titleError;
  }

  if (assigneeError) {
    errors.assignee = assigneeError;
  }

  const validPriorities = [
    "employee",
    "environmental",
    "property",
    "vehicle",
    "fire",
  ];

  if (!description || description.trim() === "") {
    errors.description = "Description field must not be empty.";
  }

  if (!type || !validPriorities.includes(type)) {
    errors.type =
      "Type can only be - employee, environmental, property, vehicle or fire.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
