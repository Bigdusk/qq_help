import router from "../router";

export function to_index() {
    router.push('/')
}

export function to_qq_export() {
    router.push('/qq_export')
}

export function to_qq_add_in_bulk() {
    router.push('/qq_add_in_bulk')
}

export function to_qq_delete() {
    router.push('/qq_delete')
}

export function to_qq_group_export() {
    router.push('/qq_group_export')
}

export function to_group_export() {
    router.push('/group_export')
}

export function to_qq_group_add_in_bulk() {
    router.push('/qq_group_add_in_bulk')
}

export function to_qq_group_supervision_and_scraping() {
    router.push('/qq_group_supervision_and_scraping')
}

export function to_setting() {
    router.push('/setting')
}
export function to_qq_message() {
    router.push('/qq_message')
}
export function to_email_send() {
    router.push('/email_send')
}