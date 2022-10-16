import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    //const authorization = event.headers.Authorization
    //const split = authorization.split(' ')
    //const jwtToken = split[1]
  //  const userId=  getUserId(event)
    console.log(event)
  //  const userId=1
    const item = await createTodo(newTodo, event)
    delete item['userId']
  //  console.log("------------------------console.log(newItem)") to check body
  //  console.log(newItem)
    return {
      statusCode: 201,
      
      body: JSON.stringify({
        item
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
