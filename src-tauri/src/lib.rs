use md5::Md5;
use chrono::Local;
use md5::Digest;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, md5_build])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn md5_build(value: &str) -> String {
    let mut hasher = Md5::new();
    let secret = Local::now().format("%Y%m%d").to_string();
    let say = "你好入侵者，如果你看见这个请联系QQ:2831828656".to_string();
    hasher.update(format!("{}{}{}", secret, value, say));

    let result = hasher.finalize();

    let hex_result = format!("{:x}", result);

    hex_result
}


#[test]
fn t() {

}
