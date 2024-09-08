import * as yup from "yup";
import moment from "moment";

const initialAppointmentDetailsSchema = yup.object().shape({
  jmsItems: yup
    .object()
    .shape({
      InitialAssessment: yup.boolean().oneOf([true], "Required field"),
      Eri1On1: yup.boolean().oneOf([true], "Required field"),
      ELMIServices: yup.boolean().oneOf([true], "Required field"),
      JobDevelopment: yup.boolean().oneOf([true], "Required field"),
      CaseManagement: yup.boolean().oneOf([true], "Required field"),
      AttendedRESEA: yup.boolean().oneOf([true], "Required field"),
      DevelopIEP: yup.boolean().oneOf([true], "Required field"),
      ReferWIOATraining: yup.boolean().oneOf([true], "Required field"),
      RsidJmsSelfCmInd: yup.boolean().oneOf([true], "Required field"),
      JMSCaseNotes: yup.boolean().oneOf([true], "Required field"),
      JMSRegComplete: yup.boolean(),
      JMSRegIncomplete: yup.boolean(),
      WagnerPeyserApplComplete: yup.boolean().oneOf([true], "Required field"),
      WagnerPeyserApplSignature: yup.boolean().oneOf([true], "Required field"),
      IEPSignatureCopy: yup.boolean().oneOf([true], "Required field"),
    })
    .test(
      "one-and-only-one",
      "JMS Registration Complete or JMS Registration Incomplete & Warning Issued must be selected",
      (value) => {
        const { JMSRegComplete, JMSRegIncomplete } = value;
        // Ensure exactly one checkbox is checked
        return (
          (JMSRegComplete && !JMSRegIncomplete) ||
          (!JMSRegComplete && JMSRegIncomplete)
        );
      }
    ),
  outsideWebReferral: yup
    .array()
    // .when("jmsItems.OutsideWebReferral", {
    //   is: true,
    //   then: (schema) => schema.required("Date value is required"),
    // })
    .of(
      yup.object().shape({
        jobTitle: yup.string().required("Title is required"),
        employerName: yup.string().required("Employer Name is required"),
      })
    )
    .test(
      "min-one-if-active",
      "At least one job referral is required",
      function (value) {
        const { jmsItems } = this.parent;
        if (jmsItems.OutsideWebReferral && (!value || value.length === 0)) {
          return false;
        }
        return true;
      }
    ),
  jMSJobReferral: yup
    .array()
    // .when("jmsItems.OutsideWebReferral", {
    //   is: true,
    //   then: (schema) => schema.required("Date value is required"),
    // })
    .of(
      yup.object().shape({
        jobTitle: yup.string().required("Title is required"),
        employerName: yup.string().required("Employer Name is required"),
      })
    )
    .test(
      "min-one-if-active",
      "At least one job referral is required",
      function (value) {
        const { jmsItems } = this.parent;
        if (jmsItems.jMSJobReferral && (!value || value.length === 0)) {
          return false;
        }
        return true;
      }
    ),
  rsidJmsResumeExpDt: yup
    .date()
    .nullable()
    .when("jmsItems.ActiveResume", {
      is: true,
      then: (schema) => schema.required("Date value is required"),
    }),
  rsidJmsVRecrtExpDt: yup
    .date()
    .nullable()
    .when("jmsItems.ActiveVirtualRecuiter", {
      is: true,
      then: (schema) => schema.required("Date value is required"),
    }),
  workSearchIssues: yup
    .array()
    .of(
      yup.object().shape({
        status: yup.string().required("Select work search status"),
        activelySeekingWork: yup.string().when("status", {
          is: "createIssue",
          then: (schema) => schema.required("Issue Type is required"),
        }),
      })
    )
    .test(
      "recent-one",
      "Must check-off most recent three continued claim weeks as having been reviewed.",
      (value) => {
        const items = value.filter((x) => x.recent);
        return value.length >= 1 && items.length === value[0].recentItemsCount;
        // const { JMSRegComplete, JMSRegIncomplete } = value;
        // // Ensure exactly one checkbox is checked
        // return (
        //   (JMSRegComplete && !JMSRegIncomplete) ||
        //   (!JMSRegComplete && JMSRegIncomplete)
        // );
      }
    ),
  otherIssues: yup.array().of(
    yup.object().shape({
      issueType: yup.string().when("selected", {
        is: true,
        then: (schema) => schema.required("Issue Type is required"),
      }),
      issueSubType: yup.string().when("selected", {
        is: true,
        then: (schema) => schema.required("Sub Issue Type is required"),
      }),
      startDt: yup
        .date()
        .nullable()
        .when("selected", {
          is: true,
          then: (schema) => schema.required("Start Date is required"),
        }),
      endDt: yup
        .date()
        .nullable()
        .test(
          "greater",
          "End Date should be greater than Start Date",
          function (value) {
            if (value && this.parent.startDt) {
              return moment(this.parent.startDt) < moment(value);
            }
            return true;
          }
        ),
    })
  ),
  actionTaken: yup.object().shape({
    ReviewedReEmpPlan: yup.boolean().oneOf([true], "Required field"),
    AssignedReEmpPlan: yup.boolean().oneOf([true], "Required field"),
    PhysicallyVerifiedID: yup.boolean().oneOf([true], "Required field"),
    RemindedSelfSchedule: yup.boolean().oneOf([true], "Required field"),
  }),
  rsidMrpAssgnd: yup.string().when("actionTaken.AssignedReEmpPlan", {
    is: true,
    then: (schema) => schema.required("Assigned Chapters must be selected"),
  }),
  rsidSlfSchByDt: yup
    .date()
    .nullable()
    .when("actionTaken.RemindedSelfSchedule", {
      is: true,
      then: (schema) => schema.required("Date value is required"),
    }),
  esConfirm: yup
    .string()
    .oneOf(
      ["Y"],
      "Please confirm necessary Employment Services to this claimant."
    ),
});

