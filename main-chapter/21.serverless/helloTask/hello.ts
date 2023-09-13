export const handler = async (event: any) => {
  const queryStringParameters = event.queryStringParameters || {}
  const name = queryStringParameters.name || 'World'
  const response = {
    statusCode: 200,
    body: `Hello, ${name}!`,
  }
  return response
}