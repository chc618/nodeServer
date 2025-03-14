<template>
  <div style="display:flex">
    <div>
      用户名:<input type='text' v-model='form.username' /><br />
      新密码:<input type='text' v-model='form.newPassword' /><br />
      新密码:<input type='text' v-model='form.rePassword' /><br />
      <button @click='update'>确认</button>
      <button @click='getUser'>查询</button>
    </div>
    <div class="div2" v-if="userInfo.nickname">
      <h3>用户信息</h3>
      <div>
        昵称:{{userInfo.nickname}}
      </div>
      <div v-if="userInfo.gender != '无'">
        性别:{{userInfo.gender}}
      </div>
      <div v-if="userInfo.age != ''">
        年龄:{{userInfo.age}}
      </div>
    </div>
  </div>
</template>

<script>
import { updatePassword, getUserInfo } from '../api/user'
export default {
  data() {
    return {
      form: {
        username: '',
        newPassword: '',
        rePassword: ''
      },
      userInfo: {}
    }
  },
  methods: {
    getUser() {
      getUserInfo(this.form.username).then(res => {
        this.userInfo = res.data.data[0]
      }).catch((err) => {
        console.log(err)
      })
    },
    update() {
      if (
        this.form.username == '' ||
        this.form.newPassword == '' ||
        this.form.rePassword == ''
      ) {
        alert('数据不能为空')
        return
      }
      updatePassword(this.form)
        .then((res) => {
          alert(res.data.msg)
          this.$router.push('/')
          alert('修改密码后请重新登录')
        })
        .catch((err) => {
          alert(err.response.data.msg)
        })
    }
  }
}
</script>

<style>
</style>
