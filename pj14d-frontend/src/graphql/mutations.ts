/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addLabReport = /* GraphQL */ `
  mutation AddLabReport($report: LabInput!) {
    addLabReport(report: $report) {
      id
      petname
      result
    }
  }
`;
export const addSentResult = /* GraphQL */ `
  mutation AddSentResult($sent: SentInput!) {
    addSentResult(sent: $sent) {
      id
      petname
      status
      result
    }
  }
`;
