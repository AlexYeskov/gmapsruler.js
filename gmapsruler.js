var GmapsRuler = function(domID,unit) {
	
	this.vertices = [];
	this.edges = [];
	this.distances = [];
	this.unit = unit;
	this.totalDist ='0 '+unit;
	this.domID = domID;
};

function getDistance(marker1,marker2,unit) {
	return distance(
		marker1.getPosition().lat(),
		marker1.getPosition().lng(),
		marker2.getPosition().lat(),
		marker2.getPosition().lng(),
		unit
	);
}

function distance(lat1,lon1,lat2,lon2,unit) {
    var R;
    if (unit=='miles')
    	R = 3961;
    else if (unit=='km'||unit=='kilometers'||unit=='m'||unit=='meters')
    	R = 6371;
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180; 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return formatDistance(d,unit);
};

function formatDistance(d,unit) {

	if (unit=='miles'||unit=='km'||unit=='kilometers')
		return (Math.round(d*100)/100).toFixed(2);
	else if (unit=='m'||unit=='meters')
		return Math.round(d*1000);
};

GmapsRuler.prototype.start = function() {
		
	this.end();
	
	var thisRuler = this;
	
	document.getElementById(thisRuler.domID+'_records').innerHTML = '';
	document.getElementById(thisRuler.domID+'_total').innerHTML = '<b>Total length:</b> '+thisRuler.totalDist;
	
	document.getElementById(thisRuler.domID+'_c').style.display = 'block';
	
	google.maps.event.addListener(map, 'click', function(e) {
		
		var newVertice = new google.maps.Marker({
			position: e.latLng,
	        map: map,
	        icon: {
		    	path: google.maps.SymbolPath.CIRCLE,
		   		scale: 5
		    },
	        draggable: true,
	        zIndex: 100000000
		});

		thisRuler.vertices.push(newVertice);
			
		if (thisRuler.vertices.length>1) {
			
			var newEdge = new google.maps.Polyline({
		    	path: [
		    		thisRuler.vertices[thisRuler.vertices.indexOf(newVertice)-1].position,
		    		thisRuler.vertices[thisRuler.vertices.indexOf(newVertice)].position
		    		],
				map: map,
		        strokeColor: "#FF0000",
		        strokeOpacity: 0.7,
		        strokeWeight: 3,
	       		zIndex: 100000000,
		        len: getDistance(thisRuler.vertices[thisRuler.vertices.indexOf(newVertice)-1], thisRuler.vertices[thisRuler.vertices.indexOf(newVertice)], thisRuler.unit)
		    });
		    
			thisRuler.edges.push(newEdge);
			thisRuler.distances.push(newEdge.len);
			
			document.getElementById(thisRuler.domID+'_records').innerHTML += '<div class="tool-record text-right">'+newEdge.len+'</div>';
		}
		
	    thisRuler.recount();
	    
	    document.getElementById(thisRuler.domID+'_total').innerHTML = '<b>Total length:</b> '+thisRuler.totalDist;
	    
	});
};

GmapsRuler.prototype.end = function() {
	
	google.maps.event.clearListeners(map, 'click');
	
	for (i in this.vertices) {
		this.vertices[i].setMap(null);
	}
	for (i in this.edges) {
		this.edges[i].setMap(null);
	}
	this.vertices = [];
	this.edges = [];
	this.distances = [];
	this.totalDist ='0 '+this.unit;
	
	document.getElementById(this.domID+'_c').style.display = 'block';
}

