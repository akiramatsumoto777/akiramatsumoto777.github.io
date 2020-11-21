$(function() {

  $("#open-chart-dialog").on("click", function () {
    //leftの値 = (ウィンドウ幅 -コンテンツ幅) ÷ 2
    var leftPosition = (($(window).width() - $("#chart-dialog").outerWidth(true)) / 2);
    $("#chart-dialog").css({ "left": leftPosition + "px" });
    $("#chart-dialog").show();
  });
  $(".dialog-close").on("click", function () {
    $(this).parents(".dialog").hide();
  });

  drowChart();

});

function drowChart() {
    var ctx = document.getElementById("chartCanvas");
    var chartCanvas = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:25', '00:30', '00:35', '00:40', '00:45', '00:50', '00:55', '01:00',],
        datasets: [
          {
            label: 'loss',
            data: [10, 12, 13, 15, 11, 15, 15, 16],
            borderColor: "rgba(255,0,0,1)",
            backgroundColor: "rgba(0,0,0,0)"
          },
        ],
      },
      options: {
        title: {
          display: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMax: 40,
              suggestedMin: 0,
              stepSize: 10,
              callback: function (value, index, values) {
                return value + '%'
              }
            }
          }]
        },
      }
    });
};