use std::process::Command;

use chrono::Local;
use entity::email::EmailPacket;
use md5::Digest;
use md5::Md5;

pub mod entity;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn send_email(email_packet: EmailPacket) -> Result<String, String> {
    match email_packet.send() {
        Ok(r) => {
            Ok(r.code().to_string())
        }
        Err(e) => {
            Err(e.to_string())
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![send_email, md5_build,get_uuid])
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

///获取主板uuid
#[tauri::command]
async fn get_uuid() -> Result<String, String> {
    match Command::new("wmic")
        .args(&["csproduct", "get", "uuid"])
        .output()
    {
        Ok(output) => {
            if output.status.success() {
                // 将输出转换为字符串并按行分割
                let uuid_output = String::from_utf8_lossy(&output.stdout);
                let lines: Vec<&str> = uuid_output.trim().lines().collect();
                
                // 假设UUID是第二行（第一行为列标题）
                if lines.len() > 1 {
                    Ok(lines[1].trim().to_string())
                } else {
                    Err("获取授权码未知失败".to_string())
                }
            } else {
                Err("获取授权码失败".to_string())
            }
        },
        Err(_e) => Err("获取授权码失败".to_string()),
    }
}

#[test]
fn t() {
    match Command::new("wmic")
        .args(&["csproduct", "get", "uuid"])
        .output()
    {
        Ok(output) => {
            if output.status.success() {
                // 将输出转换为字符串并按行分割
                let uuid_output = String::from_utf8_lossy(&output.stdout);
                let lines: Vec<&str> = uuid_output.trim().lines().collect();

                // 假设UUID是第二行（第一行为列标题）
                if lines.len() > 1 {
                    println!("Motherboard UUID: {}", lines[1].trim());
                } else {
                    eprintln!("Unexpected output format from wmic command");
                }
            } else {
                eprintln!("Failed to execute wmic command");
            }
        }
        Err(e) => eprintln!("Failed to start wmic command: {}", e),
    }
}
