import { ERROR_CODES_MAPPER } from "./ErrorConstants";
import moment from "moment/moment";

export const getMsgsFromErrorCode = (apiPath, errorResponse) => {
  let messageCodes = [],
    messages = [];
  if (errorResponse?.errorDetails?.length > 0) {
    errorResponse.errorDetails.forEach((ed) => {
      ed.errorCode.forEach((ec) => {
        messageCodes = [...messageCodes, ...ed.errorCode];
      });
    });
  } else if (errorResponse.reason) {
    messageCodes.push(errorResponse.reason);
  } else {
    messageCodes.push(errorResponse.status);
  }
  // const urlPath = apiPath.substring(apiPath.indexOf('/')+1)
  messageCodes.forEach((code) => {
    if (ERROR_CODES_MAPPER[apiPath] && ERROR_CODES_MAPPER[apiPath][code]) {
      messages.push(ERROR_CODES_MAPPER[apiPath][code]);
    } else if (ERROR_CODES_MAPPER.reasonCodes[code]) {
      messages.push(ERROR_CODES_MAPPER.reasonCodes[code]);
    } else if (ERROR_CODES_MAPPER.default[code]) {
      messages.push(ERROR_CODES_MAPPER.default[code]);
    } else {
      messages.push(ERROR_CODES_MAPPER.default.default);
    }
  });
  if (messages.length === 0) {
    messages.push(ERROR_CODES_MAPPER.default.default);
  }
  return messages;
};
export const convertISOToMMDDYYYY = (isoString) => {
  const date = new Date(isoString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");  
  const year = date.getFullYear();  
  return `${month}/${day}/${year}`;
};

export const convertTimeToHoursMinutes = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return time;
};

export const sortAlphabetically = (data) => {
  return data.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
};

export function getGreeting(userName) {
  const currentHour = new Date().getHours();

  let greeting;

  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return `${greeting}, ${userName}!`;
}

export const getIsPastAppointment = (event) => {
  const appointmentDateTime = moment(
    `${event.appointmentDt} ${event.startTime}`
  );
  const adjustedDateTime = appointmentDateTime.subtract(30, "minutes");
  const isPastAppointment = moment().isAfter(adjustedDateTime);
  return isPastAppointment;
};

export const isCurrentAppointment = (event) => {
  const appointmentStartTime = moment(
    `${event.appointmentDt} ${event.startTime}`
  ).subtract(30, "minutes");
  const appointmentEndTime = moment(
    `${event.appointmentDt} ${event.endTime}`
  ).add(30, "minutes");
  return (
    moment().isAfter(appointmentStartTime) &&
    moment().isBefore(appointmentEndTime)
  );
};
