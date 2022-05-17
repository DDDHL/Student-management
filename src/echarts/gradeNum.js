import * as echarts from 'echarts/core'
import { ToolboxComponent, TooltipComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
])
var myChart
var option
export function gradeNum(data1) {
  option = {
    toolbox: {
      show: true,
    },
    title: {
      text: '各年级人数分布',
      left: 'center',
    },
    tooltip: {
      show: true,
      trigger: 'item',
    },
    series: [
      {
        name: '年级人数',
        type: 'pie',
        radius: [15, 80],
        center: ['50%', '60%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        label: {
          normal: {
            show: false,
          },
        },
        data: data1,
      },
    ],
  }
  myChart = echarts.init(document.getElementById('gradeNum'))
  option && myChart.setOption(option)
}
export function resizeGrade() {
  //动态修改图大小
  myChart.resize()
}
