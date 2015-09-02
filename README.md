# gmapsruler.js
Native JS plugin for distance measurements on a Google map - v0.0.1

*	How it works:
	*	draw the line by left-clicking the map
	*	each line segment is measured using Haversine formula, and total distance is calculated
	*	the output is appended to DOM container of your choice
	*	drag the existing vertices the edit the line and right-click to delete
	*	profit!

*	How to implement:
	*	include gmapsruler.js after your Google Maps API link
	*	initialize GmapsRuler instance
	*	bind start and end method to some button and enjoy

## Class constructor

```javascript		
ruler = new GmapsRuler(domID,mapReference,unit);
```

Parameter name | Type | Description
------------- | ------------- | -------------
domID  | String | DOM Id of the node that will include the segments' length and the total length.
mapReference | Object | reference to Google Map object for binding the click events.
unit | String | Unit for distance calculation. Can be "miles", "km", "kilometers", "m" and "meters". Defines the formula coefficient and is added to the HTML output for the total amount.

## Methods

Method | Description
------------- | -------------
start | start measurement
end | end mesurement

## CSS selectors
("gmapsruler" will be replaced by your domID parameter)

Selector | Description
------------- | -------------
#gmapsruler | Main container where the new length records are appended
.gmapsruler-record | row with the individual segement's length
#gmapsruler_total | row with total length at the bottom
