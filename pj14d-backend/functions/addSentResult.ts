const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
import ReportSent from "./ReportSent";

async function addSentResult(sent: ReportSent) {
  const params = {
    TableName: process.env.SENT_REPORT_TABLE,
    Item: sent,
  };
  try {
    await docClient.put(params).promise();
    return sent;
  } catch (err) {
    console.log("DynamoDB error: ", err);
    return null;
  }
}

export default addSentResult;
