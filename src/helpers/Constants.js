export const AVAILABLE_LINK_BEFORE_DURATION = 15;
export const MEETING_INVITE_SHOW_BUFFER_DURATION = 30;
export const OTHER_ACTIONS_SELF_SCHEDULE = 10;

// In your constants file (e.g., Constants.js)

export const STATES = [
  {
    name: "Alabama",
    id: "AL",
  },
  {
    name: "Alaska",
    id: "AK",
  },
  {
    name: "American Samoa",
    id: "AS",
  },
  {
    name: "Arizona",
    id: "AZ",
  },
  {
    name: "Arkansas",
    id: "AR",
  },
  {
    name: "California",
    id: "CA",
  },
  {
    name: "Colorado",
    id: "CO",
  },
  {
    name: "Connecticut",
    id: "CT",
  },
  {
    name: "Delaware",
    id: "DE",
  },
  {
    name: "District Of Columbia",
    id: "DC",
  },
  {
    name: "Federated States Of Micronesia",
    id: "FM",
  },
  {
    name: "Florida",
    id: "FL",
  },
  {
    name: "Georgia",
    id: "GA",
  },
  {
    name: "Guam",
    id: "GU",
  },
  {
    name: "Hawaii",
    id: "HI",
  },
  {
    name: "Idaho",
    id: "ID",
  },
  {
    name: "Illinois",
    id: "IL",
  },
  {
    name: "Indiana",
    id: "IN",
  },
  {
    name: "Iowa",
    id: "IA",
  },
  {
    name: "Kansas",
    id: "KS",
  },
  {
    name: "Kentucky",
    id: "KY",
  },
  {
    name: "Louisiana",
    id: "LA",
  },
  {
    name: "Maine",
    id: "ME",
  },
  {
    name: "Marshall Islands",
    id: "MH",
  },
  {
    name: "Maryland",
    id: "MD",
  },
  {
    name: "Massachusetts",
    id: "MA",
  },
  {
    name: "Michigan",
    id: "MI",
  },
  {
    name: "Minnesota",
    id: "MN",
  },
  {
    name: "Mississippi",
    id: "MS",
  },
  {
    name: "Missouri",
    id: "MO",
  },
  {
    name: "Montana",
    id: "MT",
  },
  {
    name: "Nebraska",
    id: "NE",
  },
  {
    name: "Nevada",
    id: "NV",
  },
  {
    name: "New Hampshire",
    id: "NH",
  },
  {
    name: "New Jersey",
    id: "NJ",
  },
  {
    name: "New Mexico",
    id: "NM",
  },
  {
    name: "New York",
    id: "NY",
  },
  {
    name: "North Carolina",
    id: "NC",
  },
  {
    name: "North Dakota",
    id: "ND",
  },
  {
    name: "Northern Mariana Islands",
    id: "MP",
  },
  {
    name: "Ohio",
    id: "OH",
  },
  {
    name: "Oklahoma",
    id: "OK",
  },
  {
    name: "Oregon",
    id: "OR",
  },
  {
    name: "Palau",
    id: "PW",
  },
  {
    name: "Pennsylvania",
    id: "PA",
  },
  {
    name: "Puerto Rico",
    id: "PR",
  },
  {
    name: "Rhode Island",
    id: "RI",
  },
  {
    name: "South Carolina",
    id: "SC",
  },
  {
    name: "South Dakota",
    id: "SD",
  },
  {
    name: "Tennessee",
    id: "TN",
  },
  {
    name: "Texas",
    id: "TX",
  },
  {
    name: "Utah",
    id: "UT",
  },
  {
    name: "Vermont",
    id: "VT",
  },
  {
    name: "Virgin Islands",
    id: "VI",
  },
  {
    name: "Virginia",
    id: "VA",
  },
  {
    name: "Washington",
    id: "WA",
  },
  {
    name: "West Virginia",
    id: "WV",
  },
  {
    name: "Wisconsin",
    id: "WI",
  },
  {
    name: "Wyoming",
    id: "WY",
  },
];

