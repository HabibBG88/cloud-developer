import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const UpdateTodoRequest: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const userId=  getUserId(event)
     
//   const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
//     const userId=  getUserId(event)
//     await updateTodo(todoId,updatedTodo,userId)

//     return {
//       statusCode: 201,
      
//       body: JSON.stringify({})
//   }}
// )
//const newItem = 
await updateTodo (UpdateTodoRequest, userId,todoId)
//await updateTodo (UpdateTodoRequest,todoId)
return {
  statusCode: 204,
  
  body: JSON.stringify({})

 // newItem
}
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