const firstAppointmentDetailsSchema = yup.object().shape({
  jmsItems: yup.object().shape({
    Eri1On1: yup.boolean().oneOf([true], "Required field"),
    JobDevelopment: yup.boolean().oneOf([true], "Required field"),
    CaseManagement: yup.boolean().oneOf([true], "Required field"),
    AttendedRESEA: yup.boolean().oneOf([true], "Required field"),
    DevelopIEP: yup.boolean().oneOf([true], "Required field"),
    ReferWIOATraining: yup.boolean().oneOf([true], "Required field"),
    ReferToVRorDHHS: yup.boolean().oneOf([true], "Required field"),
    IEPSignatureCopy: yup.boolean().oneOf([true], "Required field"),
    RsidJmsSelfCmInd: yup.boolean().oneOf([true], "Required field"),
    JMSCaseNotes: yup.boolean().oneOf([true], "Required field"),
  }),
  outsideWebReferral: yup
    .array()
    // .when("jmsItems.OutsideWebReferral", {
    //   is: true,
    //   then: (schema) => schema.required("Date value is required"),
    // })
    .of(
      yup.object().shape({
        jobTitle: yup.string().required("Title is required"),
        employerName: yup.string().required("Employer Name is required"),
      })
    )
    .test(
      "min-one-if-active",
      "At least one job referral is required",
      function (value) {
        const { jmsItems } = this.parent;
        if (jmsItems.OutsideWebReferral && (!value || value.length === 0)) {
          return false;
        }
        return true;
      }
    ),
  jMSJobReferral: yup
    .array()
    // .when("jmsItems.OutsideWebReferral", {
    //   is: true,
    //   then: (schema) => schema.required("Date value is required"),
    // })
    .of(
      yup.object().shape({
        jobTitle: yup.string().required("Title is required"),
        employerName: yup.string().required("Employer Name is required"),
      })
    )
    .test(
      "min-one-if-active",
      "At least one job referral is required",
      function (value) {
        const { jmsItems } = this.parent;
        if (jmsItems.jMSJobReferral && (!value || value.length === 0)) {
          return false;
        }
        return true;
      }
    ),
  workSearchIssues: yup
    .array()
    .min(1, "Atleast one is required")
    .of(
      yup.object().shape({
        status: yup.string().required("Select work search status"),
        activelySeekingWork: yup.string().when("status", {
          is: "createIssue",
          then: (schema) => schema.required("Issue Type is required"),
        }),
      })
    ),
  otherIssues: yup.array().of(
    yup.object().shape({
      issueType: yup.string().when("selected", {
        is: true,
        then: (schema) => schema.required("Issue Type is required"),
      }),
      issueSubType: yup.string().when("selected", {
        is: true,
        then: (schema) => schema.required("Sub Issue Type is required"),
      }),
      startDt: yup
        .date()
        .nullable()
        .when("selected", {
          is: true,
          then: (schema) => schema.required("Start Date is required"),
        }),
      endDt: yup
        .date()
        .nullable()
        .test(
          "greater",
          "End Date should be greater than Start Date",
          function (value) {
            return moment(this.parent.startDt) < moment(value);
          }
        ),
    })
  ),
  actionTaken: yup.object().shape({
    ReviewedReEmpPlan: yup.boolean().oneOf([true], "Required field"),
    AssignedReEmpPlan: yup.boolean().oneOf([true], "Required field"),
    CheckedPriorJobReferrals: yup.boolean().oneOf([true], "Required field"),
    PhysicallyVerifiedID: yup.boolean().oneOf([true], "Required field"),
    RemindedSelfSchedule: yup.boolean().oneOf([true], "Required field"),
  }),
  // rsidMrpAssgnd: yup.string().when("actionTaken.AssignedReEmpPlan", {
  //   is: true,
  //   then: (schema) => schema.required("Assigned Chapters must be selected"),
  // }),
  rsidSlfSchByDt: yup
    .date()
    .nullable()
    .when("actionTaken.RemindedSelfSchedule", {
      is: true,
      then: (schema) => schema.required("Date value is required"),
    }),
  esConfirm: yup
    .string()
    .oneOf(
      ["Y"],
      "Please confirm necessary Employment Services to this claimant."
    ),
});

