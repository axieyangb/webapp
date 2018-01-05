var itemsTable;
var items;
var itemNameList = [];
var selectedItems = [];
function searchByItemName(name) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].ItemName === name) {
            return items[i];
        }
    }
    return null;
}


$(document).ready(function () {
    itemsTable = $('#itemList').DataTable({
        "scrollX": true,
        "columns": [
            { "orderDataType": "dom-text" },
            { "orderDataType": "dom-text", "type": "numeric"  },
            null,
            { "orderDataType": "dom-text", "type": "numeric" },
            { "orderDataType": "dom-text", "type": "numeric" },
            { "orderDataType": "dom-text", "type": "numeric" },
            { "orderDataType": "dom-text", "type": "numeric" }
        ]
    });
    fetchItems();
});


function fetchItems() {
    $.ajax({
        url: "SimCityFetchItems"
    }).done(function (res) {
        items = JSON.parse(res);
        console.log(items);
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            
            itemNameList.push(item.ItemName + "#" + item.ImageName);
            itemsTable.row.add([
                "<a class='btn btn-link' onclick='getBuildPathByItemId("+item.ItemId+")'><img src='/Content/img/gameHelper/simcity/"+item.ImageName+"' />&nbsp;"+item.ItemName+"</a>",
                 item.SellMaxValue,
                getMeterialsRequredStr(item.Components),
                item.RawMeterialsProducingTime,
                item.AssemblyingTime,
                item.TotalTime,
               item.DollarPerMinute
            ]);
        }
        itemsTable.draw();
        activeTypeHead();
    });
}

function activeTypeHead() {
    $('[data-provide="typeahead"]').typeahead({
        source: itemNameList,
        highlighter: function (item) {
            var parts = item.split('#');
            var query = this.query;
            if (!query) {
                return '<div> ' + item + '</div>';
            }
            var reEscQuery = query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            var reQuery = new RegExp('(' + reEscQuery + ')', "gi");
            var jElem = $('<div></div>').html("<img src='/Content/img/gameHelper/simcity/" + parts[1] + "' />&nbsp;" + parts[0]);
            var textNodes = $(jElem.find('*')).add(jElem).contents().filter(function () { return this.nodeType === 3; });
            textNodes.replaceWith(function () {
                return $(this).text().replace(reQuery, '<strong>$1</strong>');
            });

            return jElem.html();
        },
        updater: function (selectedName) {
            var name = selectedName.split('#')[0];
            return name;
        }
    });
    $('#costCalculator').show();
}

function getMeterialsRequredStr(components) {
    var componentListHtml = ''; 
    for (var i = 0; i < components.length; i++) {
        var component = components[i];
        componentListHtml += "<a class='btn-link' onclick='getBuildPathByItemId(" + component.ItemId+")'><img data-componentid='" +
            component.ItemId +
            "' src='/Content/img/gameHelper/simcity/" +
            component.ImageName +
            "' />&nbsp;X" +
            component.Count +
            "</a>, ";
    }
    if (componentListHtml.length === 0) {
        componentListHtml = "N/A";
    } else {
        componentListHtml = componentListHtml.substring(0, componentListHtml.length - 2);
    }
    return componentListHtml;
}


function attachItem() {
    var itemName = $('#selecteditem').val();
    var itemCount = parseInt($('#itemCount').val());
    var searchedItem = searchByItemName(itemName);
    if (searchedItem == null) {
        alert('The item is not existed, try again ?');
        return;
    }
    var block = $('<div class="row justify-content-center itemBlock" data-time="' + searchedItem.TotalTime+'" data-price="' + searchedItem.SellMaxValue + '" data-count="' + itemCount+'"> ' +
        '<div class="col-1 text-right plus">&nbsp;</div>' +
        '  <div class="col-1 text-center" > <span>' + itemCount + '</span></div > ' +
        '<div class="col-1 text-center" ><span>X</span></div > ' +    
        ' </div>');
    var btnBlock = $('<div class="col-2 text-left" ><span class="btn btn-sm btn-info">' +
        '<span class="cursor-pointer" onclick="getBuildPathByItemId('+searchedItem.ItemId+')" ><img src="/Content/img/gameHelper/simcity/' +
        searchedItem.ImageName +
        '" /> &nbsp;' +
        '<span>' +
        searchedItem.ItemName +
        '</span></span>&nbsp;&nbsp;<span class="fa fa-times-circle hover-effect" onclick="dismissCurrentBlock(this)" ></span>' +
        '</div>');
    var priceBlock =
        $('<div class="col-1 text-right" ><img src="/Content/img/gameHelper/simcity/Dollar.png" /> &nbsp;<span>' +
            searchedItem.SellMaxValue +
            '</span></div>');
    var timeBlock =
        $('<div class="col-1 text-right" ><span class="fa fa-clock-o"></span> &nbsp;<span>' +
            searchedItem.TotalTime +
            '&nbsp;min</span></div>');

    block.append(btnBlock);
    block.append(priceBlock);
    block.append(timeBlock);
    $('#selectedItemMenu').append(block);
    refreshCalculator();
}

