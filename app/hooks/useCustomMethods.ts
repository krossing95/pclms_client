const useCustomMethods = () => {
    const preventCopyPaste = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()
        return false
    }

    return {
        preventCopyPaste
    }
}
export default useCustomMethods