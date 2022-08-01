<template>
  <div>
    <div class="box">
      <div class="left">
        <div class="image_list">
          <el-image
            v-for="(url, index) in imageUrls"
            :key="url"
            :src="url"
            :class="{ selected: url === selectdUrl }"
            lazy
            @click="changeImage(index)"
          >
          </el-image>
        </div>
      </div>
      <div class="middle">
        <Canvas :imgUrl="selectdUrl" :filename="selectedFilename">
          <div slot="bottomBar" style="margin-top: 20px; text-align: center">
            <el-button
              type="primary"
              icon="el-icon-arrow-left"
              size="small"
              @click="prevImage()"
              >上一张</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-arrow-right"
              size="small"
              @click="nextImage()"
              >下一张</el-button
            >
            <el-button type="success" size="small" @click="uploadData()"
              >上传已标注</el-button
            >
            <el-button type="danger" size="small" @click="handerDel()"
              >删除</el-button
            >
          </div>
        </Canvas>
      </div>
      <div class="right">
        <div class="tips">标注信息</div>
        <el-card class="box-card">
          <div v-for="(rect, index) in getRects" :key="index" class="text item">
            {{ "标记" + (index + 1) + ": " }}<br />
            <el-input
              :value="rect.transcription"
              @input="
                (value) =>
                  $store.commit('addTag', {
                    filename: selectedFilename,
                    pointIndex: index,
                    value: value,
                  })
              "
              placeholder="请输入标签"
            ></el-input>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import Canvas from "./Canvas.vue";
import { getImg, uploadTags, deloads } from "../../api/data";
export default {
  name: "PageTwo",
  components: { Canvas },
  data() {
    return {
      selectdUrl: "",
      selectedIndex: 0,
      imageUrls: [],
    };
  },
  computed: {
    getRects() {
      return this.$store.getters.rectPoints(this.selectedFilename);
    },
    selectedFilename() {
      let index = this.selectdUrl.lastIndexOf("/");
      let filename = this.selectdUrl.substr(index + 1);
      return filename;
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getImg().then((res) => {
        this.imageUrls = res.data;
        this.selectdUrl = this.imageUrls[0];
      });
    },
    changeImage(index) {
      this.selectedIndex = index;
      this.selectdUrl = this.imageUrls[index];
    },
    prevImage() {
      if (this.selectedIndex > 0) {
        this.changeImage(this.selectedIndex - 1);
      }
    },
    nextImage() {
      if (this.selectedIndex < this.imageUrls.length) {
        this.changeImage(this.selectedIndex + 1);
      }
    },
    uploadData() {
      let res = [];
      for (const key of Object.keys(this.$store.state.mark.rects)) {
        let value = this.$store.state.mark.rects[key].map((rect) => {
          return {
            transcription: rect.transcription,
            points: [
              [Math.round(rect.aCoords.tl.x), Math.round(rect.aCoords.tl.y)],
              [Math.round(rect.aCoords.tr.x), Math.round(rect.aCoords.tr.y)],
              [Math.round(rect.aCoords.br.x), Math.round(rect.aCoords.br.y)],
              [Math.round(rect.aCoords.bl.x), Math.round(rect.aCoords.bl.y)],
            ],
            difficult: false,
          };
        });
        res.push({ filename: key, info: value });
      }
      uploadTags(res);
    },
    handerDel() {
      deloads(this.selectedFilename);
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  display: flex;
  flex-direction: row;
  height: 700px;
  width: 100%;
  color: #bfcbd9;
}
.left {
  background-color: #282828;
  flex: 0 0 200px;
  border-right: 1px solid #171717;
  width: 300px;
  overflow: auto;
}
.middle {
  flex: 1 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
}
.right {
  display: flex;
  flex-direction: column;
  background-color: #282828;
  flex: 0 0 300px;
  border-left: 1px solid #171717;
  width: 300px;
  overflow: auto;
  .tips {
    flex: 0 0 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  el-button {
    width: 100px;
  }
}
.selected {
  border: 2px solid yellow;
}
.image_list {
  padding: 4px;
}
.image_list::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #282828;
}
.image_list::-webkit-scrollbar-track {
  background-color: #d3dce6;
}
.image_list::-webkit-scrollbar-thumb {
  background-color: #99a9bf;
  border-radius: 20px;
}
.text {
  font-size: 14px;
}
.item {
  padding: 18px 0;
}
.el-input {
  margin-top: 20px;
}
</style>
