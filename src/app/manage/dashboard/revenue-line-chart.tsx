import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { format, parse } from 'date-fns'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb'
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa'
  }
} satisfies ChartConfig

export default function RevenueLineChart() {
  const chartData = [
    { date: '01/01/2026', revenue: 186 },
    { date: '01/02/2026', revenue: 286 },
    { date: '01/03/2026', revenue: 486 },
    { date: '01/04/2026', revenue: 386 },
    { date: '01/05/2026', revenue: 586 },
    { date: '01/06/2026', revenue: 786 },
    { date: '01/07/2026', revenue: 986 }
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={chartData} margin={{ right: 12, left: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (chartData.length < 8) {
                  return value
                }
                // if (chartData.length < 33) {
                //   const date = parse(value, 'dd/MM/yyyy', new Date())
                //   return format(date, 'dd')
                // }
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dashed' />} />
            <Line dataKey={'revenue'} type="linear" stroke='var(--color-desktop)' strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'></CardFooter>
    </Card>
  )
}
