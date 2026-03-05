import accountApiRequest from '@/apiRequests/account'
import { cookies } from 'next/headers'

const page = async () => {
  const cookieStore = cookies()
  const accessToken = (await cookieStore).get('accessToken')?.value
  let name = ''
  try {
    const result = await accountApiRequest.sMe(accessToken as string)
    name = result.payload.data.name
  } catch (error: any) {
    if(error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
  } 
  return (
    <div>dashboard: {name}</div>
  )
}

export default page