import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
//  const todos = '...'
    const userId = getUserId(event)
    console.log(event)
    //const userId =1
    const items = await getTodosForUser(userId)
    items.forEach(item => delete item['userId'])
 
  //  return undefined
    
   // const items = todos.Items
  
    return {
      statusCode: 201,
      
      body: JSON.stringify({
        items
      })
    }
  })
  
handler.use(
  cors({
    credentials: true
  })
)
