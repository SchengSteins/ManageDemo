<template>
  <el-form
    :model="form"
    status-icon
    ref="form"
    :rules="rules"
    label-width="auto"
    class="login-container"
  >
    <h3 class="login_title">注册新用户</h3>

    <el-form-item label="用户名:" label-width="100px" prop="username">
      <el-input
        type="input"
        v-model="form.username"
        autocomplete="off"
        placeholder="请输入账号"
      ></el-input>
    </el-form-item>
    <el-form-item label="邮箱地址:" label-width="100px" prop="email">
      <el-input
        type="input"
        v-model="form.email"
        autocomplete="on"
        placeholder="请输入邮箱"
      ></el-input>
    </el-form-item>
    <el-form-item label="登录密码:" label-width="100px" prop="password">
      <el-input
        type="password"
        v-model="form.password"
        autocomplete="off"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item label="确认密码:" label-width="100px" prop="checkPass">
      <el-input
        type="password"
        v-model="form.checkPass"
        autocomplete="off"
        placeholder="请确认密码"
      ></el-input>
    </el-form-item>
    <el-form-item class="login_submit">
      <el-button type="primary" @click="regist">注册</el-button>
    </el-form-item>
    <router-link to="/login" style="font-size: 12px; color: red"
      >已有账号，去登录</router-link
    >
  </el-form>
</template>

<script>
import { getReg } from "../../api/data";
export default {
  name: "regist",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        email: "",
        password: "",
        checkPass: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            message: "用户名长度不能少于3位",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { validator: validatePass, required: true, trigger: "blur" },
        ],
        checkPass: [
          { validator: validatePass2, required: true, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    regist() {
      getReg(this.form).then(({ data: res }) => {
        const { status, message } = res;
        if (status == 0) {
          this.$message.success(message + "即将跳转到登录页面");
          setTimeout(() => {
            this.$router.push({ name: "login" });
          }, 2000);
        } else {
          this.$message.warning(message);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 600px;
  padding: 35px 100px 15px 100px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  text-align: center;
}

.login_title {
  font-size: large;
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.login_submit {
  display: flex;
  justify-content: center;
}
</style>