const secondAppointmentDetailsSchema = yup.object().shape({
  jmsItems: yup.object().shape({
    Eri1On1: yup.boolean().oneOf([true], "Required field"),
    JobDevelopment: yup.boolean().oneOf([true], "Required field"),
    CaseManagement: yup.boolean().oneOf([true], "Required field"),
    AttendedRESEA: yup.boolean().oneOf([true], "Required field"),
    DevelopIEP: yup.boolean().oneOf([true], "Required field"),
    ReferWIOATraining: yup.boolean().oneOf([true], "Required field"),
    ReferToVRorDHHS: yup.boolean().oneOf([true], "Required field"),
    IEPSignatureCopy: yup.boolean().oneOf([true], "Required field"),
    RsidJmsSelfCmInd: yup.boolean().oneOf([true], "Required field"),
    JMSCaseNotes: yup.boolean().oneOf([true], "Required field"),
    CloseGoals: yup.boolean().oneOf([true], "Required field"),
    JmsCloseIEP: yup.boolean().oneOf([true], "Required field"),
  }),
  outsideWebReferral: yup
    .array()
    // .when("jmsItems.OutsideWebReferral", {
    //   is: true,
    //   then: (schema) => schema.required("Date value is required"),
    // })
    .of(
      yup.object().shape({
        jobTitle: yup.string().required("Title is required"),
        employerName: yup.string().required("Employer Name is required"),
      })
    )
    .test(
      "min-one-if-active",
      "At least one job referral is required",
      function (value) {
        const { jmsItems } = this.parent;
        if (jmsItems.OutsideWebReferral && (!value || value.length === 0)) {
          return false;
        }
        return true;
      }
    ),
  jMSJobReferral: yup
    .array()
    // .when("jmsItems.OutsideWebReferral", {
    //   is: true,
    //   then: (schema) => schema.required("Date value is required"),
    // })
    .of(
      yup.object().shape({
        jobTitle: yup.string().required("Title is required"),
        employerName: yup.string().required("Employer Name is required"),
      })
    )
    .test(
      "min-one-if-active",
      "At least one job referral is required",
      function (value) {
        const { jmsItems } = this.parent;
        if (jmsItems.jMSJobReferral && (!value || value.length === 0)) {
          return false;
        }
        return true;
      }
    ),
  workSearchIssues: yup
    .array()
    .min(1, "Atleast one is required")
    .of(
      yup.object().shape({
        status: yup.string().required("Select work search status"),
        activelySeekingWork: yup.string().when("status", {
          is: "createIssue",
          then: (schema) => schema.required("Issue Type is required"),
        }),
      })
    ),
  otherIssues: yup.array().of(
    yup.object().shape({
      issueType: yup.string().when("selected", {
        is: true,
        then: (schema) => schema.required("Issue Type is required"),
      }),
      issueSubType: yup.string().when("selected", {
        is: true,
        then: (schema) => schema.required("Sub Issue Type is required"),
      }),
      startDt: yup
        .date()
        .nullable()
        .when("selected", {
          is: true,
          then: (schema) => schema.required("Start Date is required"),
        }),
      endDt: yup
        .date()
        .nullable()
        .test(
          "greater",
          "End Date should be greater than Start Date",
          function (value) {
            return moment(this.parent.startDt) < moment(value);
          }
        ),
      // .when("selected", {
      //   is: true,
      //   then: (schema) => schema.required("End Date is required"),
      // }),
    })
  ),
  actionTaken: yup.object().shape({
    ReviewedReEmpPlan: yup.boolean().oneOf([true], "Required field"),
    EPandCheckListUpld: yup.boolean().oneOf([true], "Required field"),
    CheckedPriorJobReferrals: yup.boolean().oneOf([true], "Required field"),
    PhysicallyVerifiedID: yup.boolean().oneOf([true], "Required field"),
  }),

  esConfirm: yup
    .string()
    .oneOf(
      ["Y"],
      "Please confirm necessary Employment Services to this claimant."
    ),
});

