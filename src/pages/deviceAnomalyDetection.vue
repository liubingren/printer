<style scoped lang="less">
    .content{
        padding: 32px;
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
    }
</style>
<template>
    <layOut v-cloak>
        <div slot="page-title" class="page-title" :style="{color:'#343436',fontSize:'18px',marginBottom:'15px'}">
            设备异常检测
        </div>
        <div slot="content" class="content">
            <div class="toolTip">
                <span>
                    出厂编号：
                </span>
                 <Select v-model="serialNumber" clearable placeholder="请选择出厂编号" style="width:160px">
                    <Option v-for="item in serialNumberList" :value="item.serialNumber" :key="item.serialNumber">{{ item.serialNumber }}</Option>
                </Select>
                <span>
                    异常类型：
                </span>
                 <Select v-model="warningType" clearable  placeholder="请选择异常类型" style="width:160px">
                    <Option v-for="item in warningTypeList" :value="item.id" :key="item.id">{{ item.message }}</Option>
                </Select>
                <span>
                    单位地址：
                </span>
                <Select v-model="provinceId" style="width:80px" clearable placeholder="省" @on-change="getCityList">
                    <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select v-model="cityId" style="width:80px" clearable placeholder="市" @on-change="getDistrictList">
                    <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select v-model="districtId" style="width:80px" clearable placeholder="区">
                    <Option v-for="item in districtList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input v-model="installAddress" placeholder="请输入详细地址" style="width: 160px"></Input>

                <Button type="primary" @click="updateTable('btn',$event)">确定</Button>
            </div>
             <div class="toolTip" :style="{ marginTop: '10px'}">
                <span>
                    开始时间：
                </span>
                <DatePicker type="datetime" v-model="startTime" placeholder="请选择开始时间" style="width: 160px" @on-change="formatDate('startTime',$event)"></DatePicker>
                <span>
                    结束时间：
                </span>
                <DatePicker type="datetime" v-model="endTime" placeholder="请选择结束时间" style="width: 160px" @on-change="formatDate('endTime',$event)"></DatePicker>
            </div>
            <div class='table-wrap'>
                <Table :columns="deviceWarningListColumns" :data="deviceWarningList" border></Table>
                <Page class='page-bar' :current="currentPageNum" :total="totalRow" show-elevator show-total @on-change="updateTable('update',$event)"></Page>
            </div>
        </div>
    </layOut>
</template>
<script>
    // import Utils from './../utils/index.js'
    // import {mapState,mapMutations} from 'vuex'
    import layOut from './../components/Layout.vue'

    export default {
        name: "deviceAnomalyDetection",
        data() {
            return {
                warningTypeList:[],
                serialNumberList:[],
                provinceList:[],
                cityList:[],
                districtList:[],
                deviceWarningList:[],
                warningType:null,
                serialNumber:null,
                provinceId:null,
                cityId:null,
                districtId:null,
                installAddress:null,
                startTime:null,
                endTime:null,
                currentPageNum:1,
                totalRow:0,
                deviceWarningListColumns: [
                    {
                        title: '出厂编号',
                        key: 'serialNumber'
                    },
                    {
                        title: '设备名称',
                        key: 'name'
                    },{
                        title: '异常类型',
                        key: 'type'
                    },
                    {
                        title: '单位名称',
                        key: 'unitName'
                    },{
                        title: '单位地址',
                        key: 'installAddress'
                    },
                    {
                        title: '时间',
                        key: 'createtime'
                    }
                ]
            };
        },
        mounted() {
            this.getSerialNumberList()
            this.getProvinceList()
            //打印机详情跳转过来
            if(this.$route.params.id){
                this.serialNumber=this.$route.params.id
            }
            this.getDeviceWarningList()
        },
        computed:{
            // ...mapState(['author','age']) 
        },
        methods: {
            // ...mapMutations(['changeAge'])
            getSerialNumberList(){               //获取设备编号
                this.GLOBAL.$http(this.GLOBAL.HEADER+'deviceWarning/getPrintersByUser','GET',(res)=>{
                    if(res.data.code===1){
                        this.serialNumberList=res.data.data
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                })
            },
            getWarningTypeList(){
                this.GLOBAL.$http(this.GLOBAL.HEADER+'deviceWarning/warningTypeList','GET',(res)=>{
                    if(res.data.code===1){
                        this.warningTypeList=res.data.data
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                })
            },
            getProvinceList(){
                this.GLOBAL.$http(this.GLOBAL.HEADER+'deviceWarning/getLocationByParentId','GET',(res)=>{
                    if(res.data.code===1){
                        this.provinceList=res.data.data
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                },{
                    parentId:'d87cfe59cb9b4260ac0e1c909e6350bf'
                })
            },
            getCityList(e){
                this.GLOBAL.$http(this.GLOBAL.HEADER+`deviceWarning/getLocationByParentId`,'GET',(res)=>{
                    if(res.data.code===1){
                        this.cityList=res.data.data 
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                },{
                    parentId:e
                })
            },
            getDistrictList(e){
                this.GLOBAL.$http(this.GLOBAL.HEADER+`deviceWarning/getLocationByParentId`,'GET',(res)=>{
                    if(res.data.code===1){
                        this.districtList=res.data.data
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                },{
                    parentId:e
                })
            },
            formatDate(type,e){
                if(type==='endTime'){
                    this.endTime=e
                }else{
                    this.startTime=e
                }
            },
            getDeviceWarningList(){
                let data={
                    map:'',
                    pageNum:this.currentPageNum,
                    pageSize:10,
                    serialNumber:this.serialNumber,
                    type:this.warningType,
                    provinceId:this.provinceId,
                    cityId:this.cityId,
                    districtId:this.districtId,
                    installAddress:this.installAddress,
                    startTime:this.startTime,
                    endTime:this.endTime,
                }
                this.GLOBAL.$http(this.GLOBAL.HEADER+`deviceWarning/getDeviceWarningList`,'GET',(res)=>{
                    if(res.data.code===1){
                        this.currentPageNum=res.data.data.pageNum
                        this.totalRow=res.data.data.total
                        this.deviceWarningList=res.data.data.list
                    }else{
                        this.GLOBAL.showResult(res.data.code,res.data.msg)
                    }
                },data)
            },
            updateTable(type,e){
                if(type==='update'){
                    this.currentPageNum=e
                    this.getDeviceWarningList()
                }else{
                    this.currentPageNum=1
                    this.getDeviceWarningList()
                }
            }
        },
        components:{
            layOut
        }
    };
</script>
