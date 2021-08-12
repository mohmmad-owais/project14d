/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type LabInput = {
  id: string,
  petname: string,
  result: string,
};

export type Report = {
  __typename: "Report",
  id: string,
  petname: string,
  result: string,
};

export type SentInput = {
  id: string,
  petname: string,
  status: string,
  result: string,
};

export type ReportSent = {
  __typename: "ReportSent",
  id: string,
  petname: string,
  status: string,
  result: string,
};

export type AddLabReportMutationVariables = {
  report: LabInput,
};

export type AddLabReportMutation = {
  addLabReport?:  {
    __typename: "Report",
    id: string,
    petname: string,
    result: string,
  } | null,
};

export type AddSentResultMutationVariables = {
  sent: SentInput,
};

export type AddSentResultMutation = {
  addSentResult?:  {
    __typename: "ReportSent",
    id: string,
    petname: string,
    status: string,
    result: string,
  } | null,
};

export type GetReportQuery = {
  getReport?:  Array< {
    __typename: "Report",
    id: string,
    petname: string,
    result: string,
  } | null > | null,
};