function refreshCalculator() {
    $('.summaryBlock').show();
    var itemBlocks = $('#selectedItemMenu').children();
    var countTotal = 0;
    var priceTotal = 0;
    var timeTotal = 0;
    for (var i = 0; i < itemBlocks.length; i++) {
        var itemBlock = $(itemBlocks[i]);
        if (i == 0) {
            itemBlock.children('.plus').html('&nbsp;');
        } else {
            itemBlock.children('.plus').html('+');
        }
        var price = parseInt(itemBlock.attr('data-price'));
        var count = parseInt(itemBlock.attr('data-count'));
        var time = parseInt(itemBlock.attr('data-time'));
        timeTotal += time * count;
        priceTotal += price * count;
        countTotal += count;
    }
    $('#totalPrice').html(priceTotal);
    $('#totalCount').html(countTotal);
    $('#totalTime').html(timeTotal);
}

function dismissCurrentBlock(target) {
    $(target).closest('.itemBlock').remove();
    refreshCalculator();
}

function clearItems() {
    $('#selectedItemMenu').children().remove();
    refreshCalculator();
}



function getBuildPathByItemId(itemId) {  
    $.ajax({
        url: 'SimCityFetchPathByItemId',
        data: {
            itemId: itemId
        }
    }).done(function(res) {
        var node = JSON.parse(res);
        console.log(node);
        var grid = generate2DGrid(node);
        console.log(grid);
        $('#buildGrid').html(gridToTable(grid));
        $('#showBuildDetail').modal('show');
    });
}


function gridToTable(grid) {
    var html = '';
    for (var i = 0; i < grid.length; i++) {
        html += '<tr>';
        for (var j = 0; j < grid[i].length; j++) {
            var component = '';
            if (grid[i][j] != null) {
                var item = grid[i][j];
                component += '<span><img src="/Content/img/gameHelper/simcity/' +
                    item.ImageName +
                    '" /></span>' +
                    '<br /><small style="display:inline-flex"><img width="15px" height="15px" src="/Content/img/gameHelper/simcity/Dollar.png" />&nbsp;&nbsp;' + item.SellPrice + '&nbsp;&nbsp; X ' +
                item.Count +'</small><br />' +
                    '<small><span class="fa fa-clock-o"></span>&nbsp;&nbsp;' + item.BuildTime + 'm&nbsp; X ' +
                    item.Count +'</small>';
            }
            html+='<td>'+component+
            '</td>';
        }
        html += '</tr>';
    }

    return html;
}

function generate2DGrid(node) {
    var layers = [];
    buildGrid(node, layers, 0,0);
    return layers;
}

function buildGrid(node, layers, level,offset) {
    if (layers.length == level) {
        layers.push([]);
    }
    var childCnt = 0;
    var currentidx = layers[level].length;
    while (currentidx < offset) {
        layers[level].push(null);
        currentidx++;
    }
    

    for (var i = 0; i < node.Components.length; i++) {
        childCnt += buildGrid(node.Components[i], layers, level + 1, layers[level].length);
    }
    //node.Components = null;
    layers[level].push(node);
   
    while (currentidx < childCnt) {
        layers[level].push(null);
        currentidx++;
    } 
    return childCnt+1;
}