<template>
  <div class="manage">
    <!-- 编辑表单 -->
    <el-dialog
      :title="operateType === 'add' ? '新增用户' : '更新用户'"
      :visible.sync="isShow"
    >
      <common-form
        :formLabel="operateFormLabel"
        :form="operateForm"
        :inline="true"
        ref="form"
      ></common-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="comfirm">确定</el-button>
      </div>
    </el-dialog>
    <!-- 头部 -->
    <div class="manage-header">
      <el-button type="primary" @click="addUser">+ 新增</el-button>
      <common-form
        :formLabel="keyword"
        :form="searchForm"
        :inline="true"
        ref="form"
      >
        <el-button type="primary" @click="getList(searchForm.keyword)"
          >搜索</el-button
        >
      </common-form>
    </div>
    <!-- 用户列表 -->
    <common-table
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      @changePage="getList"
      @edit="editUser"
      @del="delUser"
    ></common-table>
  </div>
</template>

<script>
import CommonForm from "../../src/components/CommonForm.vue";
import CommonTable from "../../src/components/CommonTable.vue";
import { getUser } from "../../api/data";
export default {
  name: "User",
  components: {
    CommonForm,
    CommonTable,
  },
  data() {
    return {
      operateType: "add",
      isShow: false,
      operateFormLabel: [
        {
          model: "name",
          label: "姓名",
          type: "input",
        },
        {
          model: "age",
          label: "年龄",
          type: "input",
        },
        {
          model: "sex",
          label: "性别",
          type: "select",
          opts: [
            {
              label: "男",
              value: 1,
            },
            {
              label: "女",
              value: 0,
            },
          ],
        },
        {
          model: "birth",
          label: "出生日期",
          type: "date",
        },
        {
          model: "addr",
          label: "地址",
          type: "input",
        },
      ],
      operateForm: {
        name: "",
        addr: "",
        age: "",
        birth: "",
        sex: "",
      },
      keyword: [
        {
          model: "keyword",
          label: "",
          type: "input",
        },
      ],
      searchForm: {
        keyword: "",
      },
      tableData: [],
      tableLabel: [
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "age",
          label: "年龄",
        },
        {
          prop: "sexLabel",
          label: "性别",
        },
        {
          prop: "birth",
          label: "出生日期",
          width: 200,
        },
        {
          prop: "addr",
          label: "地址",
          width: 320,
        },
      ],
      config: {
        page: 1,
        total: 30,
      },
    };
  },
  methods: {
    comfirm() {
      //虽然编辑的瞬间，浏览器端的数据发生了改变并显示到页面上，但服务器端并没有改变数据，因此必须向服务器端发送修改请求
      if (this.operateType === "edit") {
        this.$http.post("user/edit", this.operateForm).then(() => {
          this.isShow = false;
          this.getList();
        });
      } else {
        this.$http.post("user/add", this.operateForm).then(() => {
          this.isShow = false;
          this.getList();
        });
      }
    },
    addUser() {
      this.isShow = true;
      this.operateType = "add";
      this.operateForm = {
        name: "",
        addr: "",
        age: "",
        birth: "",
        sex: "",
      };
    },
    //row为子组件传递的数据
    editUser(row) {
      this.isShow = true;
      this.operateType = "edit";
      this.operateForm = row;
    },
    delUser(row) {
      this.$confirm("此操作将永久删除该数据，是否继续？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const id = row.id;
        this.$http
          .post("user/del", {id},)
          .then(({ data }) => {
            if (data.code === 20000) {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.getList();
            }else{
              this.$message({
                type: "error",
                message: "删除失败",
              });
            }
          });
      });
    },
    getList(name) {
      this.config.loading = true;
      name ? (this.config.page = 1) : '';
      getUser({
        name,
        page: this.config.page,
      }).then(({ data }) => {
        this.tableData = data.list.map((item) => {
          item.sexLabel = item.sex === 0 ? "女" : "男";
          return item;
        });
        this.config.total = data.count;
        this.config.loading = false;
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style>
</style>