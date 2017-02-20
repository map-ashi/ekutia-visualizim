var API_REQUEST_URL_GENERAL_RESULT = 'https://opi.rks-gov.net/api/report/general';
var CYCLE_LENGTH_DAYS = 7;

/**
 * Get the dates needed to define the following ranges:
 *
 *  Latest date range from 1n to today.
 *  Mid date range from 2n to 1n-1.
 *  Oldest data range from 3n to 2n-1.
**/

var today = new Date();

var pastDaysBy1n = new Date();
pastDaysBy1n.setDate(pastDaysBy1n.getDate() - CYCLE_LENGTH_DAYS);

var pastDaysBy1nMin1 = new Date();
pastDaysBy1nMin1.setDate(pastDaysBy1nMin1.getDate() - CYCLE_LENGTH_DAYS - 1);

var pastDaysBy2n = new Date();
pastDaysBy2n.setDate(pastDaysBy2n.getDate() - 2 * CYCLE_LENGTH_DAYS);

var pastDaysBy2nMin1 = new Date();
pastDaysBy2nMin1.setDate(pastDaysBy2nMin1.getDate() - (2 * CYCLE_LENGTH_DAYS) - 1);

var pastDaysBy3n = new Date();
pastDaysBy3n.setDate(pastDaysBy3n.getDate() - 3 * CYCLE_LENGTH_DAYS);


var dateRanges = [
    '?date_fromString=' + pastDaysBy1n.toLocaleDateString('fr-FR') + '&date_toString=' + today.toLocaleDateString('fr-FR'),
    '?date_fromString=' + pastDaysBy2n.toLocaleDateString('fr-FR') + '&date_toString=' + pastDaysBy1nMin1.toLocaleDateString('fr-FR'),
    '?date_fromString=' + pastDaysBy3n.toLocaleDateString('fr-FR') + '&date_toString=' + pastDaysBy2nMin1.toLocaleDateString('fr-FR')
];


// Object containing the requested responses.
// We are making three requests, so three responses.
var data = {
    'first': null,
    'second': null,
    'third': null
};


var institutions = [];
var sortedInstitutions = [];
var services = [];

