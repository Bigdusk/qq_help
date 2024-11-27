use std::error::Error;

use lettre::{message::MultiPart, transport::smtp::{authentication::Credentials, response::Response, PoolConfig}, Message, SmtpTransport, Transport};
use serde::{Deserialize, Serialize};
///每次发送邮件所需参数
#[derive(Debug,Clone, Serialize, Deserialize)]
pub struct EmailPacket {
    pub config: EmailConfig,
    pub from: EmailInfo,
    pub reply: EmailInfo,
    pub to: EmailInfo,
    pub content: EmailContent
}
///邮箱信息
#[derive(Debug,Clone, Serialize, Deserialize)]
pub struct EmailInfo {
    pub name: String,
    pub email: String
}
///邮箱配置
#[derive(Debug,Clone, Serialize, Deserialize)]
pub struct EmailConfig {
    pub smtp_url: String,
    pub smtp_username: String,
    pub smtp_password: String,
    pub port: u16
}
///邮箱内容
#[derive(Debug,Clone, Serialize, Deserialize)]
pub struct EmailContent {
    pub subject: String,
    pub plain: String,
    pub html: String
}

impl EmailPacket {
    pub fn send(self) -> Result<Response, Box<dyn Error>> {
        let from = format!("{} <{}>", self.from.name, self.from.email);
        let reply = format!("{} <{}>", self.reply.name, self.reply.email);
        let to = format!("{} <{}>", self.to.name, self.to.email);

        let email = Message::builder()
            .from(from.parse()?)
            .reply_to(reply.parse()?)
            .to(to.parse()?)
            .subject(self.content.subject)
            .multipart(MultiPart::alternative_plain_html(
                String::from(self.content.plain),
                String::from(self.content.html),
            ))?;

        // 使用 STARTTLS 在端口 587 上创建 TLS 传输
        let sender = SmtpTransport::starttls_relay(self.config.smtp_url.as_str())?
            .port(self.config.port)
            // Add credentials for authentication
            .credentials(Credentials::new(
                self.config.smtp_username.to_owned(),
                self.config.smtp_password.to_owned(),
            ))
            .pool_config(PoolConfig::new().max_size(20))
            .build();
        
        // 通过远程中继发送电子邮件
        let result = sender.send(&email)?;
        Ok(result)
    }
}