GmapsRuler.prototype.recount = function() {
	
	thisRuler = this;
	
	var total = 0;
	
	document.getElementById(thisRuler.domID+'_records').innerHTML = '';
	
	for (i in this.distances) {
		
		document.getElementById(thisRuler.domID+'_records').innerHTML += '<div class="tool-record text-right">'+this.distances[i]+'</div>';
		var thisDist;
		thisDist=parseFloat(this.distances[i]);
		total = total+thisDist;
	}

	this.totalDist = (Math.round(d=total*100)/100).toFixed(2)+' '+this.unit;

	document.getElementById(thisRuler.domID+'_total').innerHTML = '<b>Total length:</b> '+thisRuler.totalDist;
	
	for (var i=0; i<this.vertices.length; i++) {
			
		var thisVertice = this.vertices[i];
		
		(function(i,thisVertice){
			
			google.maps.event.clearListeners(thisVertice, 'drag');
			google.maps.event.clearListeners(thisVertice, 'dragend');
			google.maps.event.clearListeners(thisVertice, 'rightclick');
			google.maps.event.clearListeners(thisVertice, 'mouseover');
			google.maps.event.clearListeners(thisVertice, 'mouseout');
								
			google.maps.event.addListener(thisVertice, 'drag', function() {
				
				if (thisRuler.edges[thisRuler.vertices.indexOf(thisVertice)-1]!=undefined&&thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)-1]!=undefined) {
					thisRuler.edges[thisRuler.vertices.indexOf(thisVertice)-1].setPath([thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)-1].position, thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)].position]);
					thisRuler.edges[thisRuler.vertices.indexOf(thisVertice)-1].len = getDistance(thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)-1], thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)], thisRuler.unit);
					thisRuler.distances[thisRuler.vertices.indexOf(thisVertice)-1] = thisRuler.edges[thisRuler.vertices.indexOf(thisVertice)-1].len;
				}
	    			
	    		if (thisRuler.edges[thisRuler.vertices.indexOf(thisVertice)]!=undefined&&thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)+1]!=undefined) {
	    			thisRuler.edges[thisRuler.vertices.indexOf(thisVertice)].setPath([thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)].position, thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)+1].position]);
	    			thisRuler.edges[thisRuler.vertices.indexOf(thisVertice)].len = getDistance(thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)], thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)+1], thisRuler.unit);
	    			thisRuler.distances[thisRuler.vertices.indexOf(thisVertice)] = thisRuler.edges[thisRuler.vertices.indexOf(thisVertice)].len;
	    		}
	    		
	    		thisVertice.setIcon({
			    	path: google.maps.SymbolPath.CIRCLE,
			   		scale: 6
		    	});
		    	
	    		thisRuler.recount();
		    });
		    
		    google.maps.event.addListener(thisVertice, 'dragend', function() {
		    	
		    	thisVertice.setIcon({
			    	path: google.maps.SymbolPath.CIRCLE,
			   		scale: 5
		    	});
		    });
		    
		    google.maps.event.addListener(thisVertice, 'rightclick', function() {
		    		   
		    	if (thisRuler.vertices.indexOf(thisVertice)!=0) {
		    		if (thisRuler.vertices.indexOf(thisVertice)<thisRuler.vertices.length-1) {
			    		thisRuler.edges[thisRuler.vertices.indexOf(thisVertice)].setPath([
				    		thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)-1].getPosition(),
				    		thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)+1].getPosition(),
				    	]);
				    	thisRuler.distances[thisRuler.vertices.indexOf(thisVertice)]=getDistance(
				    		thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)-1],
				    		thisRuler.vertices[thisRuler.vertices.indexOf(thisVertice)+1],
				    		thisRuler.unit
				    	);
			    	}
			    	thisRuler.edges[thisRuler.vertices.indexOf(thisVertice)-1].setMap(null);
			    	thisRuler.edges.splice(thisRuler.vertices.indexOf(thisVertice)-1,1);
			    	thisRuler.distances.splice(thisRuler.vertices.indexOf(thisVertice)-1,1);
		    	} else {
		    		thisRuler.edges[0].setMap(null);
			    	thisRuler.edges.splice(0,1);
			    	thisRuler.distances.splice(0,1);
		    	}
		    	thisRuler.recount();
		    	thisVertice.setMap(null);
		    	thisRuler.vertices.splice(thisRuler.vertices.indexOf(thisVertice),1);
		    	
		    });
		    
		    google.maps.event.addListener(thisVertice, 'mouseover', function() {
		    	
		    	thisVertice.setIcon({
			    	path: google.maps.SymbolPath.CIRCLE,
			   		scale: 6
		    	});
		    });
		    
		    google.maps.event.addListener(thisVertice, 'mouseout', function() {
		    	
		    	thisVertice.setIcon({
			    	path: google.maps.SymbolPath.CIRCLE,
			   		scale: 5
		    	});
		    });
		    
		}) (i,thisVertice);
		
	}
};