export const JMS_ITEMS_INITIAL = [
  {
    label: "*102: Initial Assessment",
    value: "InitialAssessment",
  },
  {
    label: "*106: ERI 1-on-1",
    value: "Eri1On1",
  },
  {
    label: "*107: ELMI Services",
    value: "ELMIServices",
  },
  {
    label: "*123: Job Development",
    value: "JobDevelopment",
  },
  {
    label: "*153: Case Management",
    value: "CaseManagement",
  },
  {
    label: "*160: Attended RESEA",
    value: "AttendedRESEA",
  },
  {
    label: "179: Outside Referral (If Applicable)",
    value: "OutsideWebReferral",
    edit: true,
    editFieldName: "outsideWebReferral",
  },
  {
    label: "*205: Develop IEP",
    value: "DevelopIEP",
  },
  {
    label: "*209: Refer to WIOA state & local training",
    value: "ReferWIOATraining",
  },
  {
    label: "500+: JMS Job Referral",
    value: "JMSJobReferral",
    edit: true,
    editFieldName: "jMSJobReferral",
  },
  {
    label: "*Add Self as Case Manager",
    value: "AddSelfCaseManager",
  },
  {
    label: "*JMS Case Notes",
    value: "JMSCaseNotes",
  },
  {
    label: "JMS Registration Complete",
    value: "JMSRegComplete",
  },
  {
    label: "JMS Registration Incomplete & Warning Issued",
    value: "JMSRegIncomplete",
  },
  {
    label: "*Active Resume - Expiration Date:",
    value: "ActiveResume",
    date: true,
    dateFieldName: "jmsResumeExpDt",
  },
  {
    label: "*Active Virtual Recruiter - Expiration Date:",
    value: "ActiveVirtualRecuiter",
    date: true,
    dateFieldName: "jmsVRExpDt",
  },
  {
    label: "*Wagner-Peyser Application Completed with Individual",
    value: "WagnerPeyserApplComplete",
  },
  {
    label: "*Wagner-Peyser Application Signature sent",
    value: "WagnerPeyserApplSignature",
  },
  {
    label: "*Send IEP for Signature and give copy",
    value: "IEPSignatureCopy",
  },
];

export const JMS_ITEMS_FIRST = [
  {
    label: "*106: ERI 1-on-1",
    value: "Eri1On1",
  },
  {
    label: "*123: Job Development",
    value: "JobDevelopment",
  },
  {
    label: "*153: Case Management",
    value: "CaseManagement",
  },
  {
    label: "179: Outside Referral (If Applicable)",
    value: "OutsideWebReferral",
    edit: true,
    editFieldName: "outsideWebReferral",
  },
  {
    label: "*160: Attended RESEA",
    value: "AttendedRESEA",
  },
  {
    label: "*205: Develop IEP",
    value: "DevelopIEP",
  },
  {
    label: "500+: JMS Job Referral",
    value: "JMSJobReferral",
    edit: true,
    editFieldName: "jMSJobReferral",
  },
  {
    label: "*209: Refer to WIOA state & local training",
    value: "ReferWIOATraining",
  },
  {
    label: "*Refer to VR or DHHS",
    value: "ReferToVRorDHHS",
  },
  {
    label: "*Send IEP for Signature and give copy",
    value: "IEPSignatureCopy",
  },
  {
    label: "*Add Self as Case Manager",
    value: "AddSelfCaseManager",
  },
  {
    label: "*JMS Case Notes",
    value: "JMSCaseNotes",
  },
];

export const JMS_ITEMS_SECOND = [
  {
    label: "*106: ERI 1-on-1",
    value: "Eri1On1",
  },
  {
    label: "*123: Job Development",
    value: "JobDevelopment",
  },
  {
    label: "*153: Case Management",
    value: "CaseManagement",
  },
  {
    label: "179: Outside Referral (If Applicable)",
    value: "OutsideWebReferral",
    edit: true,
    editFieldName: "outsideWebReferral",
  },
  {
    label: "*160: Attended RESEA",
    value: "AttendedRESEA",
  },
  {
    label: "*205: Develop IEP",
    value: "DevelopIEP",
  },
  {
    label: "500+: JMS Job Referral",
    value: "JMSJobReferral",
    edit: true,
    editFieldName: "jMSJobReferral",
  },
  {
    label: "*209: Refer to WIOA state & local training",
    value: "ReferWIOATraining",
  },
  {
    label: "*Refer to VR or DHHS",
    value: "ReferToVRorDHHS",
  },
  {
    label: "Send IEP for Signature and give copy",
    value: "IEPSignatureCopy",
  },
  {
    label: "*Add Self as Case Manager",
    value: "AddSelfCaseManager",
  },
  {
    label: "*JMS Case Notes",
    value: "JMSCaseNotes",
  },
  {
    label: "*Close Goals",
    value: "CloseGoals",
  },
  {
    label: "*Close IEP if not being case managed by a Partner",
    value: "JmsCloseIEP",
  },
];

export const OTHER_ACTIONS_INITIAL = [
  {
    label: "*Reviewed chapters 1 to 4 of My Reemployment Plan",
    value: "ReviewedReEmpPlan",
  },
  {
    label: "*Assigned My Reemployment Plan",
    value: "AssignedReEmpPlan",
    radio: true,
    radioFieldName: "assignedMrpChap",
  },
  {
    label: "*Physically verified claimant's ID",
    value: "PhysicallyVerifiedID",
  },
  {
    label: "*Reminded Claimant to Self-schedule by:",
    value: "RemindedSelfSchedule",
    date: true,
    dateFieldName: "selfSchByDt",
  },
];

