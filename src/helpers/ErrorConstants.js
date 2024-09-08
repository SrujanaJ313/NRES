export const validationMessages = {
  lookup: {
    mslRequired: "MSL is required",
    employerRequired: "Employer UI Acct # is required",
    claimantRequired: "Claimant SSN is required",
    masslayoffStartDateRequired: "Start Date is required",
    masslayoffEndDateMin: "End date can't be before Start date",
    recallStartDateRequired: "Start Date is required",
    recallEndDateMin: "End date can't be before Start date",
  },
};
export const serverErrorMessages = {
  lookupReqDTO: {
    claimantssn: {
      errorcode1: "claimantssn errorcode1 msg",
      errorcode2: "claimantssn errorcode2 msg",
      errorcode3: "claimantssn errorcode3 msg",
    },
    startDate: {
      errorcode1: "startDate errorcode1 msg",
      errorcode2: "startDate errorcode2 msg",
      errorcode3: "startDate errorcode3 msg",
    },
  },
  errorcode1: "errorcode1 msg",
  errorcode2: "errorcode2 msg",
  errorcode3: "errorcode3 msg",
  defaultErrorMsg: "Internal, please contact administrator",
};

export const SOURCE_CODES = {
  CLONED: "Cloned",
  CLAIMANT_WORK_HISTORY: "Claimant work history",
  STAFF_ENTERED: "Staff entered",
  UPLOADED: "Uploaded",
};

export const STATUS_CODES = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
};

export const ERROR_CODES_MAPPER = {
  reasonCodes: {
    "method.not.supported": "Requested HTTP method is not supported.",
    "not.found": "Requested resource not found.",
    "validation.error": "Invalid date found in the request.",
    "file.processing.failed": "An error occurred during file processing.",
    "internal.error":
      "An error occurred while processing your request. Please try again or contact the administrator for assistance.",
    "parser.error": "An error occurred while parsing the data.",
    "db.resource.not.available":
      "Resource requested is not found in the database.",
  },
  default: {
    400: "An validation error occurred while processing your request. Please try again or contact the administrator for assistance.",
    401: "Authentication Failed.",
    404: "Requested resource not found.",
    405: "Requested HTTP method is not supported.",
    500: "An error occurred while processing your request. Please try again or contact the administrator for assistance.",
    default:
      "An error occurred while processing your request. Please try again or contact the administrator for assistance.",
  },
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_CASELOAD_SUMMARY}`] = {
  "userid.mandatory": "User Id is mandatory",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_APPOINTMENT_NO_SHOW}`] = {
  "eventId.mandatory": "RSIC Id is mandatory",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_NMI_LIST}`] = {
  "page.mandatory": "Page is mandatory",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_CALENDAR_DETAILS}`] = {
  "userId.mandatory": "User Id is mandatory",
};

ERROR_CODES_MAPPER[`GET:${process.env.REACT_APP_CASE_HEADER}`] = {
  "eventId.mandatory": "RSIC Id is mandatory",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_SWITCH_SAVE}`] = {
  "switchmeetingmode.reason.mandatory":
    "Reason for switching meeting mode is mandatory",
  "change.reason.text.exceeds_limit":
    "Reason for switching meeting mode exceeds character limit, please limit to 1000 characters",
  "currentmeetingmode.mandatory": "Current Meeting mode is mandatory",
  "meetingModeChgReasonTxt.mandatory":
    "Please enter the description for switching meeting mode",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_RETURNED_TO_WORK_SAVE}`] = {
  "empStartDt.mandatory": "Employment Start Date is mandatory",
  "companyName.mandatory": "Company Name is mandatory",
  "jobTitle.mandatory": "Job Title is mandatory",
  "workSchedule.mandatory": "Work Schedule is mandatory",
  "hourlyPayRate.mandatory": "Hourly Pay Rate is mandatory",
  "state.mandatory": "State is mandatory",
  "city.mandatory": "City is mandatory",
  "workMode.mandatory": "Work Mode is mandatory",
  "staffNotes.exceeds_limit":
    "Staff Notes exceeds character limit, please limit to 4000 characters",
  "jms890IndAnjmsReferralInd.bothEmpty":
    "Either Non-Direct placement Recorded or JMS Referral Recorded should be checked",
  "jmsCompletedItems.checkedOff":
    "For future start date, None of the items listed for JMS completed should not be checked.",
  "jmsCompletedItems.checkedNotOff":
    "For past start date, JMS completed checklist should be checked.",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_RESCHEDULE_SAVE}`] = {
  "nonCompliance.indicator.mandatory": "Non Compliance Indicator is mandatory",
  "reschedule.reason.mandatory": "Reschedule Reason is mandatory",
  "lateSchedulingNotes.exceeds_limit":
    "Late Notes exceeds character limit, please limit to 4000 characters",
  "preferredMeetingMode.bothNotChecked":
    "Either In-Person or Virtual should be checked",
  "appointmentDate.mandatory": "Appointment Date is mandatory",
  "appointmentTime.mandatory": "Appointment Time is mandatory",
  "entityCity.mandatory": "City is mandatory",
  "entityState.mandatory": "State is mandatory",
  "entityName.mandatory": "Employer name is mandatory",
  "entityTeleNumber.mandatory": "Employer telephone number is mandatory",
  "jobTitle.mandatory": "Job title is mandatory",
  "partFullTimeInd.mandatory": "Part time/Full time indicator is mandatory",
};

ERROR_CODES_MAPPER[`POST:${process.env.REACT_APP_APPOINTMENT_SAVE}`] = {
  "rsicId.notAvailable": "Appointment Slot is not Available",
  "for.lof.invalid": "User does not have access to For Local Office option",
  "for.mgr.invalid": "User does not have access to For Case Manager option",
  "claimId.mandatory":
    "Please select a claimant for scheduling the appointment",
  "informedCmtInd.mandatory":
    "Please inform claimant and select Informed Claimant to check claimant portal",
  "informedConveyedBy.mandatory":
    "Please check option by which information was conveyed to claimant",
};
