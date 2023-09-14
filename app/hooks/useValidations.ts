import { Availability_Status, Functionality_Status, Regex, SelectableFiles } from "../utils/statics"

const useValidations = () => {
    const { ALPHA, EMAIL, PASSWORD, NUMERIC, MONGODB, CSVDOT_HYPHEN } = Regex

    const validateRegistration = ({ ...params }) => {
        const { data, next, takeOutPassword } = params

        const { firstname, lastname, email, phone, password, password_confirmation } = data
        takeOutPassword((prev: any) => ({ ...prev, password: '', password_confirmation: '' }))
        if (!firstname.length || !lastname.length || !email.length || !phone.length || !password.length || !password_confirmation.length) return { error: 'All fields are required' }
        if (!firstname.match(ALPHA) || !lastname.match(ALPHA)) return { error: 'Only English alphabets and whitespaces are allowed in names' }
        if (!email.match(EMAIL)) return { error: 'Incorrect email address' }
        if (!password.match(PASSWORD)) return { error: 'Password must contain numbers and special chars' }
        if (!phone.match(NUMERIC) || phone.length !== 10) return { error: 'Phone number must be a numeric entity of 10 chars' }
        if (firstname.length < 3 || firstname.length > 30 || lastname.length < 3 || lastname.length > 30) return { error: 'Names must be in the range of 3 to 30 chars' }
        if (password.length < 8) return { error: 'Password must be at least 8 chars' }
        if (password !== password_confirmation) return { error: 'Passwords do not match' }
        return next()
    }
    const validateOTP = ({ ...params }) => {
        const { data, next } = params
        const { user_id, verification_code, page } = data
        if (!user_id.match(MONGODB)) return { error: 'Cannot process an invalid data' }
        if (!verification_code.match(NUMERIC)) return { error: 'Invalid verification code' }
        if (verification_code.length !== 6) return { error: 'Invalid verification code' }
        if (!['sign-in', 'sign-up'].includes(page)) return { error: 'Invalid request' }
        return next()
    }
    const validateResendOTP = ({ ...params }) => {
        const { data, next } = params
        const { user_id, tk_value } = data
        if (!user_id.match(MONGODB) || tk_value.trim().length === 0) return { error: 'Cannot process an invalid data' }
        return next()
    }
    const validateLogin = ({ ...params }) => {
        const { data, next, takeOutPassword } = params
        const { phone, password, captcha } = data
        takeOutPassword((prev: any) => ({ ...prev, password: '', password_confirmation: '' }))
        if (captcha.length === 0) return { error: 'Please check the box' }
        if (!phone.length || !password.length || !captcha.length) return { error: 'All fields are required' }
        if (!phone.match(NUMERIC) || phone.length !== 10 ||
            parseInt(phone.charAt(0)) !== 0) return { error: 'Incorrect credentials' }
        if (!password.match(PASSWORD)) return { error: 'Incorrect credentials' }
        if (password.length < 8) return { error: 'Incorrect credentials' }
        return next()
    }
    const validateEquipment = ({ ...params }) => {
        const { data, next } = params
        const { name, description, system_error, functionality_status, availability_status } = data
        if (!name.length || !description.length) return { error: 'All fields are required' }
        if (!name.match(CSVDOT_HYPHEN)) return { error: 'Unexpected chars found in name' }
        if (name.length < 3 || name.length > 100) return { error: 'Name must be in the range of 3 to 100 chars' }
        if (description.length < 20) return { error: 'Enter a description of at least 20 chars for the equipment' }
        if (!Functionality_Status.some(data => data.value === functionality_status)) return { error: 'Chosen functionality status was rejected' }
        if (!Availability_Status.some(data => data.value === availability_status)) return { error: 'Chosen availability status was rejected' }
        if (functionality_status === 1 && system_error.length < 5) return { error: 'Provide the system errors associated with the equipment' }
        return next()
    }
    const fileValidator = ({ ...params }) => {
        const { data } = params
        if (!data) return { error: 'No file was chosen' }
        if (!SelectableFiles.includes(data.type)) return { error: 'Choose only an image file (jpg, jpeg, png)' }
        if (data.size > 2000000) return { error: 'Choose a photo of size not more than 2MB' }
    }

    return {
        validateRegistration, validateOTP, validateResendOTP, validateLogin,
        validateEquipment, fileValidator
    }
}
export default useValidations