export const OTHER_ACTIONS_FIRST = [
  {
    label: "*Assigned chapters 5 to 10 of My Reemployment Plan",
    value: "AssignedReEmpPlan",
  },
  {
    label: "*Reviewed My Reemployment Plan",
    value: "ReviewedReEmpPlan",
    radio: true,
    radioFieldName: "reviewedMrpChap",
  },
  {
    label: "*Checked Prior Job Referrals",
    value: "CheckedPriorJobReferrals",
  },
  {
    label: "*Reminded Claimant to Self-schedule by:",
    value: "RemindedSelfSchedule",
    date: true,
    dateFieldName: "selfSchByDt",
  },
  {
    label: "*Physically verified claimant's ID",
    value: "PhysicallyVerifiedID",
  },
];

export const OTHER_ACTIONS_SECOND = [
  {
    label: "*Reviewed chapters 5 to 10 of My Reemployment Plan",
    value: "ReviewedReEmpPlan",
  },
  {
    label: "*Copy of EP and Checklist uploaded into JMS",
    value: "EPandCheckListUpld",
  },
  {
    label: "*Checked Prior Job Referrals",
    value: "CheckedPriorJobReferrals",
  },
  {
    label: "*Physically verified claimant's ID",
    value: "PhysicallyVerifiedID",
  },
];

export const INITIAL_APPOINTMENT_DETAILS_INITIAL_VALUES = {
  jmsItems: {
    InitialAssessment: false,
    Eri1On1: false,
    ELMIServices: false,
    JobDevelopment: false,
    CaseManagement: false,
    AttendedRESEA: false,
    OutsideWebReferral: false,
    DevelopIEP: false,
    ReferWIOATraining: false,
    JMSJobReferral: false,
    AddSelfCaseManager: false,
    JMSCaseNotes: false,
    JMSRegComplete: false,
    JMSRegIncomplete: false,
    ActiveResume: false,
    ActiveVirtualRecuiter: false,
    WagnerPeyserApplComplete: false,
    WagnerPeyserApplSignature: false,
    IEPSignatureCopy: false,
  },
  jmsResumeExpDt: null,
  jmsVRExpDt: null,
  outsideWebReferral: [],
  jMSJobReferral: [],
  workSearchIssues: [],
  otherIssues: [
    {
      selected: false,
      issueType: "",
      subIssueType: "",
      startDt: null,
      endDt: null,
    },
  ],
  actionTaken: {
    ReviewedReEmpPlan: false,
    AssignedReEmpPlan: false,
    PhysicallyVerifiedID: false,
    RemindedSelfSchedule: false,
  },
  assignedMrpChap: "",
  selfSchByDt: null,
  staffNotes: "",
  empServicesConfirmInd: "N",
};
export const FIRST_APPOINTMENT_DETAILS_INITIAL_VALUES = {
  jmsItems: {
    Eri1On1: false,
    JobDevelopment: false,
    CaseManagement: false,
    AttendedRESEA: false,
    OutsideWebReferral: false,
    DevelopIEP: false,
    ReferWIOATraining: false,
    JMSJobReferral: false,
    ReferToVRorDHHS: false,
    IEPSignatureCopy: false,
    AddSelfCaseManager: false,
    JMSCaseNotes: false,
  },
  outsideWebReferral: [],
  jMSJobReferral: [],
  workSearchIssues: [],
  otherIssues: [
    {
      selected: false,
      issueType: "",
      subIssueType: "",
      startDt: null,
      endDt: null,
    },
  ],
  actionTaken: {
    ReviewedReEmpPlan: false,
    AssignedReEmpPlan: false,
    CheckedPriorJobReferrals: false,
    PhysicallyVerifiedID: false,
    RemindedSelfSchedule: false,
  },
  reviewedMrpChap: "",
  selfSchByDt: null,
  staffNotes: "",
  empServicesConfirmInd: false,
};
export const SECOND_APPOINTMENT_DETAILS_INITIAL_VALUES = {
  jmsItems: {
    Eri1On1: false,
    JobDevelopment: false,
    CaseManagement: false,
    AttendedRESEA: false,
    OutsideWebReferral: false,
    DevelopIEP: false,
    ReferWIOATraining: false,
    JMSJobReferral: false,
    ReferToVRorDHHS: false,
    IEPSignatureCopy: false,
    AddSelfCaseManager: false,
    JMSCaseNotes: false,
    CloseGoals: false,
    JmsCloseIEP: false,
  },
  outsideWebReferral: [],
  jMSJobReferral: [],
  workSearchIssues: [],
  otherIssues: [
    {
      selected: false,
      issueType: "",
      subIssueType: "",
      startDt: null,
      endDt: null,
    },
  ],
  actionTaken: {
    ReviewedReEmpPlan: false,
    EPandCheckListUpld: false,
    CheckedPriorJobReferrals: false,
    PhysicallyVerifiedID: false,
  },
  staffNotes: "",
  empServicesConfirmInd: false,
};
