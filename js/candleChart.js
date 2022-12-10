var chartContainer = document.getElementById( 'tradingviewContainer' );

const chart = LightweightCharts.createChart( chartContainer );

var greenColor = "#4bffb5";
var redColor = "#ff4976";

const candlestickSeries = chart.addCandlestickSeries({
	downColor: redColor,
	upColor: greenColor,
	borderUpColor: greenColor,
	borderDownColor: redColor,
	wickDownColor: "#838ca1",
	wickUpColor: "#838ca1"
});

candlestickSeries.applyOptions({ priceFormat: { type: 'price', precision: 10, minMove: 0.0000000001 } });
chart.applyOptions({ crosshair: { mode: LightweightCharts.CrosshairMode.Normal } });

candlestickSeries.applyOptions({ color: '#2962FF' });

chart.applyOptions({

	layout: { backgroundColor: "#1c283d", textColor: "#DDDDDD" },
	grid: { vertLines: { color: "#334158" }, horzLines: { color: "#334158" } },
	priceScale: { borderColor: "#485c7b" },
	timeScale: { borderColor: "#485158", timeVisible: true, secondsVisible: false }

 });

var currentChartData = [];

var resizeChart = function() {

	chart.resize( window.innerWidth * 0.92, window.innerHeight * 0.88 );

}

async function initChart() {

	window.addEventListener( 'resize', resizeChart );

	resizeChart();

	await getAllQuipuStorageHistory();

	var tickData = await getPriceHistoryFromStorageHistory();

	var candles = convertToCandle( tickData );

	currentChartData = candles;

	candlestickSeries.setData( candles );

	chart.timeScale().fitContent();

	await updateChartLoop();

}

async function updateChart() {

	await updateQuipuStorageHistory();

	var tickData = await getPriceHistoryFromStorageHistory();

	tickData.reverse(); // BECAUSE APEXCHARTS ( LINECHART ) NEEDS A REVERSE ORDER AT UPDATE, SO WE HAVE TO RE_REVERSE IT

	var candles = convertToCandle( tickData );

	var lastCandle = candles[candles.length-1];

	for ( var i = 0; i < candles.length; i++ ) {

		if ( candles[i].time >= lastCandle.time ) {

			candlestickSeries.update( candles[i] );

		}

	}

	currentChartData = candles;

}

async function updateChartLoop() {

	updateChart();

	await sleep();

	await updateChartLoop();

}

initChart();