<template>
  <el-upload
    class="pop-upload"
    ref="upload"
    action=""
    :file-list="fileList"
    :auto-upload="false"
    :multiple="true"
    :on-change="handleChange"
    :on-remove="handleRemove"
  >
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button
      style="margin-left: 10px"
      size="small"
      type="success"
      @click="submitUpload"
      >上传到服务器</el-button
    >
  </el-upload>
</template>

<script>
import url from "../../config";
import { uploads } from "../../api/data";
export default {
  name: "PageOne",
  data() {
    return {
      URL: url.baseURL.dev + "/ocr/uploads",
      fileList: [],
    };
  },
  methods: {
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用,function(file, fileList)
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。function(file, fileList)
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    //上传服务器
    submitUpload() {
      //判断是否有文件再上传
      if (this.fileList.length === 0) {
        return this.$message.warning("请选取文件后再上传");
      }
      // 下面的代码将创建一个空的FormData对象:
      const formData = new FormData();
      // 你可以使用FormData.append来添加键/值对到表单里面；
      this.fileList.forEach((file) => {
        formData.append("file", file.raw);
      });

      //自定义的接口也可以用ajax或者自己封装的接口
      uploads(formData).then((res) => {
        if (Array.isArray(res.data)) {
          this.$message({
            message: "上传成功",
            type: "success",
          });
        } else {
          this.$message.error("上传失败");
        }
      });
    },
  },
  //#region
  // mounted() {
  //   this.$socket.on("test1", () => {
  //     console.log(111);
  //   });
  //   this.$socket.emit("test2", { test: 2 });
  // },
  // sockets: {
  //   disconnect() {
  //     console.log("Socket 断开");
  //   },
  //   connect_failed() {
  //     console.log("连接失败");
  //   },
  //   connect() {
  //     console.log("Socket 连接 ");
  //   },
  //   test1(data) {
  //     console.log(data);
  //   },
  // },
  //#endregion
};
</script>

<style>
</style>