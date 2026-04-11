import indicatorApiRequest from "@/apiRequests/indecators"
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema"
import { useQuery } from "@tanstack/react-query"

export const useDashboardIndicator = (queryParams: DashboardIndicatorQueryParamsType) => {
  return useQuery({
    queryKey: ['dashboard-indicators'],
    queryFn: () => indicatorApiRequest.getDashboardIndicators(queryParams)
  })
}