function onMinistrySelection(instituIndex,institu) {
    $('#dropdown-first .selected-value').html(institu);

    // Render the chart.
    renderChart(institutions[instituIndex]);

    // onServiceSelection(instituIndex,0,0);

    getServicesDropdownListBasedOnMinistry(instituIndex,0,0);
}
function getServicesDropdownListBasedOnMinistry(instituIndex, serviceGroupIndex, serviceIndex){
    $('#dropdown-second .selected-value').html('All Services');

    // console.log(data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['ServiceName_'+lang]);
    $('#dropdown-second .dropdown-menu').html('');
    var services = [];

    $(data['first'][instituIndex]['ServiceGroups']).each(function(serviceGroupIndex){
        $(this['Services']).each(function(serviceIndex,serviceVal) {
            services.push({
                service_id: serviceVal['ID'],
                service_grid: serviceGroupIndex,
                name_AL: serviceVal['ServiceName_AL'],
                name_EN: serviceVal['ServiceName_EN'],
                name_SR: serviceVal['ServiceName_SR'],
                name_TR: serviceVal['ServiceName_TR'],
                happy: [
                    parseFloat(data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex] == undefined ? 0: data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', ''))
                ],
                meh: [
                    parseFloat(data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', ''))
                ],
                unhappy: [
                    parseFloat(data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', ''))
                ],
                happyCount: [
                    data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'],
                    data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'],
                    data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good']
                ],
                mehCount: [
                    data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'],
                    data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'],
                    data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle']
                ],
                unhappyCount: [
                    data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'],
                    data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'],
                    data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad']
                ],
                totalCount: [
                    data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total'],
                    data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total'],
                    data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total']
                ]
            });
        });
    });
    $('#dropdown-second .dropdown-menu').append('<li><a href="javascript:onMinistrySelection(' + instituIndex + ', \'' + data['first'][instituIndex].InstitutionName_+lang + '\')">All Services</a></li>');
    $(services).each(function(i){
        var servID = i;
        var serviceN = services[i].name_AL;
        var serviceGrId = services[i].service_grid;
        // console.log(servID);
        $('#dropdown-second .dropdown-menu').append('<li><a href="javascript:onServiceSelection('+ instituIndex + ', ' + serviceGrId + ', ' + servID + ')">' + serviceN + '</a></li>');
    });
}
function onServiceSelection(instituIndex, serviceGroupIndex, serviceIndex){
    var services = [];
    $('#dropdown-second .selected-value').html(data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['ServiceName_AL']);

    $(data['first'][instituIndex]['ServiceGroups']).each(function(serviceGroupIndex){
        $(this['Services']).each(function(serviceIndex,serviceVal) {
            services.push({
                service_id: serviceVal['ID'],
                service_grid: serviceGroupIndex,
                name_AL: serviceVal['ServiceName_AL'],
                name_EN: serviceVal['ServiceName_EN'],
                name_SR: serviceVal['ServiceName_SR'],
                name_TR: serviceVal['ServiceName_TR'],
                happy: [
                    parseFloat(data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex] == undefined ? 0: data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good_Percentage'].replace('%', ''))
                ],
                meh: [
                    parseFloat(data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle_Percentage'].replace('%', ''))
                ],
                unhappy: [
                    parseFloat(data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad_Percentage'].replace('%', ''))
                ],
                happyCount: [
                    data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'],
                    data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good'],
                    data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Good']
                ],
                mehCount: [
                    data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'],
                    data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle'],
                    data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Middle']
                ],
                unhappyCount: [
                    data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'],
                    data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad'],
                    data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Bad']
                ],
                totalCount: [
                    data['first'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total'],
                    data['second'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total'],
                    data['third'][instituIndex]['ServiceGroups'][serviceGroupIndex]['Services'][serviceIndex]['result_Total']
                ]
            });
        });
    });
    $('#dropdown-second .selected-value').html(services[serviceIndex]['ServiceName_'+lang]);

    renderChart(services[serviceIndex]);
}

function renderChart(data){
    Highcharts.chart('container-barchart', {
        title: {
            text: ''
        },
        xAxis: {
            categories: ["three weeks ago", "two weeks ago", "one week ago"],
            labels: {
                style: {
                    color: 'white'
                }
            }
        },
        yAxis: {
            labels: {
                format: "{value}%",
                style: {
                    color: 'white'
                }
            },
            title: {
                text: ''
            }
        },
        chart:{
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, 'rgb(82, 178, 213)'],
                    [1, 'rgb(65, 118, 173)']
                ]
            }
        },
        labels: {
            items: [{
                html: i18n.answers[lang] + ":",
                style: {
                    left: '50px',
                    top: '0px',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'white'
                }
            }]
        },
        series: [{
            type: 'column',
            name: i18n.dissatisfied[lang],
            data: data.unhappy,
            color: '#ef4241' // Dissatisfied color
        }, {
            type: 'column',
            name: i18n.moderatelySatisfied[lang],
            data: data.meh,
            color: '#fed53e' // Moderately satisfied colors
        }, {
            type: 'column',
            name: i18n.satisfied[lang],
            data: data.happy,
            color: '#87c441' // Satisfied color
        }/**, {
            type: 'spline',
            name: 'Average',
            data: [3, 2.67, 3],
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[3],
                fillColor: 'white'
            }
        }**/,{
            type: 'pie',
            name: i18n.answers[lang],
            data: [{
                name: i18n.dissatisfied[lang],
                y: data.unhappyCount.reduce(function(a, b) { return a + b; }, 0),
                color: '#ef4241' // Dissatisfied color
            }, {
                name: i18n.moderatelySatisfied[lang],
                y: data.mehCount.reduce(function(a, b) { return a + b; }, 0),
                color: '#fed53e' // Moderately satisfied colors
            }, {
                name: i18n.satisfied[lang],
                y: data.happyCount.reduce(function(a, b) { return a + b; }, 0),
                color: '#87c441' // Satisfied color
            }],
            center: [100, 60],
            size: 120,
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    });
}


$(function() {
    // Set link to trends with selected language
    if(urlLangParam == null){
        urlLangParam = 'sq';
    }
    $('.navbar-brand').attr('href', document.location.pathname.replace('/trends/', '/') + '?lang=' + urlLangParam);
    $('#lnk-visualizer').attr('href', document.location.pathname.replace('/trends/', '/') + '?lang=' + urlLangParam);
    $('#lnk-ranking').attr('href', document.location.pathname.replace('/trends/', '/ranking') + '?lang=' + urlLangParam);

    $.when(
        // Deferred requests
        $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[0], function (rsp) {
            data['third'] = rsp;
        }),

        $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[1], function (rsp) {
            data['second'] = rsp;
        }),

        $.getJSON(API_REQUEST_URL_GENERAL_RESULT + dateRanges[2], function (rsp) {
            data['first'] = rsp;
        })
    ).then(function() {
        // TODO: Account for case when at least on of the deferred request fails

        // All requests have been resolved (or rejected),

        // Build institutions list
        $.each(data['first'], function(idx, val){
            institutions.push({
                institution_id: val['ID'],
                name_AL: val['InstitutionName_AL'],
                name_EN: val['InstitutionName_EN'],
                name_SR: val['InstitutionName_SR'],
                name_TR: val['InstitutionName_TR'],
                happy: [
                    parseFloat(data['first'][idx]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data['second'][idx]['result_Good_Percentage'].replace('%', '')),
                    parseFloat(data['third'][idx]['result_Good_Percentage'].replace('%', ''))
                ],
                meh: [
                    parseFloat(data['first'][idx]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data['second'][idx]['result_Middle_Percentage'].replace('%', '')),
                    parseFloat(data['third'][idx]['result_Middle_Percentage'].replace('%', ''))
                ],
                unhappy: [
                    parseFloat(data['first'][idx]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data['second'][idx]['result_Bad_Percentage'].replace('%', '')),
                    parseFloat(data['third'][idx]['result_Bad_Percentage'].replace('%', ''))
                ],
                happyCount: [
                    data['first'][idx]['result_Good'],
                    data['second'][idx]['result_Good'],
                    data['third'][idx]['result_Good']
                ],
                mehCount: [
                    data['first'][idx]['result_Middle'],
                    data['second'][idx]['result_Middle'],
                    data['third'][idx]['result_Middle']
                ],
                unhappyCount: [
                    data['first'][idx]['result_Bad'],
                    data['second'][idx]['result_Bad'],
                    data['third'][idx]['result_Bad']
                ],
                totalCount: [
                    data['first'][idx]['result_Total'],
                    data['second'][idx]['result_Total'],
                    data['third'][idx]['result_Total']
                ]
            });
        });



        $.each( data['first'], function( key, val ) {
            sortedInstitutions.push({id:key, instit:val['InstitutionName_' + lang]});
        });
        // console.log(sortedInstitutions[0]);
        // console.log(sortedInstitutions[0].instit);
        // // TODO: Build services list

        onMinistrySelection(sortedInstitutions[0].id,sortedInstitutions[0].instit);
        $.each(institutions, function(i) {
            var institu = sortedInstitutions[i].instit;
            var instituIndex = sortedInstitutions[i].id;
            $('#dropdown-first .dropdown-menu').append('<li><a href="javascript:onMinistrySelection(' + instituIndex + ', \'' + institu + '\')">' + institu + '</a></li>');
        })

        // Hide gif loader animation.
        $('.overllay').hide();
    });
});
