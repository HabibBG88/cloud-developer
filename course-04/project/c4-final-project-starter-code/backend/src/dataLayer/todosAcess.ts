import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay= require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

//const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

 
// logger 
// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
//logger.info('User was authorized', {
    // Additional information stored with a log statement
  //  key: 'value'
    //}) 

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly TodoTable = process.env.TODOS_TABLE,
    private readonly index = process.env.TODOS_CREATED_AT_INDEX,
    private readonly bucketname = process.env.ATTACHMENT_S3_BUCKET) { // check env variable in yaml file for table
  }


  async getTodosForUser(userId: string): Promise<TodoItem[]> {
    //console.log('Getting all groups')
  
    const result = await this.docClient.query({
     // TableName: this.groupsTable
      TableName: this.TodoTable,
   // IndexName: 'index-name',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
    ':userId': userId
    }}).promise()
  
    const items = result.Items
    return items as TodoItem[]
  }
  
  async updateTodoItem(itemId): Promise<void> //<TodoUpdate[]> {
    {
    //console.log('Getting all groups')
  
   // const result = 
    await this.docClient.update({
     // TableName: this.groupsTable
      TableName: this.TodoTable,
      Key: {
        userId: itemId.userId,
        todoId: itemId.todoId

//find the itemId in the table that you pull from the event 
    },
    UpdateExpression: "set #name=:name,done = :done, dueDate=:dueDate",
    ExpressionAttributeValues: {
      ":done": itemId.done,
      ":name" :itemId.name,
      ":dueDate":itemId.dueDate
//create an Expression Attribute Value to pass in the expression above
  },
  ExpressionAttributeNames: {
    "#name": "name"
  },
    // This expression is what updates the item attribute 
   // IndexName: 'index-name',
 //   KeyConditionExpression: 'userId = :userId',
  //  ExpressionAttributeValues: {
  //  ':userId': userId
   // }
   ReturnValues: "UPDATED_NEW",
  }).promise()
  
   // const items = result.Items
 //   return result.Items //items as TodoUpdate[]
  }
  


// still to implement function for GenerateUploadUrl

  async getToById(todoId: string): Promise<TodoItem> {
    //console.log('Getting all groups')
  
    const result = await this.docClient.query({
     // TableName: this.groupsTable
      TableName: this.TodoTable,
      IndexName: this.index,
    KeyConditionExpression: 'todoId = :todoId',
    ExpressionAttributeValues: {
    ':todoId': todoId
    }}).promise()
  
    const items = result.Items
    if (items.length !==0)
    return result.Items[0] as TodoItem

    return null
  }

  async getbucketById(todo: TodoItem): Promise<TodoItem> {
    //console.log('Getting all groups')
  
    const bucket_name =  this.bucketname
    todo.attachmentUrl=`https://${bucket_name}.s3.amazonaws.com/${todo.todoId}`
    //`https://${bucketName}.s3.amazonaws.com/${imageId}`
    return todo
  }


  async updateTodoattachement(userId:string,todoId:string): Promise<void> {//: TodoItem
    //console.log('Getting all groups')
    const bucket_name =  this.bucketname
   // const result = 
    await this.docClient.update({
     // TableName: this.groupsTable
      TableName: this.TodoTable,
      Key: {
        userId: userId,
        todoId: todoId
    },
    UpdateExpression: "set attachmentUrl = :attachmentUrl",
    ExpressionAttributeValues: {
      ":attachmentUrl": `https://${bucket_name}.s3.amazonaws.com/${todoId}`//todo.attachmentUrl,
      
//create an Expression Attribute Value to pass in the expression above
  },
    }).promise()
  
   // return result.Attributes as TodoItem
  }


  async deleteTodoItem(itemId): Promise<void> {
    await this.docClient.delete({
      TableName: this.TodoTable,
      Key: {
        userId: itemId.userId,
        todoId: itemId.todoId

      }
    }).promise()
  }

  
// async function groupExists(userId: string) {
//   const result = await docClient
//     .get({
//       TableName: TodoTable,
//       Key: {
//         id: userId
//       }
//     })
//     .promise()

//   console.log('Get group: ', result)
//   return !!result.Item
// }

// async function getAllUser(userId: string) {
//   const result = await docClient.query({
//     TableName: TodoTable,
//     KeyConditionExpression: 'userId = :userId',
//     ExpressionAttributeValues: {
//       ':userId': userId
//     },
//     ScanIndexForward: false
//   }).promise()

//   return result.Items
// }



  async createToDo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.TodoTable,
      Item: todo
    }).promise()

    return todo
  }
}




function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
