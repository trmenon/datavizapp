const createProductList = ((data, initialYear)=> {
    let graphData = [];
    data.forEach((element)=> {
        if(parseInt(element?.year) === initialYear) {
            const currentIndex = graphData.findIndex((ele)=> ele?.product === element?.product);
            if(currentIndex < 0) {
                graphData.push({
                    product: element?.product,
                    data: [{
                        key: element?.S_no,
                        month: element.month,
                        acv: element?.acv,
                        tcv: element.tcv,
                        revenue: element?.revenue
                    }]
                })
            }else {
                const monthIndex = graphData[currentIndex].data.findIndex((item)=> item.month === element.month);
                if(monthIndex < 0) {
                    graphData[currentIndex] = {
                        ...graphData[currentIndex],
                        data: [
                            ...graphData[currentIndex].data,
                            {
                                key: element?.S_no,
                                month: element.month,
                                acv: element?.acv,
                                tcv: element.tcv,
                                revenue: element?.revenue 
                            }
                        ]
                    }
                }else {
                    graphData[currentIndex].data[monthIndex] = {
                        ...graphData[currentIndex].data[monthIndex],
                        acv: graphData[currentIndex].data[monthIndex].acv + element.acv,
                        tcv: graphData[currentIndex].data[monthIndex].tcv + element.tcv,
                        revenue: graphData[currentIndex].data[monthIndex].revenue + element.revenue,
                    }
                }                
            }
        }
    })

    return graphData;
});

export {
    createProductList
}