//variables
var grossCBM = 0 , grossCost = 0;

//SKU ARRAY
var skuArray = new Array;

//ADD ROW FUNCTION

$(document).ready(function(){
	grossCBM = parseFloat($("#grossCBM").val());
	grossCost = parseFloat($("#grossCost").val()); 
//INITIALIZING SKU ARRAY
	$('#ledger').find('tbody').find('tr:not(:first-child)').each(function () {
		skuArray.push($(this).find('td:eq(1)').text());        
	});
	console.log(skuArray.toString());

	$( function() {
		$("#shipDate").datepicker({ dateFormat: "yy-mm-dd" }).val();
	});
	$( function() {
		$("#poDate").datepicker({ dateFormat: "yy-mm-dd" }).val();
	});
	$('#supplier').on('change', function() 
	{
		loadSupplier();
	});
	$('#sku1').on('change', function() 
	{
		getNameCBMCost();
		if($("#qty1").val()){
			var cbm = parseFloat($("#cbm1").val());
			var cost = parseFloat($("#cost1").html());
			var qty = parseInt($("#qty1").val());
			cbm *= qty;
			cost *= qty;
			$('#netCost1').val(cost.toFixed(2));
			$('#netCBM1').val(cbm.toFixed(3));
			$('#netCost1').html(cost.toFixed(2));
			$('#netCBM1').html(cbm.toFixed(3));
		}
	});
	$('#qty1').on('keyup', function() 
	{
		if($("#sku1").val()){
			var cbm = parseFloat($("#cbm1").val());
			var cost = parseFloat($("#cost1").html());
			var qty = parseInt($("#qty1").val());
			cbm *= qty;
			cost *= qty;
			$('#netCost1').val(cost.toFixed(2));
			$('#netCBM1').val(cbm.toFixed(3));
			$('#netCost1').html(cost.toFixed(2));
			$('#netCBM1').html(cbm.toFixed(3));
		}
	});
	$("#refreshPage").click(function(){
		window.location.reload();
	});

//ADD ROW

	$("#addRow").click(function(){
		if($("#sku1").val() && $("#qty1").val())
		{
			//sku
			var sku = $("#sku1").val();		
			//prodName
			var prodName = $("#prodName1").val();
			//cbm
			var cbm = parseFloat($("#netCBM1").val());
			//qty
			var qty = parseInt($("#qty1").val());
			//cost
			var cost = parseFloat($("#cost1").html());
			//netCost
			var netCost = parseFloat($("#netCost1").val());
//SKU ERROR CHECK
			if(indexSKU(sku) > -1){
				alert("SKU: " + sku + " is already on order.");
			}else{
				//add to sku check array
				grossCBM += cbm;
				grossCost += netCost;
				skuArray.push(sku);
				//markup
				var markup = "<tr><td width=10%><input type='checkbox' name='record' size='1'></td>";
				markup += "<td width=10%><input type='hidden' size='1' name='sku' id='sku' value='" + sku + "'>"+sku+"</td>";
				markup += "<td width=40%>" + prodName + "</td>";
				markup += "<td width=10%><input type='hidden' name ='netCBM' size='1' value='" + cbm.toFixed(3) + "' />"+cbm.toFixed(3)+"</td>";
				markup += "<td width=10%><input type='hidden' name='qty' id='qty' size='1' value='" + qty + "'>"+qty+"</td>";
				markup += "<td width=10%><input type='hidden' name='cost' id='cost' size='1' value='" + cost.toFixed(2) + "'>"+cost.toFixed(2)+"</td>";
				markup += "<td width=10%><input type='hidden' name='netCost' size='1' value='"+ netCost.toFixed(2) +"'>"+netCost.toFixed(2)+"</td></tr>";
						$("#ledger").append(markup);

				$("#grossCBM").val(grossCBM.toFixed(3));
				$("#grossCost").val(grossCost.toFixed(2));
				$("#cost1").html("");
				$("#cbm1").val("");
				$("#prodName1").val("");
				$("#netCBM1").val("");	
				$("#netCost1").val("");
				$("#qty1").val("");
				$("#sku1").val("");

				$("#cbm1").html("");
				$("#prodName1").html("");
				$("#netCBM1").html("");	
				$("#netCost1").html("");

			}
		}else{
			alert("Are you retarded? Fill in SKU and Quantity");
		}
    });
	//DELETE ROW FUNCTION
	$("#deleteRow").click(function(){
		$("table tbody").find('input[name="record"]').each(function(){
			if($(this).is(":checked")){
				var nCBM = parseFloat($(this).parents('tr').find('td:eq(3)').text());
				var nCost = parseFloat($(this).parents('tr').find('td:eq(6)').text());
				var sku = $(this).parents('tr').find('td:eq(1)').text();
				$(this).parents("tr").remove();
				//remove elements @ sku
				var index = indexSKU(sku);
				if (index > -1) {
					skuArray.splice(index, 1);
				}
				grossCBM -= nCBM;
				grossCost -= nCost;
				$("#grossCBM").val(grossCBM.toFixed(3));
				$("#grossCost").val(grossCost.toFixed(2));
			}
		});
	});
});