const isDateValid = (dateStr) => {
  const inputDate = new Date(dateStr);
  const currentDate = new Date();
  return inputDate <= currentDate;
};

const returnToWorkValidationsSchema = (values) => {
  const errors = {};
  if (!values.empName) {
    errors.empName =
      "Employer Name is required. Please enter your employer's name.";
  } else if (!/^[a-zA-Z0-9 ]*$/.test(values.empName)) {
    errors.empName = "Job title should not contain special characters.";
  }

  if (!values.empWorkLocState) {
    errors.empWorkLocState = "State is required. Please select a state.";
  }

  if (!values.empWorkLocCity) {
    errors.empWorkLocCity = "City is required. Please enter the city.";
  }

  if (!values.exactJobTitle) {
    errors.exactJobTitle =
      "Job title is required. Please enter your job title.";
  } else if (!/^[a-zA-Z0-9 ]*$/.test(values.exactJobTitle)) {
    errors.exactJobTitle = "Job title should not contain special characters.";
  }

  if (!values.employmentStartDt) {
    errors.employmentStartDt =
      "Start date is required. Please select a valid date.";
  } else if (isNaN(new Date(values.employmentStartDt).getTime())) {
    errors.employmentStartDt =
      "Start date is required. Please select a valid date.";
  }

  if (!values.hourlyPayRate) {
    errors.hourlyPayRate =
      "Hourly pay rate is required. Please enter the hourly pay rate.";
  } else if (!/^\d+(\.\d{1,2})?$/.test(values.hourlyPayRate)) {
    errors.hourlyPayRate =
      "Hourly pay rate must have at most two decimal places.";
  } else if (Number(values.hourlyPayRate) > 999.99) {
    errors.hourlyPayRate =
      "Hourly pay rate must be less than or equal to 999.99.";
  }

  if (!values.partFullTimeInd) {
    errors.partFullTimeInd =
      "Work schedule is required. Please select a work schedule.";
  }

  if (!values.workMode) {
    errors.workMode = "Work mode is required. Please select a work mode.";
  }

  if (isDateValid(values.employmentStartDt)) {
    const jmsCheckboxes = [
      // "jms890Ind",
      "jmsCaseNotesInd",
      "jmsCloseGoalsInd",
      "jmsCloseIEPInd",
      // "jmsReferralInd",
      "jmsResumeOffInd",
      "epChecklistUploadInd",
    ];

    jmsCheckboxes.forEach((field) => {
      if (values[field] === "N") {
        errors[field] = "Please select the checkbox.";
      }
    });

    if (values.jms890Ind === "N" && values.jmsReferralInd === "N") {
      errors.jms890Ind = errors.jmsReferralInd =
        "One of jms890Ind or jmsReferralInd must be checked";
    }
  }

  return errors;
};

