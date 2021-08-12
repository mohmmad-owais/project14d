const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
import Report from "./Report";

async function addLabReport(report: Report) {
  const params = {
    TableName: process.env.LAB_REPORT_TABLE,
    Item: report,
  };
  try {
    await docClient.put(params).promise();
    return report;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}

export default addLabReport;