//ERROR CHECK SKU
function indexSKU(skuVal) {  
  str =  "";  
  for (var i = 0; i < skuArray.length; i++) {
      str += i +",";
      if (skuArray[i] == skuVal) {
          return i;
      }
  }
  return -1;
}  
//FORM SUBMIT
function formSubmit(){
	if($("#supplier").val() && $("#poNumb").val() && $("#shipDate").val()){
		var skuArr = new Array, qtyArr = new Array, costArr = new Array;
		$('#ledger').find('tbody').find('tr:not(:first-child)').each(function () {
			skuArr.push($(this).find('td:eq(1)').text()); 
			qtyArr.push(parseFloat($(this).find('td:eq(4)').text())); 
			costArr.push(parseFloat($(this).find('td:eq(5)').text()));               
		});
		var supplier = $("#supplier").val();
		var poNumb = $("#poNumb").val();
		var ogPONumb = $("#ogPONumb").val();
		var shipDate = $("#shipDate").val();
		var grossCBM = $("#grossCBM").val();
		var grossCost = $("#grossCost").val();
		var poDate = $("#poDate").val();
		var status = $("#status").val();
		if (confirm("Are you sure these values are correct?")) {
			$.ajax({
				method: 'POST',
				data:{'skuArr' : skuArr, 
						'qtyArr' : qtyArr, 
						'costArr' : costArr,
						'grossCost' : grossCost,
						'grossCBM' : grossCBM,
						'supplier' : supplier,
						'shipDate' : shipDate,
						'ogPONumb' : ogPONumb,
						'poNumb' : poNumb,
						'poDate' : poDate,
						'status' : status
				},
				url: 'editDetails.php',
				success: function (response) {
					console.log(response);
					alert("PO Updated");
					window.location = "/purchaseOrders.php";
				},
				error: function(){
					alert("No Bueno");
				}
			});
		}
	}else{
		alert("Supplier, poNumb, and/or Ship Date - need to be set");
	}
}
function loadSupplier(){
	var supplier = $("#supplier").val();
	$.ajax({
		method: 'POST',
		data:{'supplier' : supplier},
		url: '../functions/getSupplier.php',
		success: function (response) {
			$("#supplierDisplay").html(response);
		},
		error: function(){
			alert("No Bueno");
		}
	});
}
function getNameCBMCost(){
	var sku = $("#sku1").val();
	$.ajax({
		method: 'POST',
		data:{'sku' : sku},
		url: '../functions/getNameCBMCost.php',
		success: function (response) {
			var array = response.split(',');
			var prodName = array[0];
			var cbm = parseFloat(array[1]);
			var cost = parseFloat(array[2]);

			$("#prodName1").val(prodName);
			$("#prodName1").html(prodName);
			$("#cbm1").val(cbm.toFixed(3));
			$("#cbm1").html(cbm.toFixed(3));
			$("#cost1").html(cost.toFixed(2));

			if($("#qty1").val())
			{
				qty = parseInt($("#qty1").val());
				$("#netCBM1").val((cbm*qty).toFixed(3));
				$("#netCBM1").html((cbm*qty).toFixed(3));
				$("#netCost1").val((cost*qty).toFixed(2));
			}
		},
		error: function(){
			alert("No Bueno");
		}
	});
}
