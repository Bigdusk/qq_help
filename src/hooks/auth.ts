import { ref } from "vue";
import { Computer } from "../entity";
import { post } from "./request";
import { invoke } from "@tauri-apps/api/core";
import { notification } from "./discrete_api";

export async function auth(f: () => void) {
    //获取游览器指纹
    let fp = localStorage.getItem('fingerprint')
    if (!fp) return;
    //电脑信息
    const computer = ref<Computer>({
        authorization_id: 0,
        computer_id: "",
        expires_at: null,
        is_active: null
    })
    computer.value.computer_id = fp

    post('/computer/auth', computer.value).then(public_key => {
        invoke('md5_build', { value: '0' }).then(local_key => {
            if (public_key === local_key) {
                f()
            }
        })
        invoke('md5_build', { value: '1' }).then(local_key => {
            if (public_key === local_key) {
                notification.warning({title: '授权过期'})
            }
        })
    })
}