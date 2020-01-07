formatData([], [
    {id: 1, viewDate1: '2019-11-18'},
    {id: 2, viewDate1: '2019-11-18'},
    {id: 3, viewDate1: '2019-11-18'},
    {id: 4, viewDate1: '2019-11-18'},
    {id: 5, viewDate1: '2019-11-12'},
    {id: 6, viewDate1: '2019-11-11'},
]);

function formatData(data, insertData) {
    const oldData = [...data];
    for (let i = 0; i < insertData.length; i++) {
        const lastItem = oldData.length > 0 ? oldData[oldData.length - 1] : {viewDate1: '0000-00-00'};
        const lastViewDate1 = lastItem.viewDate1;
        const newitem = insertData[i];
        const newViewDate1 = newitem.viewDate1;
        if (lastViewDate1.substring(0, 10) == newViewDate1.substring(0, 10)) {
            oldData.push(newitem);
        } else {
            oldData.push({time: newViewDate1.substring(0, 10)});
            oldData.push(newitem);
        }
    }
    return oldData;
};