<template>
<input type="text" :placeholder="$speak('placeholder', 'email', 'default')">
<input type="text" :placeholder="$speak('placeholder','media', 'video')">
</template>
<script>
export default {
    // #in ViewModel
    validation(group){
        return {
            name: [
                { required: true, message: this.$speak('validation', 'media', 'video'), trigger: 'change' }
            ]
        }
    }

    words(){
        return {
            placeholder: {
                email: { default: '请输入邮箱' },
                password: { default: '请输入密码' },
            },
            validation: {
                email: { default: '必须填入邮箱', email: '邮箱格式不正确' },
                password: { default: '必须填入密码', 'Incorrect format': '密码必须包含数字及英文字符' }
            }
        }
    }


    // 保留，具体得看axios拦截请求时的处理进行决定
    errors: {
        'RequestError'(ctx){
            
        }
    }
}
</script>
