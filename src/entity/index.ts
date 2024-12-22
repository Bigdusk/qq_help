export interface Computer {
    authorization_id: number
    computer_id: string
    expires_at: string | null
    is_active: number | null
}

export interface QQFriendInfo {
    "categoryId": number
    "categoryName": string
    "categoryMbCount": number
    "buddyList": QQInfo[]
}

export interface QQInfo {
    "group": string
    "qid": string
    "longNick": string
    "birthday_year": number
    "birthday_month": number
    "birthday_day": number
    "age": number
    "sex": string
    "eMail": string
    "categoryId": number
    "richTime": number
    "uid": string
    "uin": string
    "remark": string
    "user_id": number
    "nickname": string
    "level": number
    "email": string
}

export interface QQGroup {
    "group_id": number
    "group_name": string
    "group_memo": string
    "group_create_time": number | string
    "member_count": number
    "max_member_count": number
}

export interface QQGroupMember {
    "group_name": string | null
    "group_id": number
    "user_id": number
    "nickname": string
    "card": string
    "sex": string
    "age": number

    "area": string
    "level": string

    "qq_level": string
    "join_time": number | string
    "last_sent_time": number | string

    "title_expire_time": number
    "unfriendly": boolean
    "card_changeable": boolean
    "is_robot": boolean
    "shut_up_timestamp": number
    
    "role": string
    "title": string
    "email": string
}

export interface SocketMessage {
    font: number
    group_id: number | null
    message: any[]
    message_format: string
    message_id: number
    message_seq: number
    message_type: string
    post_type: string
    raw_message: string
    real_id: number
    self_id: number
    sender: any
    sub_type: string
    target_id: number | null
    time: number
    user_id: number
}

export interface Notice {
    "announcement_id": number
    "content": string
    "expiration_date": string
    "is_active": number
    "publish_date": string
    "title": string
    "user_id": number
}


export interface EmailPacket {
    config: EmailConfig,
    from: EmailInfo,
    reply: EmailInfo,
    to: EmailInfo,
    content: EmailContent
}
///邮箱信息

export interface EmailInfo {
    name: string | null,
    email: string | null
}
///邮箱配置

export interface EmailConfig {
    smtp_url: string,
    smtp_username: string,
    smtp_password: string,
    port: number
}
///邮箱内容

export interface EmailContent {
    subject: string,
    plain: string,
    html: string
}

export interface EmailParameter {
    from: EmailInfo,
    reply: EmailInfo,
    to: EmailInfo,
    time: number
}