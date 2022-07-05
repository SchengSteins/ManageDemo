<template>
  <div class="ocr">
    <el-dialog :visible.sync="dialogVisible">
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
        style="margin-bottom: 30px"
      />
      <div v-for="(item, index) in dialogOCrResult" :key="index">
        {{ item.words || item.err }}
      </div>
    </el-dialog>
    <el-upload
      :action="URL"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-error="handleError"
      list-type="picture"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
  </div>
</template>

<script>
import url from "../../config";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      dialogOCrResult: [],
      URL: url.baseURL.dev + "/ocr",
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleError() {
      this.$message.error("文件上传失败！");
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      if (file.response.error_msg) {
        this.$message.warning("该数据识别发生异常");
        this.dialogOCrResult = [{ err: file.response.error_msg }];
      } else {
        this.dialogVisible = true;
        this.dialogOCrResult = file.response.words_result;
      }
    },
  },
};
</script>

<style>
</style>