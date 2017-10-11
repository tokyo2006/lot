module.exports = chartData

function chartData (length, list, item, placeholder) {
    var i;
    var newList = [];
    if (!list || list.length === 0) {
        for (i = 0; i < length - 1; i++) {
            newList.push(placeholder)
        }
        newList.push(item);
        return newList
    }

    for (i = 0; i < length -1; i++) {
        newList.push(list[i+1])
    }
    newList.push(item);
    return newList
}