const rescheduleValidationSchema = (rescheduleReasons, rescheduleReason) => {
  return yup.object({
    rescheduleTo: yup.string().required("Reschedule to is required"),
    mode: yup
      .object({
        selectedPrefMtgModeInPerson: yup.boolean(),
        selectedPrefMtgModeVirtual: yup.boolean(),
      })
      .test(
        "at-least-one",
        "At least one mode must be selected",
        (value) =>
          value.selectedPrefMtgModeInPerson || value.selectedPrefMtgModeVirtual
      ),
    reasonForRescheduling: yup
      .string()
      .required("Reason for rescheduling is required"),
    // tempSuspendedInd: yup
    //   .string()
    //   .oneOf(["Y"], "You must check Placeholder Meeting")
    //   .required("You must check Placeholder Meeting"),
    lateSchedulingReason: yup.string().when("rescheduleTo", {
      is: (rescheduleTo) => {
        rescheduleReason = rescheduleReasons.find(
          (r) => r.newRsicId === Number(rescheduleTo)
        );
        return (
          rescheduleTo !== "" && rescheduleReason?.nonComplianceInd === "Y"
        );
      },
      then: () => yup.string().required("Reason for scheduling is required"),
    }),
    staffNotes: yup.string(),
    appointmentDate: yup.date().when("reasonForRescheduling", {
      is: (reasonForRescheduling) =>
        ["3159", "3160", "3163"].includes(reasonForRescheduling),
      then: () => yup.date().required("Appointment Date is required"),
    }),
    appointmentTime: yup.string().when("reasonForRescheduling", {
      is: (reasonForRescheduling) =>
        ["3159", "3160", "3163"].includes(reasonForRescheduling),
      then: () => yup.string().required("Appointment Time is required"),
    }),
    entityCity: yup.string().when("reasonForRescheduling", {
      is: (reasonForRescheduling) =>
        ["3159", "3160"].includes(reasonForRescheduling),
      then: () => yup.string().required("City is required"),
    }),
    entityState: yup.string().when("reasonForRescheduling", {
      is: (reasonForRescheduling) =>
        ["3159", "3160"].includes(reasonForRescheduling),
      then: () => yup.string().required("State is required"),
    }),
    entityName: yup.string().when("reasonForRescheduling", {
      is: (reasonForRescheduling) => reasonForRescheduling === "3163",
      then: () => yup.string().required("Employer Name is required"),
    }),
    entityTeleNumber: yup
      .string()
      .matches(/^\d{10}$/, "Telephone number must be exactly 10 digits")
      .when("reasonForRescheduling", {
        is: (reasonForRescheduling) => reasonForRescheduling === "3163",
        then: () => yup.string().required("Contact Number is required"),
      }),
    jobTitle: yup.string().when("reasonForRescheduling", {
      is: (reasonForRescheduling) => reasonForRescheduling === "3163",
      then: () =>
        yup
          .string()
          .required("Job Title is required")
          .matches(
            /^[a-zA-Z0-9\s]*$/,
            "Job Title cannot contain special characters"
          ),
    }),
    issues: yup.array().of(
      yup.object().shape({
        issueType: yup.object().required("Issue Type is required"),
        subIssueType: yup.object().required("Sub Issue Type is required"),
        issueStartDate: yup.date().required("Start Date is required"),
        issueEndDate: yup.date().required("End Date is required"),
      })
    ),
    partFullTimeInd: yup
      .string()
      .required("Work schedule is required. Please select a work schedule."),
  });
};

const availableEventSchema = yup.object().shape({
  claimant: yup.string().required("For is required"),
  claimantId: yup.string().required("claimant is required"),
  staffNotes: yup.string().optional(),
  informedCmtInd: yup
    .string()
    .oneOf(["Y"], "Please Check Informed Claimant")
    .required("You must check Informed Claimant"),
  status: yup.string().required("Status is required"),
  informedConveyedBy: yup
    .array()
    .of(yup.string())
    .min(1, "At least one information conveyed method must be selected"),
  caseManagerId: yup.string().when("claimant", {
    is: (claimant) => claimant === "Case Manager",
    then: () => yup.string().required("Case Manager is required"),
  }),
});

const switchValidationSchema = yup.object({
  reasonForSwitchMeetingMode: yup
    .string()
    .required("Reason for switching meeting mode is required"),
  meetingModeChgReasonTxt: yup.string().when("reasonForSwitchMeetingMode", {
    is: (val) => val === "5696",
    then: () => yup.string().required("Additional Details are required"),
  }),
  issues: yup.array().of(
    yup.object().shape({
      issueType: yup.object().required("Issue Type is required"),
      subIssueType: yup.object().required("Sub Issue Type is required"),
      issueStartDate: yup.date().required("Start Date is required"),
      issueEndDate: yup.date().required("End Date is required"),
    })
  ),
});

export {
  initialAppointmentDetailsSchema,
  firstAppointmentDetailsSchema,
  secondAppointmentDetailsSchema,
  returnToWorkValidationsSchema,
  isDateValid,
  rescheduleValidationSchema,
  availableEventSchema,
  switchValidationSchema,
};

