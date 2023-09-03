export const register_meta = {
    title: 'Register | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const login_meta = {
    title: 'Login | PCLMS - Laboratory Management System',
    description: 'Sign into the platform to elevate your research career'
}
export const verify_meta = {
    title: 'User Verification | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const dashboard_meta = {
    title: 'Dashboard | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const days_mgt_meta = {
    title: 'Days Management | PCLMS - Laboratory Management System',
    description: 'Sign up to the platform to elevate your research career'
}
export const Regex = {
    PASSWORD: new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,100}$/), //eslint-disable-line
    ALPHANUMERIC: new RegExp(/^([a-zA-Z0-9 _-]+)$/), //eslint-disable-line
    EMAIL: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/), //eslint-disable-line
    NUMERIC: new RegExp(/^[0-9]+$/), //eslint-disable-line
    MONGODB: new RegExp(/^[0-9a-fA-F]{24}$/), //eslint-disable-line
    ALPHA: new RegExp(/^[a-zA-Z ]*$/), //eslint-disable-line
    SPECIALCHARS: new RegExp(/\W|_/g), //eslint-disable-line
    CSVDOT_HYPHEN: /^[a-zA-Z0-9 .,-]{0,150}$/ //eslint-disable-line
}