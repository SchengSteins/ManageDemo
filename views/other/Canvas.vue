<template>
  <div>
    <canvas id="canvas"></canvas>
    <slot name="bottomBar"></slot>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Canvas",
  data() {
    return {
      canvas: {},
      dtop: 0,
      dleft: 0,
      dw: 0,
      dh: 0,
      timer: null,
    };
  },
  computed: {
    ...mapState({
      rects: (state) => state.mark.rects,
    }),
  },
  props: ["imgUrl", "filename"],
  watch: {
    imgUrl() {
      this.insertImg();
    },
  },
  methods: {
    ...mapMutations({
      addRect: "addRect",
      deleteRect: "deleteRect",
    }),

    init() {
      this.canvas = new fabric.Canvas("canvas", {
        backgroundColor: "rgb(100,100,200)", // 画布背景色
        selectionColor: "rgba(255,255,255,0.3)", // 画布中鼠标框选背景色
        selectionLineWidth: 0, // 画布中鼠标框选边框1
        // selection: false, // 在画布中鼠标是否可以框选 默认为true
      });
      this.insertImg();
    },

    insertImg() {
      this.canvas.clear();
      this.rects[this.filename] &&
        this.rects[this.filename].forEach((rect) => this.canvas.add(rect));
      let image = new Image();
      image.src = this.imgUrl;
      image.onload = () => {
        // 绘制图片
        // 设置this.canvas宽高
        this.canvas.setWidth(image.width);
        this.canvas.setHeight(image.height);

        fabric.Image.fromURL(this.imgUrl, (img) => {
          img.set({
            scaleX: 1,
            scaleY: 1,
            left: 0,
            top: 0,
          });
          this.canvas.setBackgroundImage(
            img,
            this.canvas.renderAll.bind(this.canvas)
          );
        });
      };
    },

    createRect() {
      this.canvas.on("mouse:down", (options) => {
        this.dleft = options.e.offsetX;
        this.dtop = options.e.offsetY;
      });
      this.canvas.on("mouse:up", (options) => {
        let offsetX =
          options.e.offsetX > this.canvas.width
            ? this.canvas.width
            : options.e.offsetX;
        let offsetY =
          options.e.offsetY > this.canvas.height
            ? this.canvas.height
            : options.e.offsetY;

        this.dw = Math.abs(offsetX - this.dleft);
        this.dh = Math.abs(offsetY - this.dtop);
        // 拦截点击
        if (this.dw === 0 || this.dh === 0) {
          return;
        }

        let rect = new fabric.Rect({
          top: this.dtop > offsetY ? offsetY : this.dtop,
          left: this.dleft > offsetX ? offsetX : this.dleft,
          width: this.dw,
          height: this.dh,
          fill: "rgba(101,169,230,0.2)",
          stroke: "rgb(101,169,230)", // 边框原色
          strokeWidth: 2, // 边框大小1
          // angle: 15,
          // selectable: false, // 是否允许当前对象被选中
          lockRotation: true, // 不允许旋转
        });
        rect.transcription = ""; //初始化标签
        rect.set("strokeUniform", true); // 该属性在启用时可以防止笔划宽度受对象的比例值影响
        this.canvas.add(rect); //缓存到vuex
        this.addRect({ filename: this.filename, rect });
        this.stopDraw();

        this.canvas.skipTargetFind = false; //设置对象能否选中
      });
      this.canvas.on("mouse:move", (options) => {
        if (options.target) {
          this.objectMoving(options);
        }
      });
    },

    stopDraw() {
      this.canvas.off("mouse:down");
      this.canvas.off("mouse:up");
    },

    // 限制对象的 不超出画布
    objectMoving(e) {
      var obj = e.target;
      if (!obj) return;
      if (
        obj.currentHeight > obj.canvas.height ||
        obj.currentWidth > obj.canvas.width
      ) {
        return;
      }
      obj.setCoords();
      // top-left corner
      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
      }
      // bot-right corner
      if (
        obj.getBoundingRect().top + obj.getBoundingRect().height >
          obj.canvas.height ||
        obj.getBoundingRect().left + obj.getBoundingRect().width >
          obj.canvas.width
      ) {
        obj.top = Math.min(
          obj.top,
          obj.canvas.height -
            obj.getBoundingRect().height +
            obj.top -
            obj.getBoundingRect().top
        );
        obj.left = Math.min(
          obj.left,
          obj.canvas.width -
            obj.getBoundingRect().width +
            obj.left -
            obj.getBoundingRect().left
        );
      }
    },
  },
  mounted() {
    let self = this;
    document.onkeydown = function (event) {
      if (event.key === "q" && event.ctrlKey) {
        //点击键盘 数字"1"后可以开始绘制标注框
        self.createRect();
        self.canvas.skipTargetFind = true;
      } else if (event.key === "Delete") {
        //选中标注框对象 再点击键盘"delete"键可以删除标注框
        if (
          self.canvas.getActiveObject() &&
          self.canvas.getActiveObject()?._objects?.length > 1
        ) {
          self.canvas.getActiveObject()._objects.forEach((element) => {
            self.canvas.remove(element);
            self.deleteRect(rect);
          });
          self.canvas.discardActiveObject();
        } else if (self.canvas.getActiveObject()) {
          let rect = self.canvas.getActiveObject();
          self.canvas.remove(rect);
          self.deleteRect({ filename: self.filename, rect });
        }
      }
    };

    this.init();
  },
};
</script>

<style lang="less" scoped>
</style>
