export const pluralize = (len, word) => `${word}${len !== 1 ? 's' : ''}`
export const formatStringFor = (components, styles) => {
    const cLength = components.length
    const sLength = styles.length

    let outputString = ''

    if (cLength > 0 || sLength > 0) {
        if (cLength > 0) {
            outputString += `**${cLength}** ${pluralize(cLength, 'component')}`
        }
        if (cLength > 0 && sLength > 0) {
            outputString += ' and '
        }
        if (sLength > 0) {
            outputString += `**${sLength}** ${pluralize(sLength, 'style')}`
        }
    }
    return outputString
}
