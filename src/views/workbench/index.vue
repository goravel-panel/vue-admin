<template>
  <div class="workbench">
    <div class="md:flex">
      <el-card
        class="!border-none mb-4 md:mr-4 w-80"
        shadow="never"
      >
        <template #header>
          <span class="card-title">版本信息</span>
        </template>
        <div>
          <div class="flex leading-9">
            <div class="w-20 flex-none">
              golang
            </div>
            <span> v1.23.0</span>
          </div>
          <div class="flex leading-9">
            <div class="w-20 flex-none">
              framework
            </div>
            <span> {{ workbenchData?.version?.framework }}</span>
          </div>
          <div class="flex leading-9">
            <div class="w-20 flex-none">
              vue-admin
            </div>
            <span> {{ workbenchData?.version?.admin }}</span>
          </div>
        </div>
      </el-card>
      <el-card
        class="!border-none mb-4 flex-1"
        shadow="never"
      >
        <template #header>
          <div>
            <span class="card-title">今日数据</span>
            <span class="text-tx-secondary text-xs ml-2">
              更新时间：{{ workbenchData?.today?.time }}
            </span>
          </div>
        </template>

        <div class="flex flex-wrap">
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">
              运行中的插件
            </div>
            <div class="text-6xl">
              5
            </div>
            <div class="text-tx-secondary text-xs">
              总插件数：30
            </div>
          </div>
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">
              访客数(UV)
            </div>
            <div class="text-6xl">
              518
            </div>
            <div class="text-tx-secondary text-xs">
              总访客数：2126
            </div>
          </div>
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">
              浏览量(PV)
            </div>
            <div class="text-6xl">
              5351
            </div>
            <div class="text-tx-secondary text-xs">
              总浏览量：29371
            </div>
          </div>
          <div class="w-1/2 md:w-1/4">
            <div class="leading-10">
              新增用户
            </div>
            <div class="text-6xl">
              10
            </div>
            <div class="text-tx-secondary text-xs">
              总访用户：100
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="function mb-4">
      <el-card
        class="flex-1 !border-none"
        shadow="never"
      >
        <template #header>
          <div class="items-center">
            <span class="card-title">快捷功能</span>
            <a
              class="text-tx-secondary text-xs ml-2"
              href="#"
            >
              <icon
                :size="16"
                name="el-icon-Setting"
              />
            </a>
          </div>
        </template>
        <div class="flex flex-wrap">
          <div
            v-for="item in workbenchData.menu"
            :key="item"
            class="md:w-[12.5%] w-1/4 flex flex-col items-center"
          >
            <router-link
              :to="item.url"
              class="mb-3 flex flex-col items-center"
            >
              <img
                :alt="item.name"
                :src="item.image"
                height="40"
                width="40"
              >
              <div class="mt-2">
                {{ item.name }}
              </div>
            </router-link>
          </div>
        </div>
      </el-card>
    </div>

    <el-row :gutter="20">
      <el-col
        :md="12"
        :sm="12"
        :xs="24"
      >
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>CPU</span>
            </div>
          </template>
          <div class="el-table--enable-row-hover el-table--medium">
            <el-row :gutter="30">
              <el-col
                :md="12"
                :sm="24"
                :xs="24"
              >
                <div class="flex leading-9">
                  <div class="w-20 flex-none">
                    内核
                  </div>
                  <span>{{ workbenchData?.cpu?.cores }} 核</span>
                </div>
                <div class="flex leading-9">
                  <div class="w-20 flex-none">
                    型号
                  </div>
                  <span>{{ workbenchData?.cpu?.model }}</span>
                </div>
                <div class="flex leading-9">
                  <div class="w-20 flex-none">
                    主频
                  </div>
                  <span>{{ workbenchData?.cpu?.mhz }} MHz</span>
                </div>
              </el-col>
              <el-col
                :md="12"
                :sm="24"
                :xs="24"
                style="margin-top: -30px"
              >
                <div
                  ref="chartsWarningRef1"
                  style="min-height: 280px"
                />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col
        :md="12"
        :sm="12"
        :xs="24"
      >
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>内存</span>
            </div>
          </template>
          <div class="el-table--enable-row-hover el-table--medium">
            <el-row :gutter="30">
              <el-col
                :md="12"
                :sm="24"
                :xs="24"
              >
                <div class="flex leading-9">
                  <div class="w-20 flex-none">
                    总内存
                  </div>
                  <span>{{ workbenchData?.memory?.total }}</span>
                </div>
                <div class="flex leading-9">
                  <div class="w-20 flex-none">
                    已用内存
                  </div>
                  <span>{{ workbenchData?.memory?.used }}</span>
                </div>
                <div class="flex leading-9">
                  <div class="w-20 flex-none">
                    剩余内存
                  </div>
                  <span>{{ workbenchData?.memory?.free }}</span>
                </div>
              </el-col>
              <el-col
                :md="12"
                :sm="24"
                :xs="24"
                style="margin-top: -30px"
              >
                <div
                  ref="chartsWarningRef2"
                  style="min-height: 280px"
                />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div style="margin-bottom: -30px">
      <layout-footer />
    </div>
  </div>
