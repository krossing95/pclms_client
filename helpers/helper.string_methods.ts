const StringMethods = () => {
    const textProcessor = (string: string) => {
        let str = string
        str = string.trim().replace('<script>', '').replace('</script>', '')
        return str
    }

    return {
        textProcessor
    }
}

export default StringMethods