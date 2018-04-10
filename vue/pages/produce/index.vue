<template>

    <v-layout>
        <div slot="main">
            <el-row :gutter="24" style="margin-top: 20px">
                <el-col :span="8" :offset="16">
                    <div class="grid-content bg-purple">
                        <el-button-group>
                            <el-button @click="exportExcel()">{{$t('导出')}}</el-button>
                            <el-button @click="startProduce()">{{$t('开始生产')}}</el-button>
                            <!--<el-button @click="printTags()">{{$t('批量打印')}}</el-button>-->
                        </el-button-group>
                    </div>
                </el-col>
            </el-row>

            <div>
                <!-- 搜索条件-->
                <el-form :inline="true" :model="searchArgs" class="demo-form-inline">
                    <el-form-item :label="$t('生产编号')">
                        <el-input v-model="searchArgs.serial_id" @keyup.enter.native="onSearch" :placeholder="$t('serial_id')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('订单编号')">
                        <el-input v-model="searchArgs.ext_order_id" @keyup.enter.native="onSearch" :placeholder="$t('ext_order_id')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('订单号')">
                        <el-input v-model="searchArgs.increment_id" @keyup.enter.native="onSearch" :placeholder="$t('increment_id')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('加急')">
                        <el-select v-model="searchArgs.expedited" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in ['否','待确认','加急']"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('sku')">
                        <el-input v-model="searchArgs.sku" @keyup.enter.native="onSearch" :placeholder="$t('SKU')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('类型')" prop="type">
                        <el-select v-model="searchArgs.type" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in factoryProduceConfigs.typeOptions"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="showFactoryInfo" :label="$t('工厂')" prop="factory_id">
                        <el-select v-model="searchArgs.factory_id" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in factoryProduceConfigs.factories"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('状态')" prop="status">
                        <el-select v-model="searchArgs.status" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in factoryProduceConfigs.statusOptions"
                                    :key="index"
                                    :label="item"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('是否定制')" prop="series_id">
                        <el-select v-model="searchArgs.series_id" clearable @change="onSearch" :placeholder="$t('请选择')">
                            <el-option
                                    v-for="(item, index) in factoryProduceConfigs.factorySeries"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('请求验收数')" prop="request_num">
                        <el-input v-model="searchArgs.request_num" @keyup.enter.native="onSearch" :placeholder="$t('例如：>0')"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('下单时间')" prop="status">
                        <el-date-picker
                                v-model="searchArgs.created_at"
                                type="datetimerange"
                                @change="onSearch"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                </el-form>
                <!-- 分页 -->
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.currentPage"
                        :page-sizes="page.pageSizes"
                        :page-size="page.pageSize"
                        layout="slot, sizes, prev, pager, next, jumper"
                        :total="page.total"
                        slot="page.total">
                    <template name="total">
                        <span class="el-pagination__total">{{$t('el.pagination.total',{total:page.total})}}</span>
                    </template>
                </el-pagination>
                <!-- 搜索条件-->
                <!--<el-table :data="[searchArgs]" border  @selection-change="checkAll" style="width: 100%" >-->
                    <!--<el-table-column type="selection" prop="id" width="40"></el-table-column>-->

                    <!--<el-table-column prop="serial_id" :label="$t('生产编号')" width="120px">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-input v-model="searchArgs.serial_id" @keyup.enter.native="onSearch" :placeholder="$t('serial_id')"></el-input>-->
                        <!--</template>-->
                    <!--</el-table-column>-->

                    <!--<el-table-column prop="sku" :label="$t('SKU')" >-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-input v-model="searchArgs.sku" @keyup.enter.native="onSearch" :placeholder="$t('SKU')"></el-input>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="product.template_no" :label="$t('版号')"  width="100px"></el-table-column>-->
                    <!--<el-table-column prop="order.ext_order_id" :label="$t('订单编号')"  width="100px">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-input v-model="searchArgs.ext_order_id" @keyup.enter.native="onSearch" :placeholder="$t('ext_order_id')"></el-input>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="order.increment_id" :label="$t('订单号')"  width="100px">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-input v-model="searchArgs.increment_id" @keyup.enter.native="onSearch" :placeholder="$t('increment_id')"></el-input>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="amount" :label="$t('生产数量')" width="60px"></el-table-column>-->
                    <!--<el-table-column prop="request_num" :label="$t('请求验收数量')" width="70px"></el-table-column>-->
                    <!--<el-table-column prop="accept_num" :label="$t('已验收数量')" width="70px"></el-table-column>-->
                    <!--<el-table-column prop="pics" :label="$t('图片')"> </el-table-column>-->

                    <!--<el-table-column prop="type" :label="$t('类型')"  width="50px">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-select v-model="searchArgs.type" clearable @change="onSearch" :placeholder="$t('请选择')">-->
                                <!--<el-option-->
                                        <!--v-for="(item, index) in factoryProduceConfigs.typeOptions"-->
                                        <!--:key="index"-->
                                        <!--:label="item"-->
                                        <!--:value="index">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="status" :label="$t('状态')">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-select v-model="searchArgs.status" clearable @change="onSearch" :placeholder="$t('请选择')">-->
                                <!--<el-option-->
                                        <!--v-for="(item, index) in factoryProduceConfigs.statusOptions"-->
                                        <!--:key="index"-->
                                        <!--:label="item"-->
                                        <!--:value="index">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column v-if="showFactoryInfo" prop="factory_id" :label="$t('工厂')">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-select v-model="searchArgs.factory_id" clearable @change="onSearch" :placeholder="$t('请选择')">-->
                                <!--<el-option-->
                                        <!--v-for="(item, index) in factoryProduceConfigs.factories"-->
                                        <!--:key="index"-->
                                        <!--:label="item"-->
                                        <!--:value="index">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="sku" width="120px" :label="$t('尺码')">-->
                        <!--<template slot-scope="scope">-->
                            <!--<span v-show="skuSize(scope.row.sku)">{{ $t('尺码')+':'+skuSize(scope.row.sku)}}</span>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="size_type" :label="$t('尺码类型')"></el-table-column>-->

                    <!--<el-table-column prop="series_id" :label="$t('是否定制')">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-select v-model="searchArgs.series_id" clearable @change="onSearch" :placeholder="$t('请选择')">-->
                                <!--<el-option-->
                                        <!--v-for="(item, index) in factoryProduceConfigs.factorySeries"-->
                                        <!--:key="item.id"-->
                                        <!--:label="item.name"-->
                                        <!--:value="item.id">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="has_engravings" :label="$t('是否刻字')">-->
                        <!--<template slot-scope="scope">-->
                            <!--<span :style="{color:scope.row.has_engravings==1 ? 'red':''}">{{scope.row.has_engravings ==1 ? $t('是'):$t('否')}}</span>-->
                        <!--</template>-->
                    <!--</el-table-column>-->

                    <!--<el-table-column prop="description" :label="$t('备注')" width="80"></el-table-column>-->
                    <!--<el-table-column prop="expedited" :label="$t('加急')"> </el-table-column>-->
                    <!--<el-table-column prop="change_confirm" :label="$t('变更确认')"> </el-table-column>-->
                    <!--&lt;!&ndash;<el-table-column prop="out_key" :label="$t('out_key')"> </el-table-column>&ndash;&gt;-->
                    <!--&lt;!&ndash;<el-table-column prop="order_id" :label="$t('order id')"> </el-table-column>&ndash;&gt;-->
                    <!--<el-table-column prop="created_at" :formatter="date" :label="$t('下单时间')">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-date-picker-->
                                    <!--v-model="searchArgs.created_at"-->
                                    <!--type="datetimerange"-->
                                    <!--@change="onSearch"-->
                                    <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                                    <!--range-separator="至"-->
                                    <!--start-placeholder="开始日期"-->
                                    <!--end-placeholder="结束日期">-->
                            <!--</el-date-picker>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="start_at" :formatter="date" :label="$t('开始时间')"> </el-table-column>-->
                    <!--<el-table-column prop="start_at"  :label="$t('结束时间')"></el-table-column>-->

                    <!--<el-table-column fixed="right" :label="$t('操作')"></el-table-column>-->
                <!--</el-table>-->
                <!-- 生产列表 -->
                <el-table  height="680" :data="factoryProduceList" ref="multipleTable" border style="width: 100%" @selection-change="checkFactoryProduceItem">
                    <el-table-column type="selection" prop="id" width="40"></el-table-column>
                    <!--<el-table-column prop="id" :label="$t('ID')" width="60"></el-table-column>-->

                    <el-table-column prop="serial_id" :label="$t('生产编号')" width="120px">
                        <template slot-scope="scope">
                            {{getSerialNo(scope.row.serial_id)}}
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="spu" :label="$t('SPU')"  width="100px">-->
                        <!--<template slot-scope="scope">-->
                            <!--{{sxu(scope.row.sku).spu}}-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column prop="sku" :label="$t('SKU')" ></el-table-column>
                    <el-table-column prop="product.template_no" :label="$t('版号')"  width="100px"></el-table-column>
                    <el-table-column prop="order.ext_order_id" :label="$t('订单编号')"  width="100px"></el-table-column>
                    <el-table-column prop="order.increment_id" :label="$t('订单号')"  width="100px"></el-table-column>
                    <el-table-column prop="amount" :label="$t('生产数量')" width="60px">
                        <template slot-scope="scope">
                            <span :style="{color:scope.row.amount>1 ? 'red':''}">{{ scope.row.amount }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="request_num" :label="$t('请求验收数量')" width="70px"></el-table-column>
                    <el-table-column prop="accept_num" :label="$t('已验收数量')" width="70px"></el-table-column>
                    <el-table-column prop="pics" :label="$t('图片')">
                        <template slot-scope="scope">
                            <img width="100%" :src="getMainImage(scope.row.product.picMap)" @click="showImageView($event)" class="image" />
                        </template>
                    </el-table-column>

                    <el-table-column prop="type" :label="$t('类型')"  width="50px">

                        <template slot-scope="scope">{{factoryProduceConfigs.typeOptions[scope.row.type]}}</template>
                    </el-table-column>
                    <el-table-column prop="status" :label="$t('状态')">
                        <template slot-scope="scope">
                            {{factoryProduceConfigs.statusOptions[scope.row.status]}}
                        </template>
                    </el-table-column>
                    <el-table-column v-if="showFactoryInfo" prop="factory_id" :label="$t('工厂')">
                        <template slot-scope="scope">
                            {{scope.row.factory.name}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sku" width="120px" :label="$t('尺码')">
                        <template slot-scope="scope">
                            <span v-show="skuSize(scope.row.sku)">{{ $t('尺码')+':'+skuSize(scope.row.sku)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="size_type" :label="$t('尺码类型')">
                        <template slot-scope="scope">
                            <span>{{scope.row.orderItem ? $t('product.detail.'+scope.row.orderItem.size_type) : ''}}</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="size_type" :label="$t('是否定制')">-->
                        <!--<template slot-scope="scope">-->
                            <!--<span>{{scope.row.orderItem ? factoryProduceConfigs.factorySeries : ''}}</span>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="custom_attr" :label="$t('效果图')">-->
                        <!--<template slot-scope="scope">-->
                            <!--<img width="100%" :src="scope.row.custom_attr && scope.row.custom_attr.renderings  ? scope.row.custom_attr.renderings : ''" @click="showImageView($event)" class="image" />-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column prop="custom_attr" width="170px" :label="$t('属性')">-->
                        <!--<template slot-scope="scope">-->
                            <!--<span v-html="scope.row.display_attr ? scope.row.display_attr.join('<br/>') :''"></span>-->
                            <!--<productUserData :user_data="scope.row.extra_data"></productUserData>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column prop="has_engravings" :label="$t('是否刻字')">
                        <template slot-scope="scope">
                            <span :style="{color:scope.row.has_engravings==1 ? 'red':''}">{{scope.row.has_engravings ==1 ? $t('是'):$t('否')}}</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="paused" label="暂停">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-tag v-if="scope.row.paused==1" type="danger"><i class="el-icon-time"></i>暂停</el-tag>-->
                            <!--<span v-else>否</span>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                            prop="description"
                            :label="$t('备注')"
                            width="80">
                        <template slot-scope="props">
                            <orderCommentPack v-if="props.row.type=='stock'" :target="{id:props.row.id}" type="stock_produce"></orderCommentPack>
                            <orderCommentPack v-if="props.row.type=='order' && props.row.order" :target="props.row.order" type="order"></orderCommentPack>
                        </template>
                    </el-table-column>
                    <el-table-column prop="expedited" :label="$t('加急')">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.expedited==1" type="danger"><i class="el-icon-time"></i>{{$t('待确认')}}</el-tag>
                            <el-tag v-else-if="scope.row.expedited==2" type="danger"><i class="el-icon-time"></i>{{$t('已加急')}}</el-tag>
                            <span v-else>{{$t('否')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="change_confirm" :label="$t('变更确认')">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.change_confirm==1" type="danger"><i class="el-icon-time"></i>{{$t('待确认')}}</el-tag>
                            <span v-else-if="scope.row.change_confirm==2">{{$t('已确认')}}</span>
                            <span v-else>{{$t('否')}}</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="out_key" :label="$t('out_key')"> </el-table-column>-->
                    <!--<el-table-column prop="order_id" :label="$t('order id')"> </el-table-column>-->
                    <el-table-column prop="created_at" :formatter="date" :label="$t('下单时间')"> </el-table-column>
                    <el-table-column prop="start_at" :formatter="date" :label="$t('开始时间')"> </el-table-column>
                    <el-table-column prop="start_at"  :label="$t('结束时间')">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status=='complete'" >{{moment(scope.row.end_at*1000).format('YYYY-MM-DD HH:mm')}}</span>
                            <countdown v-if="scope.row.status!='complete' && scope.row.status!='cancel'" :end_time="formatDate(scope.row.start_at,5)"></countdown>
                        </template>
                    </el-table-column>

                    <el-table-column fixed="right" :label="$t('操作')">
                        <template slot-scope="scope">
                            <el-dropdown @click="handleItemClick(scope.row,'info')">
                                <span class="el-dropdown-link">
                                    {{$t('操作')}}<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item @click.native="currentRow.id=scope.row.id;dialogDetailVisible=true">{{$t('详情')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.paused!=1" @click.native="openProgress(scope.row)">{{$t('开始生产')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="openCommentDialog(scope.row,'222')">{{$t('备注')}}</el-dropdown-item>
                                    <el-dropdown-item @click.native="printTag(scope.row)">{{$t('打印标签')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.paused!=1 && scope.row.expedited==1" @click.native="needConfirm(scope.row,'expedited')">{{$t('确认加急')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.paused!=1 && scope.row.change_confirm==1" @click.native="needConfirm(scope.row,'change_confirm')">{{$t('确认变更')}}</el-dropdown-item>
                                    <el-dropdown-item v-if="scope.row.type!='order' && scope.row.paused!=1 && scope.row.request_num>0 && $router.power('accept')" @click.native="openAccept(scope.row)">{{$t('验收')}}</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>

                    </el-table-column>
                </el-table>
            </div>

            <!-- form -->
            <el-dialog :title="$t('请求验收')" :visible.sync="dialogRequestFormVisible">
                <el-form ref="requestForm" :model="requestForm" :rules="requestFormRules" label-width="110px">

                    <el-form-item :label="$t('生产总数')" >
                        <el-input readonly v-model="requestForm.amount"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('已验收数量')">
                        <el-input readonly v-model="requestForm.accept_num"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('请求验收数量')" prop="num">
                        <el-input v-model="requestForm.num"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="requestProduce">{{$t('保存')}}</el-button>
                        <el-button @click="dialogRequestFormVisible=false">{{$t('取消')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('验收通过')" :visible.sync="dialogFormVisible">
                <el-form ref="form" :model="form" :rules="formRules" label-width="90px">

                    <el-form-item :label="$t('生产总数')" >
                        <el-input readonly v-model="form.amount"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('已验收数量')">
                        <el-input readonly v-model="form.accept_num"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('验收数量')" prop="num">
                        <el-input v-model="form.num"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="acceptProduce">{{$t('保存')}}</el-button>
                        <el-button @click="dialogFormVisible=false">{{$t('取消')}}</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog :title="$t('步骤')" :visible.sync="progressVisible">
                <el-steps :active="progress.stepStatus" finish-status="success">
                    <el-step v-for="(item, index) in progress.map" :title="item" :key="index"></el-step>
                </el-steps>
                <el-button style="margin-top: 12px;" v-if="!progressComplete" @click="setProgress">{{progress.map[progress.stepStatus]}}</el-button>
            </el-dialog>
            <!--详情-->
            <el-dialog :title="$t('详情')" :visible.sync="dialogDetailVisible">
                <detail :id="currentRow.id" :options="factoryProduceConfigs" ></detail>
            </el-dialog>
            <!-- 备注 -->
            <el-dialog :visible.sync="outerCommonDialogVisible"
                       :fullscreen="false"
                       :modal="true"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false"
            >
                <comment ref="comment" :form="{}" :params="{}" @commentSaveAfter="commentSaveAfter"></comment>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="outerDialogSave"
                               type="primary">
                        {{$t('保 存')}}
                    </el-button>
                    <el-button @click="outerCommonDialogVisible = false">{{$t('关 闭')}}</el-button>
                </div>
            </el-dialog>
            <!-- img view-->
            <image_view :url="previewImage.url" :width="previewImage.width" :dialogVisible="previewImage.show" @closeImagePreview="closeImagePreview"></image_view>
        </div>
    </v-layout>
</template>

<script>
    import i18n from '../../local'
    import vk from '../../vk.js'
    import uri from '../../uri.js'
    import moment from 'moment'
    import comment from '../common/comment.vue'
    import orderCommentPack from '../common/comment.but-list.vue'
    import image_view from '../common/image_view.vue';
    import countdown from '../common/countdown.vue';
    import lodop from '../common/lodop/print.label';
    import productUserData from '../common/product_user_data.vue';
    import detail from './detail.vue';
    let App ={
        components:{
            comment,
            orderCommentPack,
            image_view,
            countdown,
            productUserData,
            detail,
        },
        data() {
            return {
                factoryProduceList: [],
                searchArgs:{},
                page:{
                    currentPage:1,
                    pageSize:20,
                    pageSizes:[20, 50, 100, 200,500],
                    total:0
                },
                form:{
                    id:0,
                    amount:0,
                    accept_num:0,
                    num:0
                },
                requestForm:{
                    id:0,
                    amount:0,
                    accept_num:0,
                    num:0
                },
                currentRow:{id:0},
                factoryProduceConfigs:{},
                multipleSelection:[],
                dialogFormVisible: false,
                dialogRequestFormVisible: false,
                dialogDetailVisible: false,
                progressVisible:false,
                progress:{
                    selectRow:{},
                    stepStatus:0,
                    map:['等待生产','开始生产','请求验收'],
                    action:['wait_produce','in_produce','wait_accept']
                },
                requestFormRules: {
                    num: [
                        { validator: this.checkRequestSum, trigger: 'blur' }
                    ],

                },
                formRules: {
                    num: [
                        { required: true, message: i18n.t('请输入数量'), trigger: 'blur' },
                        { validator: this.checkAcceptSum, trigger: 'blur' }
                    ],

                },
                outerCommonDialogVisible:false,
                previewImage:{url:'',width:0,show:false},
            }
        },
        computed: {
            progressComplete:function(){
                return this.progress.stepStatus >= 3;
            },
            showFactoryInfo:function(){
                return this.factoryProduceConfigs.factories && Object.keys(this.factoryProduceConfigs.factories).length > 1;
            }
        },
        mounted(){
            vk.http(uri.factoryProduceConfigs,{},this.then);
            this.getLists();
            lodop.init();
        },
        methods : {
            ...vk,
            then(json,code){
                if(json.code != 200){
                    this.$message(json.message);
                    return;
                }
                switch(code) {
                    case uri.factoryProduceList.code:
                        this.factoryProduceList = json.list;
                        this.page.total = json.total;
                        break;
                    case uri.factoryProduceConfigs.code:
                        this.factoryProduceConfigs = json.data;
                        break;
                    case uri.factoryProduceAccept.code:
                    case uri.factoryProduceExpedited.code:
                        this.dialogFormVisible = false;
                        this.getLists();
                        break;
                    case uri.factoryProduceSet.code:
                        this.dialogRequestFormVisible = false;
                        this.progressVisible = false;
                        this.getLists();
                        this.progress.stepStatus = Math.min(++this.progress.stepStatus,this.progress.action.length-1);
                        break;
                    case uri.factoryBatchStart.code:
                        this.getLists();
                        break;
                    case uri.factoryProduceExport.code:
                        if(json.url)
                            window.open(json.url);
                        break;

                }
            },
            onSearch(){
                this.getLists();
            },
            getLists(){
                vk.http(uri.factoryProduceList,{searchArgs:this.searchArgs,with:['product.picMap.image','factory','storeHouse','order','orderItem','operateLogs'],sort:'created_at desc',page:this.page.currentPage,pageSize:this.page.pageSize},this.then);
            },
            exportExcel(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.factoryProduceExport,{ids:this.multipleSelection,joinWith:['product.oneTemplate'],with:['product.picMap.image','factory','product.templates.attributeInfo','storeHouse','order','operateLogs'],sort:'product_template.template_no '},this.then);
            },
            checkFactoryProduceItem(val){
                this.multipleSelection = val.map(function(value) {return value.id});
            },
            openProgress(row){
                this.progressVisible = true;
                this.progress.selectRow = row;
                switch (row.status){
                    case 'wait_produce':
                        this.progress.stepStatus = 1;
                        break;
                    case 'in_produce':
                        this.progress.stepStatus = 2;
                        break;
                    case 'wait_accept':
                        this.progress.stepStatus = 3;
                        break;
                    default:
                        this.progress.stepStatus = 4;
                }
            },
            setProgress(){
                let row = this.progress.selectRow;
                let step = this.progress.stepStatus;
                if(this.progress.action[step] == 'wait_accept'){
                    this.openRequestAccept(row);
                }else{
                    vk.http(uri.factoryProduceSet,{status:this.progress.action[step],id:row.id},this.then);
                }


            },
            startProduce(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                vk.http(uri.factoryBatchStart,{ids:this.multipleSelection},this.then);
            },
            openRequestAccept(row){
                this.requestForm = row;
                this.requestForm.num = row.amount - row.accept_num - row.request_num;
                this.dialogRequestFormVisible = true;
            },
            checkRequestSum(rule, value, callback){
                let num = this.requestForm.amount-this.requestForm.accept_num-this.requestForm.request_num;
                if (parseInt(value) <= 0 || parseInt(value) > num ) {
                    callback(new Error(i18n.t('不能超过可验收数目:')+num));
                } else {
                    callback();
                }
            },
            requestProduce(){
                let that = this,form = this.requestForm;
                let step = this.progress.stepStatus;
                this.$refs['requestForm'].validate(function(valid){
                    if (valid) {
                        let status = form.amount == (form.accept_num+form.num) ?
                            that.progress.action[step] : that.progress.action[step-1];
                        vk.http(uri.factoryProduceSet,
                            {status:status,num:form.num,id:form.id},
                            that.then);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            openAccept(row){
                this.form = row;
                this.form.num = row.request_num;
                this.dialogFormVisible = true;
            },
            checkAcceptSum(rule, value, callback){
                if (parseInt(value) <= 0 || parseInt(value) > parseInt(this.form.request_num) ) {
                    callback(new Error(i18n.t('不能超过可验收数目:')+this.form.request_num));
                } else {
                    callback();
                }

            },
            acceptProduce(){
                let that = this;
                this.$refs['form'].validate(function(valid){
                    if (valid) {
                        vk.http(uri.factoryProduceAccept,{sum:that.form.num,id:that.form.id},that.then);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            needConfirm(row,type){
                let msg ;
                if(type=='change_confirm'){
                    msg = '确认变更吗？<br/>';
                    for(let i in row.productAttrDiff){
                        if(typeof row.productAttrDiff[i].new =='string'){
                            msg += i18n.t('product.user_set.'+i)+':'+' [新]'+row.productAttrDiff[i].new+'  [旧]'+row.productAttrDiff[i].old+'<br/>'
                        }else{
                            for(let j in row.productAttrDiff[i]){
                                if(isNaN(i)){
                                    msg += i18n.t('product.user_set.'+i)+'['+j+']:'+' [新]'+row.productAttrDiff[i][j].new+'  [旧]'+row.productAttrDiff[i][j].old+'<br/>'
                                }else{
                                    msg += i18n.t('product.user_set.'+j)+':'+' [新]'+row.productAttrDiff[i][j].new+'  [旧]'+row.productAttrDiff[i][j].old+'<br/>'
                                }

                            }
                        }
                    }
                }else{
                    msg = i18n.t('确认要加急吗？');
                }
                this.confirm(msg,()=>{
                    vk.http(uri.factoryProduceExpedited,{id:row.id,type:type},this.then);
                });
            },
            receiveSaveFactoryProduce(){
                this.dialogFormVisible = false;
                this.getLists();
            },
            handleCurrentChange(currentPage){
                this.page.currentPage = currentPage;
                this.getLists();
            },
            handleSizeChange(size){
                this.page.pageSize = size;
                this.getLists();
            },
            date: function (row, column) {
                return vk.date('YYYY-MM-DD HH:II',row[column.property]);
            },
            formatDate:function(date,day){
                if(!parseInt(date)) return 0;
                return (86400*day+ parseInt(date))*1000
            },
            yesNo: function (row, column) {
                return row[column.property]==1 ? '是':'否';
            },
            openCommentDialog(row, cateStr){

                if(row){
                    this.operationData=row;
                }
                this.outerCommonDialogVisible=true;
                this.cateStr=cateStr;
                var that=this;
                setTimeout(function(){
                    that.$refs.comment.initPage(cateStr,cateStr>1000);
                },0);
            },
            outerDialogSave(){

                let type = this.operationData.type=='stock' ? 'stock_produce':'order';
                let target_id = this.operationData.type=='stock' ? this.operationData.id : this.operationData.order_id;
                this.$refs.comment.commentSave({
                    type:type,
                    target_id:target_id,
                    item:this.operationData,
                    code:this.cateStr,
                });
            },
            commentSaveAfter(obj){

                if(this.outerDialogVisible){
                    this.$refs.orderInfoPack.initPage();
                }
                this.outerCommonDialogVisible=false;
            },
            moment(arg){
                return moment(arg);
            },
            str_pad(num,n,fill){
                num = "" + num;
                fill = "" + fill;
                fill = fill.repeat(n);
                return fill.substring(0, fill.length - num.length) + num
            },
            getSerialNo(id){
                return 'F'+id;
            },
            getCustomAttr(row){
                if(row.type!='order') return '';
                if(row.custom_attr){
                    let key,html=[];
                    let data = row.custom_attr;
                    for(key in data){
                        switch (key){
                            case 'engraving':
                                let eng = '刻字：'+data[key].value;
                                if(data[key].size) eng += ' / '+data[key].size;
                                if(data[key].font) eng += ' / '+data[key].font;
                                html.push(eng);
                                break;
                            case 'engravings':
                                for(let val in data[key]){
                                    html.push('刻字['+data[key][val].key+']['+data[key][val].position+']：'+data[key][val].value+
                                    ' / '+ data[key][val].size+' / '+data[key][val].font);
                                }

                                break;
                            case 'stones':
                                for(let val in data[key]){
                                    html.push(val+'：'+(data[key][val].info ? data[key][val].info.serial_id+' x '+data[key][val].num :
                                            data[key][val].description));
                                }

                                break;
                            case 'materials':
                                for(let val in data[key]){
                                    html.push(val+'：'+data[key][val]);
                                }

                                break;
                        }
                    }
                    return html.join('<br/>');
                }
                return '';
            },
            printTags(){
                if(this.multipleSelection.length < 1){
                    this.$message(this.$t('common.none_select'))
                    return;
                }
                let selectRows = this.factoryProduceList.filter(t => this.multipleSelection.includes(t.id))

                for (var i in selectRows){
                    this.printTag(selectRows[i]);
                }

            },
            checkAll(a,b,c){
                if(a.length>0){
                    this.$refs.multipleTable.clearSelection();
                    this.productList.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                }else{
                    this.$refs.multipleTable.clearSelection();
                }

            },
            printTag(row){
                if(!row.sku || !row.id){
                    this.$message('不存在sku/生产编号');
                    return;
                }
                let number = this.getSerialNo(row.serial_id);
                let pp = this.sxu(row.sku);

                if(number && pp && pp.spu){
                    let size = this.skuSize(row.sku);
                    lodop.printLabel(pp.spu,size?this.skuSize(row.sku,true):'',number);
                }


            }
        }
    }
    export default {i18n,...App};
</script>
