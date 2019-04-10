<style scoped  lang="less">
    .page-title{
        color:#343436;
        font-size:18px;
        margin-bottom:15px;
        display:flex;
        flex-flow:row;
        .back{
            margin-left: auto;
            display:flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            div{
                width: 26px;
                height: 26px;
                background: url('./../assets/back.png') no-repeat left top;
                margin-right:8px; 
            }
        }
    }
    .content{
        span{
            margin-left: 8px;
        }
        .table-wrap{
            margin-top: 32px;
            .page-bar{
                margin-top: 32px;
                text-align: center;
            }
        }
        &.detail-content{
            .detailTitle{
                height: 40px;
                width: 100%;
                background: #2d8cf0;
                color:#FEFEFE;
                line-height: 40px;
                text-indent: 24px;
                font-size: 20px;
                border-radius: 8px 8px 0 0;
            }
            .detail-item{
                color: #343436;
                font-size: 16px;
                margin-bottom: 12px;
                &:nth-of-type(3){
                    margin: 12px 0;
                }
                span{
                    height: 16px;
                    width: 16px;
                    border-radius:50%; 
                    display: inline-block;
                    &.online{
                        background: #a9d86e;
                    }
                    &.error{
                        background: #e65555;
                    }
                    &.offline{
                        background: #d9d9d9;
                    }
                }           
            }
            .tableTitle{
                color: #343436;
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 10px;
            }
           
            .abnormal-alarm,.device-log{
                width: 100%;
                .title{
                    height: 40px;
                    width: 100%;
                    background: #2d8cf0;
                    color:#FEFEFE;
                    line-height: 40px;
                    text-indent: 24px;
                    font-size: 20px;
                    border-radius: 8px 8px 0 0;
                }
                .body{
                    // text-align: center;
                    border: 1px solid #d9d9d9;
                    border-radius:0 0 8px 8px;
                    div{
                        height: 32px;
                        line-height: 32px;
                        padding-left: 32px;
                        color: #343436;
                        font-size: 16px;
                        &.more{
                            padding-left: 0px;
                            text-align: center;
                            margin: 8px 0;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
    .toolTip{
        position: relative;
        @media screen and (min-width:1408px){
            .add {
                position: absolute;
                right: 0;
            }
        }
         @media screen and (max-width:1408px){
            .add {
                position: relative;
                display: block;
            }
        }
    }
</style>
<template>
    <layOut v-cloak>
        <div slot="page-title" class="page-title">
            <Breadcrumb v-if="pageName === 'printerList'" :style="{color:'#343436',fontSize:'18px'}">
                <BreadcrumbItem>打印机列表</BreadcrumbItem>
            </Breadcrumb>
            <Breadcrumb v-else-if="pageName === 'printerDetail'" :style="{color:'#343436',fontSize:'18px'}">
                <BreadcrumbItem>打印机列表</BreadcrumbItem>
                <BreadcrumbItem>打印机详情</BreadcrumbItem>
            </Breadcrumb>
            <Breadcrumb v-else-if="pageName === 'logDetail'" :style="{color:'#343436',fontSize:'18px'}">
                <BreadcrumbItem>打印机列表</BreadcrumbItem>
                <BreadcrumbItem>打印机详情</BreadcrumbItem>
                <BreadcrumbItem>日志详情</BreadcrumbItem>
            </Breadcrumb>
            <!-- <Button type="primary" @click="pageName='printerList'" :style="{float:'right'}" v-if="pageName === 'printerDetail'">返回</Button>
            <Button type="primary" @click="pageName='printerDetail'" :style="{float:'right'}" v-else-if="pageName === 'logDetail'" >返回</Button> -->
            <div class='back' @click="pageName='printerList'" v-if="pageName === 'printerDetail'">
                <div></div>
                <span>返回</span>
            </div>
            <div class='back'  @click="pageName='printerDetail'" v-else-if="pageName === 'logDetail'">
                <div></div>
                <span>返回</span>
            </div>
            <!-- console.log(this.$route.params.id) -->
        </div>
        <div slot="content" class="content" :style="{padding: '32px'}"  v-if="pageName === 'printerList'">
            <div class="toolTip">
                <span>
                    出厂编号：
                </span>
                 <Select v-model="printerList.serialNumber" filterable clearable style="width:160px" >
                    <Option v-for="item in serialNumberList" :value="item.serialNumber" :key="item.serialNumber">{{ item.serialNumber }}</Option>
                </Select>
                <span>
                    单位名称：
                </span>
                 <Select v-model="printerList.unitsId" filterable clearable style="width:160px">
                    <Option v-for="item in unitsList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <span>
                    单位地址：
                </span>
                <Select v-model="printerList.provinceId" style="width:80px" clearable placeholder="省" label-in-value @on-change="getCityList('tooltips',$event)">
                    <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select v-model="printerList.cityId" style="width:80px" clearable placeholder="市" label-in-value @on-change="getDistrictList('tooltips',$event)">
                    <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select v-model="printerList.districtId" clearable placeholder="区" label-in-value style="width:80px">
                    <Option v-for="item in districtList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input v-model="printerList.installAddress" placeholder="请输入详细地址" style="width: 160px"></Input>

                <Button type="primary"  style="margin-left:10px"  @click="searchingPrinterList">确定</Button>
                <Button type="primary" class="add" @click="showActionModal">新建</Button>
            </div>
            <div class='table-wrap'>
                <Table :columns="printerTableColumns" :data="printerTableData" border></Table>
                <Page class="page-bar" :total="printerListTotalPage" :current="printerListCurrentPage" show-elevator show-total @on-change="updateTable($event)"></Page>
            </div>
            <Modal
                v-model="actionModal"
                :title="modalTitle"
                ref="actionModal"
                @on-ok="handleSubmit('formValidate')"
                @on-cancel="cancel"
                width="760">
                 <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" inline label-position='left'>
                     <Row type="flex" justify="space-around">
                        <Col span="12">
                             <FormItem label="单位" prop="unitsId">
                                <Select v-model="formValidate.unitsId" placeholder="请选择单位" style="width: 240px">
                                     <Option v-for="item in unitsList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="型号" prop="modelId">
                                <Select v-model="formValidate.modelId" placeholder="请选择型号" style="width: 240px">
                                    <Option v-for="item in modelsList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                             <FormItem label="区域" prop="provinceId">
                                <Select v-model="formValidate.provinceId" placeholder="省" @on-change="getCityList('',$event)" label-in-value style="width: 72px">
                                     <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem prop="cityId">
                                <Select v-model="formValidate.cityId" placeholder="市" @on-change="getDistrictList('',$event)" label-in-value style="width: 72px">
                                     <Option v-for="item in formValidate.cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem prop="districtId">
                                <Select v-model="formValidate.districtId" placeholder="区"  @on-change="getDistrictName"  label-in-value style="width: 72px">
                                     <Option v-for="item in formValidate.districtList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="出厂编号" prop="serialNumber">
                                <Input type="text" v-model="formValidate.serialNumber" placeholder="请输入出厂编号" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                             <FormItem label="安装地址" prop="installAddress">
                                <Input type="text" v-model="formValidate.installAddress" placeholder="请输入安装地址" style="width: 240px" @on-blur="getPosition"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="设备名称" prop="name">
                                <Input type="text" v-model="formValidate.name" placeholder="请输入设备名称" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                    </Row><Row>
                        <Col span="12">
                             <FormItem label="经度" prop="longitude">
                                <Input type="text" v-model="formValidate.longitude" placeholder="请输入经度" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="安装日期">
                                <DatePicker type="datetime" v-model="formValidate.installDate" placeholder="请选择安装日期" style="width: 240px" @on-change="formatInstallDate"></DatePicker>
                            </FormItem>
                        </Col>
                    </Row><Row>
                        <Col span="12">
                             <FormItem label="纬度" prop="latitude">
                                <Input type="text" v-model="formValidate.latitude" placeholder="请输入纬度" style="width: 240px"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
        <div slot="content" class="content detail-content"  v-else-if="pageName === 'printerDetail'">
            <div class='detailTitle'>
                <!-- printerDetail -->
                <!-- <Button type="primary" @click="pageName='logDetail'" >去往日志详情</Button> -->
                打印机详情
            </div>
            <div :style="{padding: '32px'}">
                <Row class='detail-item'>
                    <Col span='8'>出厂编号:{{printerDetailData.serialNumber}}</Col>
                    <Col span='8'>单位名称:{{printerDetailData.unitsName}}</Col>
                    <Col span='8'>设备位置:{{printerDetailData.installAddress}}</Col>
                </Row>
                <Row class='detail-item'>
                    <Col span='8'>设备型号:{{printerDetailData.modelName}}</Col>
                    <Col span='8'>设备名称:{{printerDetailData.name}}</Col>
                    <Col span='8' :style="{display:'flex',alignItems:'center'}">是否在线:
                        <span 
                            :class="{
                                online:(printerDetailData.onlineStatus==='在线'?true:false),
                                offline:(printerDetailData.onlineStatus==='离线'?true:false),
                                error:(printerDetailData.onlineStatus==='异常'?true:false)
                                }">
                        </span>
                    </Col>
                </Row>
                <Row class='detail-item'>
                    <Col span='8'>打印任务:{{printerDetailData.printerTask}}</Col>
                    <Col span='8'>&nbsp;</Col>
                    <Col span='8'>&nbsp;</Col>
                </Row>
                <div class="tableTitle">机器状态</div>
                <Table :columns="machineStateColumns" :data="printfState"  :style="{marginBottom: '32px'}" class='printerDetailTable'></Table>
                <div class="tableTitle">打印状态</div>
                <Table :columns="printStatusColumns" :data="setData" :style="{marginBottom: '32px'}" class='table' class='printerDetailTable'></Table>
                <Row>
                    <Col span='11'>
                        <div class="abnormal-alarm">
                            <div class=title>
                                异常报警
                            </div>
                            <div class='body'>
                                <Row>56464644456456564</Row>
                                <Row>56464644456456564</Row>
                                <Row>56464644456456564</Row>
                                <Row>56464644456456564</Row>
                                <Row>56464644456456564</Row>
                                <Row class='more' @click.native="gotoDeviceAnomalyDetection">查看更多</Row>
                            </div>
                        </div>
                    </Col>
                    <Col span='2'>&nbsp;</Col>
                    <Col span='11'>
                        <div class="device-log">
                            <div class=title>
                                设备日志
                            </div>
                            <div class='body'>
                                <Row v-for="(item,index) in printersLogListOnDetail" :value="index" :key="index">{{item.time}}&nbsp;{{item.moduleName}}&nbsp;(文件:{{item.time}})</Row>
                                <Row class='more' @click.native="getMoreLog">查看更多</Row>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
        <div slot="content" class="content" :style="{padding: '32px'}" v-else-if="pageName === 'logDetail'">
            <div class="toolTip">
                <span>
                    开始时间：
                </span>
                <DatePicker type="datetime" v-model="logDetail.beginTime" placeholder="请选择开始时间" style="width: 160px"></DatePicker>
                <span>
                    结束时间：
                </span>
                <DatePicker type="datetime" v-model="logDetail.endTime" placeholder="请选择结束时间" style="width: 160px"></DatePicker>
                <Input placeholder="请输入打印任务内容" clearable style="width: 160px" v-model="logDetail.operateDesc"></Input>
                
                <Button type="primary" @click="getPrintersLogList(currentRowId,'list','searching')">确定</Button>
            </div>
            <div class='table-wrap'>
                <Table :columns="logTableColumns" :data="logTableData" border></Table>
                <Page class="page-bar" :total="logListTotalPage" :current="logListCurrentPage" show-elevator show-total @on-change="updateLogTable('searching',$event)"></Page>
            </div>
        </div>     
    </layOut>
</template>
<script>
    // import Utils from './../utils/index.js'
    // import {mapState,mapMutations} from 'vuex'
    import layOut from './../components/Layout.vue'

    export default {
        name: "printerManagement",
        data() {
            return {
                pageName:'printerList',
                currentDataIndex:null,
                currentRowId:'',
                currentSerialNumber:'',
                currentAction:'',
                actionModal:false,
                modalTitle:'',
                modelsList:[],
                unitsList:[],
                serialNumberList:[],
                provinceList:[],
                cityList:[],
                districtList:[],
                provinceId:'',
                cityId:'',
                districtId:'',
                isValid:false,
                printerDetailData:{},
                printfState:[],         //机器状态数据
                setData:[],             //打印状态数据
                printerListCurrentPage:1,
                printerListTotalPage:0,
                logListCurrentPage:1,
                logListTotalPage:0,
                printerTableData:[],
                printersLogListOnDetail:[],          //打印机详情日志列表
                logTableData:[],                     //设备日志列表
                printerList:{
                    serialNumber: '',
                    unitsId: '',
                    provinceId: '',
                    cityId: '',
                    districtId: '',
                    installAddress: ''
                },
                formValidate: {
                    unitsId: '',
                    modelId: '',
                    provinceId: '',
                    provinceName:'',
                    cityId: '',
                    cityName:'',
                    districtId: '',
                    districtName:'',
                    cityList: [],
                    districtList: [],
                    serialNumber: '',
                    installAddress: '',
                    name: '',
                    longitude: '',
                    installDate: '',
                    latitude: ''
                },
                logDetail:{
                    beginTime:'',
                    endTime:'',
                    operateDesc:''
                },
                ruleValidate: {
                    unitsId: [
                        { required: true, message: '请选择单位', trigger: 'change' }
                    ],
                    modelId: [
                        { required: true, message: '请选择型号', trigger: 'change' }
                    ],
                    provinceId: [
                        { required: true, message: '请选择省', trigger: 'change' }
                    ],
                    cityId: [
                        { required: true, message: '请选择市', trigger: 'change' }
                    ],
                    districtId: [
                        { required: true, message: '请选择区', trigger: 'change' }
                    ],
                    serialNumber: [
                        { required: true, message: '请输入出厂编号', trigger: 'blur' }
                    ],
                    installAddress: [
                        { required: true, message: '请输入安装地址', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入设备名称', trigger: 'blur' }
                    ],
                    longitude: [
                        { required: true, message: '请输入经度', trigger: 'blur' },
                    ],
                    latitude: [
                        { required: true, message: '请输入纬度', trigger: 'blur' }
                    ]
                },
                printerTableColumns: [
                    {
                        title: '出厂编号',
                        key: 'serialNumber',
                        render: (h, params) => {
                            return h('span',{
                                    props:{
                                       
                                    },
                                    style: {
                                        color:'#2d8cf0',
                                        textDecoration:'underline',
                                        cursor: 'pointer'
                                    },
                                     on: {
                                        click: () => {
                                            // 内容切换到打印机详情
                                            this.pageName='printerDetail'
                                            this.currentRowId=params.row.id
                                            this.currentSerialNumber=params.row.serialNumber
                                            this.getPrintersLogList(params.row.id,'detail')
                                            this.GLOBAL.$http(this.GLOBAL.HEADER+`printers/${params.row.id}`,'GET',(res)=>{
                                                if(res.data.code===1){
                                                    this.printerDetailData={}
                                                    this.printerDetailData=res.data.data
                                                    let printfStateArr=[],setDataArr=[],printerOnlineData=this.printerDetailData.printerOnlineData;
                                                    (printerOnlineData&&printerOnlineData.printfState)?printfStateArr.push(printerOnlineData.printfState):printfStateArr;
                                                    (printerOnlineData&&printerOnlineData.setData)?setDataArr.push({
                                                        ...printerOnlineData.setData,
                                                        timesTamp:printerOnlineData.timesTamp,
                                                        DPI:printerOnlineData.setData.photoXDpi+'*'+printerOnlineData.setData.photoYDpi,
                                                        photoSize:printerOnlineData.setData.photoLength+'*'+printerOnlineData.setData.photoWidth,
                                                        setCarSpeed:(printerOnlineData.setData.setCarSpeed===1?'高速':'低速')
                                                    }):setDataArr;
                                                    this.printfState=printfStateArr
                                                    this.setData=setDataArr
                                                }else{
                                                    this.GLOBAL.showResult(res.data.code,res.data.msg)
                                                }
                                            })
                                        }
                                    }
                                },`${params.row.serialNumber}`)
                        }
                    },
                    {
                        title: '设备名称',
                        key: 'name'
                    },
                    {
                        title: '单位名称',
                        key: 'unitsName'
                    },
                    {
                        title: '单位地址',
                        key: 'installAddress'
                    },
                    {
                        title: '在线情况',
                        key: 'onlineStatus',
                        width:80
                    },
                    {
                        title: '打印任务',
                        key: 'printerTask'
                    },
                    {
                        title: '异常警报',
                        key: 'abnormalAlarm'
                    },
                     {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width:180,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                    },
                                    style: {
                                        marginRight: '5px',
                                        width:'60px',
                                        height:'32px'
                                    },
                                    on: {
                                        click: () => {
                                            this.currentDataIndex=params.index
                                            this.currentAction='edit'
                                            this.modalTitle='编辑打印机'
                                            // let currentRowData=this.printerTableData[params.index]
                                            /***
                                            等待市区列表加载完成后绑定数据到市区数据到控件控件中
                                            * */
                                            Promise.all([
                                                new Promise((resolve,reject) => {
                                                    this.GLOBAL.$http(this.GLOBAL.HEADER+`printers/location/${params.row.provinceId}`,'GET',(res)=>{
                                                        if(res.data.code===1){
                                                            this.formValidate.cityList=res.data.data
                                                            resolve('success');
                                                        }else{
                                                            this.GLOBAL.showResult(res.data.code,res.data.msg)
                                                        }
                                                    })
                                                }),
                                                new Promise((resolve,reject) => {
                                                    this.GLOBAL.$http(this.GLOBAL.HEADER+`printers/location/${params.row.cityId}`,'GET',(res)=>{
                                                        if(res.data.code===1){
                                                            this.formValidate.districtList=res.data.data
                                                            resolve('success');
                                                        }else{
                                                            this.GLOBAL.showResult(res.data.code,res.data.msg)
                                                        }
                                                    })
                                                })
                                            ])
                                            .then(([city,district]) => { 
                                                if(city&&district){
                                                    {
                                                        this.formValidate.unitsId=params.row.unitsId
                                                        this.formValidate.modelId=params.row.modelId
                                                        this.formValidate.provinceId=params.row.provinceId
                                                        this.formValidate.cityId=params.row.cityId
                                                        this.formValidate.districtId=params.row.districtId
                                                        this.formValidate.provinceName=params.row.provinceName
                                                        this.formValidate.cityName=params.row.cityName
                                                        this.formValidate.districtName=params.row.districtName
                                                        this.formValidate.serialNumber=params.row.serialNumber
                                                        this.formValidate.installAddress=params.row.installAddress
                                                        this.formValidate.name=params.row.name
                                                        this.formValidate.longitude=params.row.longitude
                                                        this.formValidate.installDate=params.row.installDate
                                                        this.formValidate.latitude=params.row.latitude
                                                        this.actionModal=true
                                                    }
                                                    this.validForm('formValidate')
                                                }
                                            })
                                            .catch(error => {

                                            })
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        ghost:true
                                    },
                                    style: {
                                        width:'60px',
                                        height:'32px'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteRow(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                printStatusColumns:[{
                    title: '任务序号',
                    key: 'startPass'
                },{
                    title: '颜色位',
                    key: 'photoBit'
                },{
                    title: '颜色',
                    key: 'abnormalAlarm'
                },{
                    title: 'DPI',
                    key: 'DPI'
                },{
                    title: '尺寸',
                    key: 'photoSize'
                },{
                    title: '面积',
                    key: 'abnormalAlarm'
                },{
                    title: '时间',
                    key: 'timesTamp'
                },{
                    title: '速度',
                    key: 'setCarSpeed'
                }],
                machineStateColumns:[{
                    title: '控制卡',
                    key: 'controlCard ',
                    render: (h, params) => {
                        return h('span',{
                                class:params.row.controlCard ===1?'online':'offline'
                            })
                    }
                },{
                    title: '数据线',
                    key: 'dataLine',
                    render: (h, params) => {
                        return h('span',{
                                class:params.row.dataLine ===1?'online':'offline'
                            })
                    }
                },{
                    title: '前限位',
                    key: 'frontLimit',
                    render: (h, params) => {
                        return h('span',{
                                class:params.row.frontLimit ===1?'error':'online'
                            })
                    }
                },{
                    title: '后限位',
                    key: 'afterLimit',
                    render: (h, params) => {
                        return h('span',{
                                class:params.row.afterLimit ===1?'error':'online'
                            })
                    }
                },{
                    title: '左限位',
                    key: 'leftLimit',
                    render: (h, params) => {
                        return h('span',{
                                class:params.row.leftLimit ===1?'error':'online'
                            })
                    }
                },{
                    title: '右限位',
                    key: 'rightLimit',
                    render: (h, params) => {
                        return h('span',{
                                class:params.row.rightLimit ===1?'error':'online'
                            })
                    }
                },{
                    title: 'UV灯',
                    key: 'uvLight',
                    render: (h, params) => {
                        return h('span',{
                                class:params.row.uvLight ===1?'online':'offline'
                            })
                    }
                },{
                    title: '闪喷',
                    key: 'abnormalAlarm',
                    render: (h, params) => {
                        return h('span',{
                                class:params.row.controlCard ===1?'online':'offline'
                            })
                    }
                }],
                logTableColumns:[{
                    title: '时间',
                    key: 'time'
                },{
                    title: '打印任务',
                    key: 'moduleName'
                }]
            };
        },
        mounted() { 
            this.getProvinceList()
            this.getModelsList()        //型号列表
            this.getUnitsList()        //型号列表
            this.initPrinterTable()
            this.getSerialNumberList()
        },
        computed:{
            // ...mapState(['author','age']) 
        },
        methods: {
            cancel(){
                let newruleValidate=this.ruleValidate
                this.ruleValidate={}
                this.ruleValidate=newruleValidate
            },
            deleteRow(index){
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '<p>确定删除这台打印机？</p>',
                    loading: true,
                    onOk: () => {
                        this.GLOBAL.$http(this.GLOBAL.HEADER+'printers','DELETE',(res)=>{
                            if(res.data.code===1){
                                this.initPrinterTable()
                                this.GLOBAL.showResult(res.data.code,res.data.msg)
                                setTimeout(() => {
                                    this.$Modal.remove();
                                }, 1000);
                            }else{
                                this.GLOBAL.showResult(res.data.code,res.data.msg)
                            }
                        },{
                            id:this.printerTableData[index].id
                        })
                    }
                }); 
            },
            validForm(name){    //表单验证
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.isValid=true
                    } else {                           
                        //校验失败
                        // this.$Message.error('Fail!');
                        this.$refs.actionModal.visible = true
                        this.actionModal = true
                        this.isValid=false
                    }
                })
                return this.isValid
            },
            handleSubmit(name) { 
                if(this.validForm(name)){
                    //校验成功提交表单信息
                        let data={
                            unitsId: this.formValidate.unitsId,
                            modelId: this.formValidate.modelId,
                            provinceId: this.formValidate.provinceId,
                            cityId: this.formValidate.cityId,
                            districtId: this.formValidate.districtId,
                            serialNumber: this.formValidate.serialNumber,
                            installAddress: this.formValidate.installAddress,
                            name: this.formValidate.name,
                            longitude: this.formValidate.longitude,
                            installDate: this.formValidate.installDate,
                            latitude: this.formValidate.latitude
                        },method='POST'

                        if(this.currentAction==='edit'){
                            data['id']=this.printerTableData[this.currentDataIndex].id
                            method='PUT'
                        }
                        this.GLOBAL.$http(this.GLOBAL.HEADER+'printers',method,(res)=>{
                            if(res.data.code===1){
                                // this.provinceList=res.data.data
                                this.initPrinterTable()
                                this.GLOBAL.showResult(res.data.code,res.data.msg)
                            }else{
                                this.GLOBAL.showResult(res.data.code,res.data.msg)
                            }
                        },data)
                }
            },
            showActionModal(){
                this.currentAction='add'
                this.modalTitle='新建打印机'
                //清空对话框的表单控件内容
                {
                    this.formValidate.unitsId=''
                    this.formValidate.modelId=''
                    this.formValidate.provinceId=''
                    this.formValidate.cityId=''
                    this.formValidate.districtId=''
                    this.formValidate.provinceName=''
                    this.formValidate.cityName=''
                    this.formValidate.districtName=''
                    this.formValidate.serialNumber=''
                    this.formValidate.installAddress=''
                    this.formValidate.name=''
                    this.formValidate.longitude=''
                    this.formValidate.installDate=''
                    this.formValidate.latitude=''
                }
                //重置验证规则
                this.$refs['formValidate'].fields.forEach(function (e) {
                    e.resetField()
                })
                this.actionModal=true
            },
            getPosition(){
                // console.log(this.validForm.provinceName)
                this.GLOBAL.$http(this.GLOBAL.HEADER + "printers/latLon","GET",(res)=>{
                        if(res.data.code===1){
                            //input必须是字符串才能验证通过
                            this.formValidate.longitude=res.data.data.lng+''
                            this.formValidate.latitude=res.data.data.lat+''
                        }else{
                            this.GLOBAL.showResult(res.data.code,res.data.msg)
                        }
                    },
                    {
                        address: this.formValidate.provinceName+this.formValidate.cityName+this.formValidate.districtName+this.formValidate.installAddress,
                        ak: "oIlwMrZYdYeZL8CH1pH6vm8KYR3C9TLe"
                    }
                );
            },
            changePageName(){
                this.pageName='printerList'
            },
            initPrinterTable(){
                this.GLOBAL.$http(this.GLOBAL.HEADER+'printers','GET',(res)=>{
                    if(res.data.code===1){
                        this.printerTableData=res.data.data.list
                        this.printerListCurrentPage=res.data.data.pageNum
                        this.printerListTotalPage=res.data.data.total
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                },{
                    pageNum:this.printerListCurrentPage,
                    pageSize:10
                })
            },
            getProvinceList(){
                this.GLOBAL.$http(this.GLOBAL.HEADER+'printers/location/d87cfe59cb9b4260ac0e1c909e6350bf','GET',(res)=>{
                    if(res.data.code===1){
                        this.provinceList=res.data.data
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                })
            },
            getCityList(type,e){
                if(e){
                    this.formValidate.provinceName=e.label
                    if(e.value){
                        let id=e.value
                        this.GLOBAL.$http(this.GLOBAL.HEADER+`printers/location/${id}`,'GET',(res)=>{
                            if(res.data.code===1){
                                if(type==='tooltips'){
                                    this.cityList=res.data.data
                                }else{
                                    this.formValidate.cityList=res.data.data
                                }
                            }else{
                                this.GLOBAL.showResult(res.data.code,res.data.msg)
                            }
                        })
                    }
                }
            },
            getDistrictList(type,e){
                if(e){
                    this.formValidate.cityName=e.label
                    if(e.value){
                        let id=e.value
                        this.GLOBAL.$http(this.GLOBAL.HEADER+`printers/location/${id}`,'GET',(res)=>{
                            if(res.data.code===1){
                                if(type==='tooltips'){
                                    this.districtList=res.data.data
                                }else{
                                    this.formValidate.districtList=res.data.data
                                }
                            }else{
                                this.GLOBAL.showResult(res.data.code,res.data.msg)
                            }
                        })
                    }
                }
            },
            getDistrictName(e){
                if(e){
                    this.formValidate.districtName=e.label
                    //编辑中如果已经有了安装地址就直接获取经纬度
                    if(this.formValidate.installAddress){
                        this.getPosition()
                    }
                }
            },
            getModelsList(){
                this.GLOBAL.$http(this.GLOBAL.HEADER+'printers/models/list','GET',(res)=>{
                    if(res.data.code===1){
                        this.modelsList=res.data.data
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                })
            },
            getUnitsList(){
                this.GLOBAL.$http(this.GLOBAL.HEADER+'printers/units/list','GET',(res)=>{
                    if(res.data.code===1){
                        this.unitsList=res.data.data
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                })
            },
            getPrintersLogList(printersId,type,from){
                let data
                if(type==='detail'){
                    data={
                        pageNum:1,
                        pageSize:5,
                        printersId
                    }
                }else{
                    if(from==='searching'){
                        data={
                            pageNum:this.logListCurrentPage,
                            pageSize:10,
                            printersId,
                            beginTime:this.logDetail.beginTime,
                            endTime:this.logDetail.endTime,
                            operateDesc:this.logDetail.operateDesc
                        }
                    }else{
                        data={
                            pageNum:this.logListCurrentPage,
                            pageSize:10,
                            printersId
                        }
                    }
                }
                this.GLOBAL.$http(this.GLOBAL.HEADER+'printers/printersLog/list','GET',(res)=>{
                    if(res.data.code===1){
                        // this.serialNumberList=res.data.data
                        console.log(res.data.data)
                        if(type==='detail'){
                            this.printersLogListOnDetail=res.data.data.list
                        }else{
                            this.logTableData=res.data.data.list
                            this.logListCurrentPage=res.data.data.pageNum
                            this.logListTotalPage=res.data.data.total
                        }
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                },data)
            },
            getSerialNumberList(){
                this.GLOBAL.$http(this.GLOBAL.HEADER+'printers/serialNumber/list','GET',(res)=>{
                    if(res.data.code===1){
                        this.serialNumberList=res.data.data
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                })
            },
            formatInstallDate(e){
                this.formValidate.installDate=e
            },
            updateTable(e){
                //翻页刷新数据
                this.printerListCurrentPage=e
                this.initPrinterTable()
            },
            updateLogTable(from,e){
                this.logListCurrentPage=e
                from==='searching'?this.getPrintersLogList(this.currentRowId,'list','searching'):this.getPrintersLogList(this.currentRowId,'list')
            },
            searchingPrinterList(){
                this.printerListCurrentPage=1
                let data={
                    serialNumber:this.printerList.serialNumber,
                    unitsId:this.printerList.unitsId,
                    provinceId:this.printerList.provinceId,
                    cityId:this.printerList.cityId,
                    districtId:this.printerList.districtId,
                    installAddress:this.printerList.installAddress,
                    pageNum:this.printerListCurrentPage,
                    pageSize:10
                }
                this.GLOBAL.$http(this.GLOBAL.HEADER+'printers','GET',(res)=>{
                    if(res.data.code===1){
                        this.printerTableData=res.data.data.list
                        this.printerListCurrentPage=res.data.data.pageNum
                        this.printerListTotalPage=res.data.data.total
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                },data)
            },
            getMoreLog(){
                this.pageName='logDetail'
                this.getPrintersLogList(this.currentRowId,'list')
            },
            gotoDeviceAnomalyDetection(){
                sessionStorage.setItem('active','edba789e-2374-11e9-820d-408d5c7ca36b')
                this.$router.push({
                    path: `/deviceAnomalyDetection/${this.currentSerialNumber}`,
                })
            }
        },
        components:{
            layOut
        }
    };
</script>
