const baseApiUrl =
  process.env.NODE_ENV === "local"
    ? ""
    : `${process.env.REACT_APP_BASE_API_URL}`;

const validateJWTURL = `${baseApiUrl}${process.env.REACT_APP_VALIDATE_JWT}`;
const refreshTokenURL = `${baseApiUrl}${process.env.REACT_APP_REFRESH_TOKEN_URL}`;
const accessTokenURL = `${baseApiUrl}${process.env.REACT_APP_ACCESS_TOKEN_URL}`;
const footerURL = `${baseApiUrl}${process.env.REACT_APP_FOOTER_URL}`;

const caseloadMetricsURL = `${baseApiUrl}${process.env.REACT_APP_CASELOAD_METRICS}`;
const caseModeViewURL = `${baseApiUrl}${process.env.REACT_APP_CASELOAD}`;
const caseLoadSummaryURL = `${baseApiUrl}${process.env.REACT_APP_CASELOAD_SUMMARY}`;

const caseHeaderURL = `${baseApiUrl}${process.env.REACT_APP_CASE_HEADER}`;

const additionalDetailsURL = `${baseApiUrl}${process.env.REACT_APP_ADDITIONAL_DETAILS}`;
const returnedToWorkSaveURL = `${baseApiUrl}${process.env.REACT_APP_RETURNED_TO_WORK_SAVE}`;
const calendarDetailsURL = `${baseApiUrl}${process.env.REACT_APP_CALENDAR_DETAILS}`;
const reschedulingReasonsListURL = `${baseApiUrl}${process.env.REACT_APP_RESCHEDULING_REASONS_LIST}`;
const reschedulingIssueTypesListURL = `${baseApiUrl}${process.env.REACT_APP_RESCHEDULING_ISSUE_TYPES_LIST}`;
const reschedulingSubIssueListURL = `${baseApiUrl}${process.env.REACT_APP_RESCHEDULING_SUB_ISSUE_TYPES_LIST}`;
const reschedulingToURL = `${baseApiUrl}${process.env.REACT_APP_RESCHEDULING_TO}`;
const rescheduleSaveURL = `${baseApiUrl}${process.env.REACT_APP_RESCHEDULE_SAVE}`;
const nmiListURL = `${baseApiUrl}${process.env.REACT_APP_NMI_LIST}`;
const subnmiListURL = `${baseApiUrl}${process.env.REACT_APP_SUB_NMI_LIST}`;
const appointmentDetailsSubmissionURL = `${baseApiUrl}${process.env.REACT_APP_APPOINTMENT_DETAILS_SUBMISSION}`;
const reschedulingIssueListURL = `${baseApiUrl}${process.env.REACT_APP_RESCHEDULING_ISSUE_LIST}`;
const switchModeReasonsURL = `${baseApiUrl}${process.env.REACT_APP_SWITCH_MODE}`;
const switchModeSaveURL = `${baseApiUrl}${process.env.REACT_APP_SWITCH_SAVE}`;
const appointmentStaffListURL = `${baseApiUrl}${process.env.REACT_APP_APPOINTMENT_STAFF_LIST}`;
const appointmentAvailableURL = `${baseApiUrl}${process.env.REACT_APP_APPOINTMENT_AVAILABLE}`;
const appointmentAvailableSaveURL = `${baseApiUrl}${process.env.REACT_APP_APPOINTMENT_SAVE}`;
const appointmentNoShowURL = `${baseApiUrl}${process.env.REACT_APP_APPOINTMENT_NO_SHOW}`;
const caseManagerAvailabilityURL = `${baseApiUrl}${process.env.REACT_APP_REASSIGN_CASE_MANAGER_AVAILABILITY}`;
const reassignReasonsURL = `${baseApiUrl}${process.env.REACT_APP_REASSIGN_REASONS}`;
const reassignCaseOfficeNameURL = `${baseApiUrl}${process.env.REACT_APP_REASSIGN_CASE_OFFICE_NAME}`;
const reassignSaveURL = `${baseApiUrl}${process.env.REACT_APP_REASSIGN_SAVE}`;
const appointmentDetailsGetURL = `${baseApiUrl}${process.env.REACT_APP_APPOINTMENT_DETAILS_GET}`;
const returnToWorkEditModeURL = `${baseApiUrl}${process.env.REACT_APP_RETURN_TO_WORK_GET}`;

export {
  baseApiUrl,
  validateJWTURL,
  refreshTokenURL,
  accessTokenURL,
  footerURL,
  caseloadMetricsURL,
  caseModeViewURL,
  caseHeaderURL,
  additionalDetailsURL,
  returnedToWorkSaveURL,
  calendarDetailsURL,
  reschedulingReasonsListURL,
  reschedulingIssueTypesListURL,
  reschedulingSubIssueListURL,
  nmiListURL,
  appointmentDetailsSubmissionURL,
  reschedulingToURL,
  rescheduleSaveURL,
  reschedulingIssueListURL,
  switchModeReasonsURL,
  switchModeSaveURL,
  appointmentStaffListURL,
  appointmentAvailableURL,
  appointmentAvailableSaveURL,
  appointmentNoShowURL,
  caseLoadSummaryURL,
  caseManagerAvailabilityURL,
  reassignReasonsURL,
  reassignCaseOfficeNameURL,
  reassignSaveURL,
  appointmentDetailsGetURL,
  returnToWorkEditModeURL,
  subnmiListURL
};
