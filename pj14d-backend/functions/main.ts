const AWS = require("aws-sdk");
import Report from "./Report";
import ReportSent from "./ReportSent";
import addLabReport from "./addLabReport";
import addSentResult from "./addSentResult";
import getReport from "./getReport";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    report: Report;
    sent: ReportSent;
  };
};

function helper(body: ReportSent) {
  const eventBridge = new AWS.EventBridge();

  return eventBridge
    .putEvents({
      Entries: [
        {
          EventBusName: "default",
          Source: "petRule",
          DetailType: "Event trigger from bookmark",
          Detail: `{ "Pet Report": "Petname: ${body.petname},Report:${body.result}" }`,
        },
      ],
    })
    .promise();
}

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "addLabReport":
      return await addLabReport(event.arguments.report);
    case "addSentResult":
      const e = await helper(event.arguments.sent);
      return await addSentResult(event.arguments.sent);

    case "getReport":
      return await getReport();

    default:
      return null;
  }
};
