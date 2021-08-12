import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";
import * as subscriptions from "@aws-cdk/aws-sns-subscriptions";
import * as sns from "@aws-cdk/aws-sns";
import * as sqs from "@aws-cdk/aws-sqs";
import * as iam from "@aws-cdk/aws-iam";

export class Project14dStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, "Api", {
      name: "cdk-14d-pet-api",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      logConfig: { fieldLogLevel: appsync.FieldLogLevel.ALL },
      xrayEnabled: true,
    });

    const petTheoryLambda = new lambda.Function(this, "bookmarkLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset("functions"),
      memorySize: 1024,
    });
    // Grant the lambda permission to put custom events on eventbridge
    events.EventBus.grantAllPutEvents(petTheoryLambda);

    const lambdaDs = api.addLambdaDataSource(
      "lambdaDatasource",
      petTheoryLambda
    );

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getReport",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addLabReport",
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addSentResult",
    });

    const PetTheoryTabele = new ddb.Table(this, "PetTheoryTable", {
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
    PetTheoryTabele.grantFullAccess(petTheoryLambda);
    petTheoryLambda.addEnvironment(
      "LAB_REPORT_TABLE",
      PetTheoryTabele.tableName
    );

    const SentReport = new ddb.Table(this, "SentReportTbl", {
      partitionKey: {
        name: "id",
        type: ddb.AttributeType.STRING,
      },
    });
    SentReport.grantFullAccess(petTheoryLambda);
    petTheoryLambda.addEnvironment("SENT_REPORT_TABLE", SentReport.tableName);

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });

    // create an SNS topic
    const petTopic = new sns.Topic(this, "petTopic");

    // create a dead letter queue
    const dlQueue = new sqs.Queue(this, "DeadLetterQueue", {
      queueName: "Subscription_DLQ",
      retentionPeriod: cdk.Duration.days(14),
    });

    // subscribe email to the topic
    petTopic.addSubscription(
      new subscriptions.EmailSubscription("precisework01@gmail.com", {
        json: false,
        deadLetterQueue: dlQueue,
      })
    );

    /* lambda 2 */
    // creating role for giving sns:publish access to lambda
    const role = new iam.Role(this, "LambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["SNS:Publish", "logs:*", "ses:SendEmail"],
      resources: ["*"],
    });
    role.addToPolicy(policy);

    // creating lambda
    const snsHanlderLambda = new lambda.Function(this, "SNS_Hanlder", {
      code: lambda.Code.fromAsset("lambda"),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "snsHandler.handler",
      environment: {
        SNS_TOPIC_ARN: petTopic.topicArn,
        OUR_REGION: this.region,
      },
      timeout: cdk.Duration.seconds(10),
      role: role,
    });

    // Defining rule for event
    const rule = new events.Rule(this, "petLambdaRule", {
      targets: [new targets.SnsTopic(petTopic)],
      description: "Filter events that come pet Lambda",
      eventPattern: {
        source: ["petRule"],
      },
    });
  }
}
