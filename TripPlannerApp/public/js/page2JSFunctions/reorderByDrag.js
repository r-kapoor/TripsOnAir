/**
 * @author rajat
 * Drag and Drop cities to change their order
 */


$(document).ready(function(){
$(".citiesOrder").droppable({
  addClasses: false,
  appendTo: "body",
  activeClass: "listActive",
  helper: "clone"
}).sortable({
	items: ".source",
	axis: "x",
	//cursor: "move",
	  sort: function() {
	    $(this).removeClass("listActive");
	  },
	update: function() {
    updateValues();
  }

});
 
function updateValues()
{
	if($("#reorderWarning"))
	{
		$("#reorderWarning").remove();
	}
	var cityID1 = "";
	var cityID2 = "";
	var weightOfCurrentOrder = 0;
	//var weight = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	$("ul.citiesOrder").children().each(function() {
		if(cityID1 == "")
		{
			cityID1 = $(this).attr('id');
		}
		else
		{
			cityID2 = $(this).attr('id');
			weightOfCurrentOrder += weight[cityIDs.indexOf(cityID1)][cityIDs.indexOf(cityID2)];
			cityID1 = cityID2;
		}
	});
	console.log("Weight After Reorder:"+weightOfCurrentOrder);
	console.log("Min Weight:"+minWeight);
	if(weightOfCurrentOrder > minWeight*1.5)
	{
	    var reorderWarning='<h4 id="reorderWarning">The current order of cities is not recommnded as it may require an increase in budget or duration.</h4>';
	    $(reorderWarning).appendTo("#placesOrder");
	}
	/*var items = [];
    $("ul.citiesOrder").children().each(function() {
      var item = $(this).text();
      items.push(item);
    });
    return items;*/
}


/*$(".target").droppable({
  addClasses: false,
  activeClass: "listActive",
  accept: ":not(.ui-sortable-helper)",
  drop: function(event, ui) {
    $(this).find(".placeholder").remove();
    var link = $("<a href='#' class='dismiss'>x</a>");
    var list = $("<li></li>").text(ui.draggable.text());
    $(list).append(link);
    $(list).appendTo(this);
    //updateValues();
  }
}).sortable({
  items: "li:not(.placeholder)",
  sort: function() {
    $(this).removeClass("listActive");
  },
  update: function() {
    //updateValues();
  }
}).on("click", ".dismiss", function(event) {
  event.preventDefault();
  $(this).parent().remove();
  //updateValues();
});*/
});