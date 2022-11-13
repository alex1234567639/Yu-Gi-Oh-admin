<template>
  <div>
    <button type="button" @click.prevent="refreshCode">
      <canvas id="auth-code" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'Captcha',
  data() {
    return {
      captcha: ''
    }
  },
  mounted() {
    // 生成驗證碼
    this.writeAuthCode()
    // 外部呼叫刷新驗證碼
    this.$emit('refreshCode', this.refreshCode)
  },
  methods: {
    writeAuthCode() {
      const options = {
        canvasId: 'auth-code',
        // 傳入驗證碼內容
        txt: this.randomCode(),
        // 驗證碼高度
        height: 50,
        // 驗證碼寬度
        width: 200
      }
      const canvas = document.getElementById(options.canvasId)
      canvas.width = options.width || 300
      canvas.height = options.height || 150
      // 建立一個canvas物件
      const ctx = canvas.getContext('2d')
      ctx.textBaseline = 'middle'
      // 這個範圍的顏色作背景看起來清晰一些
      ctx.fillStyle = this.randomColor(180, 255)
      ctx.fillRect(0, 0, options.width, options.height)
      for (let i = 0; i < options.txt.length; i++) {
        // 讓每個字不一樣
        const txt = options.txt.charAt(i)
        ctx.font = '2.5em SimHei'
        // 隨機生成字型顏色
        ctx.fillStyle = this.randomColor(50, 160)
        ctx.shadowOffsetY = this.randomNum(-3, 3)
        ctx.shadowBlur = this.randomNum(-3, 3)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        const x = options.width / (options.txt.length + 1) * (i + 1)
        const y = options.height / 2
        const deg = this.randomNum(-30, 30)
        // 設定旋轉角度和座標原點
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0)
        // 恢復旋轉角度和座標原點
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
      }
      // 1~4條隨機干擾線隨機出現
      for (let i = 0; i < this.randomNum(1, 4); i++) {
        ctx.strokeStyle = this.randomColor(40, 180)
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, options.width), this.randomNum(0, options.height))
        ctx.lineTo(this.randomNum(0, options.width), this.randomNum(0, options.height))
        ctx.stroke()
      }
      // 繪製干擾點
      for (let i = 0; i < options.width / 6; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(this.randomNum(0, options.width), this.randomNum(0, options.height), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    },
    // 隨機數字
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 隨機顏色
    randomColor(min, max) {
      const r = this.randomNum(min, max)
      const g = this.randomNum(min, max)
      const b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    // 隨機驗證碼
    randomCode() {
      const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < 4; i++) {
        const txt = str[this.randomNum(0, str.length)]
        code += txt
      }
      // 驗證碼值傳給Login.vue
      this.$emit('getCaptcha', code)
      this.captcha = code
      return this.captcha
    },
    // 刷新驗證碼
    refreshCode() {
      this.writeAuthCode()
    }
  }
}
</script>

<style lang="scss" scoped>
canvas {
  @apply w-full;
  cursor: pointer;
}

@media (min-width: 1921px) {
  canvas {
    width: 10vw;
  }
}
</style>