</template>

<script lang="ts" setup>

// 引入仪表盘图表
import { GaugeChart } from 'echarts/charts' // 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件
import {
    DatasetComponent,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    TransformComponent
} from 'echarts/components' // 引入 echarts 核心模块
import * as echarts from 'echarts/core' // 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features' // 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

import { appService } from '@/api/app'
import LayoutFooter from '@/layout/components/footer.vue'

import menu_admin from './image/menu_admin.png'
import menu_auth from './image/menu_auth.png'
import menu_dict from './image/menu_dict.png'
import menu_file from './image/menu_file.png'
import menu_role from './image/menu_role.png'
import menu_web from './image/menu_web.png'

echarts.use([
    GaugeChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
])

const { proxy } = getCurrentInstance() as any

// 表单数据
const workbenchData: any = reactive({
    version: {
        version: '',
        osName: '',
        osArch: ''
    },
    today: {
        time: ''
    }, // 今日数据
    menu: [
        {
            name: '管理员',
            image: menu_admin,
            url: '/permission/admin'
        },
        {
            name: '插件市场',
            image: menu_web,
            url: '/permission/role'
        },
        {
            name: '账号管理',
            image: menu_dict,
            url: '/dev_tools/dict'
        },
        {
            name: '角色管理',
            image: menu_role,
            url: '/dev_tools/code'
        },
        {
            name: '菜单管理',
            image: menu_auth,
            url: '/permission/menu'
        },
        {
            name: '附件管理',
            image: menu_file,
            url: '/material/index'
        },
        {
            name: '系统设置',
            image: menu_web,
            url: '/setting/website/information'
        }
    ],
    memory: {
        total: '',
        used: '',
        free: '',
        usedPercent: 0.0
    },
    cpu: {
        cores: 0,
        model: '',
        mhz: 0
    }
})

function setOptChart1(value: number) {
    myChart1.setOption({
        series: [
            {
                data: [
                    {
                        value: value,
                        name: '使用率'
                    }
                ]
            }
        ]
    })
}

function setOptChart2(value: number) {
    myChart2.setOption({
        series: [
            {
                data: [
                    {
                        value: value,
                        name: '使用率'
                    }
                ]
            }
        ]
    })
}

// CPU
let myChart1: any
const initChartCPU = () => {
    myChart1 = echarts.init(proxy.$refs.chartsWarningRef1)
    const option = {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
            {
                type: 'gauge',
                name: 'CPU',
                radius: '80%', //修改表盘大小
                title: {
                    show: true,
                    fontSize: 14,
                    // 'color': 'red',
                    offsetCenter: [0, '40%']
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        // 属性lineStyle控制线条样式
                        color: [
                            [0.3, '#4dabf7'],
                            [0.6, '#69db7c'],
                            [0.8, '#ffa94d'],
                            [1, '#ff6b6b']
                        ]
                    }
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value}%',
                    fontSize: 36,
                    color: 'red',
                    offsetCenter: ['0', '80%'] //表盘数据(30%)位置
                },
                data: [
                    {
                        value: 15.12,
                        name: '使用率'
                    }
                ]
            }
        ]
    }
    myChart1.setOption(option)
}

//内存
let myChart2: any
const initChartRAM = () => {
    myChart2 = echarts.init(proxy.$refs.chartsWarningRef2)
    const option = {
        tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
            {
                type: 'gauge',
                name: '内存',
                radius: '80%',
                title: {
                    show: true,
                    fontSize: 14,
                    // 'color': 'red',
                    offsetCenter: [0, '40%']
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [
                            [0.3, '#4dabf7'],
                            [0.6, '#69db7c'],
                            [0.8, '#ffa94d'],
                            [1, '#ff6b6b']
                        ]
                    }
                },
                detail: {
                    valueAnimation: true,
                    formatter: '{value}%',
                    fontSize: 36,
                    color: 'red',
                    offsetCenter: ['0', '80%'] //表盘数据(30%)位置
                },
                data: [
                    {
                        value: 30,
                        name: '内存使用率'
                    }
                ]
            }
        ]
    }
    myChart2.setOption(option)
}

// 获取工作台主页数据
const getData = async () => {
    const { data } = await appService.getWorkbench()
    workbenchData.version = data?.version
    workbenchData.today = data?.today
    workbenchData.memory = data?.memory
    workbenchData.cpu = data?.cpu
    setOptChart1(workbenchData.cpu.usedPercent)
    setOptChart2(workbenchData.memory.usedPercent)
}

// 页面加载时
let interval: any = null
onMounted(() => {
    getData()
    if (interval === null) {
        interval = setInterval(() => {
            getData()
        }, 5000)
    }
    initChartCPU()
    initChartRAM()
})
onUnmounted(() => {
    if (interval !== null) {
        clearInterval(interval)
        interval = null
    }
})
</script>

<style lang="scss" scoped></style>
