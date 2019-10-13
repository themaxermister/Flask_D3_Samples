// Allows you to control how many tasks run at the same time
    //  When all the tasks complete, or an error occurs, the queue passes the results to your await callback
    // Loading our javascript libraries using queue
queue()
.defer(d3.json, piechartDataUrl)
.defer(d3.json, barchartDataUrl)
.await(ready);

// Once all libraries are loaded, call d3PieChart function to render all the charts we have coded.
function ready(error, dataset, datasetBarChart) {
    d3PieChart(dataset, datasetBarChart);
    d3BarChart(datasetBarChart);
}