import http from '@/app/lib/http'

const revalidateApiRequest = (tag: string) =>
  http.get(`/api/revalidate?tag=${tag}`, {
    baseUrl: ''
  })
export default revalidateApiRequest
