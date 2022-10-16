import { TodosAccess } from '../dataLayer/todosAcess'
//import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic
//import { parseUserId } from '../auth/utils'
import { getUserId } from '../lambda/utils';
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getUploadUrl } from '../helpers/attachmentUtils'

//const groupAccess = new TodosAccess()  // from data layer 

//export async function getTodosForUser(): Promise<TodoItem[]> {
 //   return groupAccess.getTodosForUser()
 // }
 const todosAccess = new TodosAccess()

 export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  return todosAccess.getTodosForUser(userId)
}

export async function createAttachmentPresignedUrl(userId: string,todoId: string): Promise<string> {

//const todoitem=  await todosAccess.getToById(todoId) 
//const newtodoitem=await  todosAccess.getbucketById(todoitem)
 //await  todosAccess.updateTodoattachement(newtodoitem)
const url= await getUploadUrl(todoId)
await  todosAccess.updateTodoattachement(userId,todoId)
return url
}

// const validGroupId = await groupExists(groupId)

//   if (!validGroupId) {
//     return {
//       statusCode: 404,
//       headers: {
//         'Access-Control-Allow-Origin': '*'
//       },
//       body: JSON.stringify({
//         error: 'Group does not exist'
//       })
//     }
//   }

//   const images = await getImagesPerGroup(groupId)

//   return {
//     statusCode: 201,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       items: images
//     })
//   }
// }

export async function updateTodo( UpdateTodoRequest: UpdateTodoRequest,userId:string,todoId:string): Promise<void> //jwtToken: string ,event:APIGatewayProxyEvent
{

  const item = {
      
   //   todoId:uuid.v4(),
  //  const userId = parseUserId(jwtToken),
   //   createdAt: new Date().toISOString(),
      userId,// getUserId(event) ,
    //done: true,
      todoId,
    //  attachmentUrl: "",
      ...UpdateTodoRequest
  }
  await todosAccess.updateTodoItem(item)
}

// export async function createAttachmentPresignedUrl( event,todoId:string): Promise<string> //jwtToken: string
// {

//   const userId = getUserId(event)
//   const uploadUrl = await todoAccess.getSignedUrl(todoId) // to implement 
//   await todoAccess.updateAttachmentUrl(userId, todoId)
//    //   todoId:uuid.v4(),
//   //  const userId = parseUserId(jwtToken),
//    //   createdAt: new Date().toISOString(),
//     //  userId: getUserId(event) ,
//     //done: true,
//    //   todoId,
//     //  attachmentUrl: "",
//   }
//   return await todosAccess.updateTodoItem(uploadUrl)
// }



export async function deleteTodo(event:APIGatewayProxyEvent,todoId:string): Promise<void> //jwtToken: string
{

  const item = {
      
   //   todoId:uuid.v4(),
  //  const userId = parseUserId(jwtToken),
   //   createdAt: new Date().toISOString(),
      userId: getUserId(event) ,
    //done: true,
      todoId,
    //  attachmentUrl: "",
      
  }
return await todosAccess.deleteTodoItem(item)
}





  export async function createTodo( TodoRequest: CreateTodoRequest,event:APIGatewayProxyEvent): Promise<TodoItem> //jwtToken: string
  {
    const todoId=uuid.v4()
    const item = {
        
        todoId:todoId,
    //  const userId = parseUserId(jwtToken),
        createdAt: new Date().toISOString(),
        userId: getUserId(event) ,
        done: false,
        attachmentUrl: "",
        ...TodoRequest
    }
    return await todosAccess.createToDo(item)
}
 

     // name: CreateTodoRequest.name,
    //  description: createGroupRequest.description,
     // createdAt: new Date().toISOString(),
    // done: false,
  //    dueDate
      
  //    ...TodosAccess
  //  })
//  }
  // return await TodosAccess.createGroup({