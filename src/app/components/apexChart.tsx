import ApexCharts from 'apexcharts'
import { useEffect } from 'react'

import './index.less'

const options = {
  chart: {
    id: 'area-datetime',
    type: 'area',
    height: 350,
    zoom: false,
    toolbar: {
      show: false,
    },
  },
  series: [
    {
      data: [],
    },
  ],
  // annotations: {
  //   yaxis: [
  //     {
  //       y: 30,
  //       borderColor: '#999',
  //       label: {
  //         show: true,
  //         text: 'Support',
  //         style: {
  //           color: '#fff',
  //           background: '#00E396',
  //         },
  //       },
  //     },
  //   ],
  //   xaxis: [
  //     {
  //       x: new Date('14 Nov 2012').getTime(),
  //       borderColor: '#999',
  //       yAxisIndex: 0,
  //       label: {
  //         show: true,
  //         text: 'Rally',
  //         style: {
  //           color: '#fff',
  //           background: '#775DD0',
  //         },
  //       },
  //     },
  //   ],
  // },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 0,
    style: 'hollow',
  },
  xaxis: {
    type: 'datetime',
    // min: new Date('01 Mar 2012').getTime(),
    tickAmount: 10,
    lines: {
      show: false,
    },
  },
  yaxis: {
    lines: {
      show: false,
    },
  },
  tooltip: {
    onDatasetHover: {
      highlightDataSeries: false,
    },
    x: {
      format: 'dd MMM yyyy',
      formatter: (value?: any) => {
        return `<div class="chart-tooltip-x">
          <span style={{color: '#f41326'}}>${new Date(
            value,
          ).toDateString()}</span>
        </div>`
      },
    },
    custom: ({
      series,
      seriesIndex,
      dataPointIndex,
      w,
    }: {
      series?: any
      seriesIndex?: any
      dataPointIndex?: any
      w?: any
    }) => {
      return `<div class="chart-tooltip">
        <span style={{color: '#f41326'}}>${series[seriesIndex][dataPointIndex]}</span>
      </div>`
    },
  },
  colors: ['#40A9FF'],
  fill: {
    type: 'gradient',
    gradient: {
      //gradientToColors: '#40A9FF', // optional, if not defined - uses the shades of same color in series
      opacityFrom: 1,
      opacityTo: 0,
      stops: [0, 100],
    },
  },
  grid: {
    show: false,
  },
  legend: {
    show: false,
  },
  stroke: {
    width: 1,
  },
  toolbar: {
    tooltip: {},
  },
}
const ApexChart = () => {
  useEffect(() => {
    const chartId = document.querySelector('#chart_id')
    const chartInstance = new ApexCharts(chartId, options)
    chartInstance.render()
  }, [])
  return <div id="chart_id" />
}
export default ApexChart
