
//Game options
var framerate 	= 10;
var gColumns 	= 60;
var gRows 		= 140;
var tileWidth 	= 12;
var paused 		= true;
var deleteMode 	= false;

//Canvas properties
var canvas_width  = gRows * tileWidth;
var canvas_height = gColumns * tileWidth;


//Tiles in game of life
var tiles = {
	tiles     : [...Array(gRows)].map( x => Array(gColumns).fill(0) ),	 //<< x*y array with all values set to zero
	tempTiles : [...Array(gRows)].map( x => Array(gColumns).fill(0) ),	 //<< same as above
	
	//One iteration of game of life
	iterate : function() {
		myGameArea.clear(); //Remove graphics
		
		//Create temporary 2D array of new values
		for(var x=0; x<gRows; x++)
			for(var y=0; y<gColumns; y++){
				if(![2,3].includes(this.getNeighbors(x,y))
					this.tempTiles[x][y] = 0; 				//cell dies if number of neighbors are not 2 or 3
				else if(this.getNeighbors(x,y) == 3)
					this.tempTiles[x][y] = 1; 				//cell is born if there are exactly 3 neighbors
				else 
					this.tempTiles[x][y] = this.tiles[x][y];//cell remains unchanged otherwise
																						   
				//Draw new graphics
				if(this.tempTiles[x][y] == 1){
					drawCell(x, y);
				}
			}
		
		//Replace old values with new values
		for(var x=0; x<gRows; x++)
			for(var y=0; y<gColumns; y++)
				this.tiles[x][y] = this.tempTiles[x][y];
	},
	
	//returns number of neighboring cells for cell at position x, y
	getNeighbors : function(x, y) {
		let neighbors = 0;
		
		if(x != 0){
			if(y != 0) 			 neighbors += this.tiles[x-1][y-1];
								 neighbors += this.tiles[x-1][y  ];
			if(y < gColumns-1) 	 neighbors += this.tiles[x-1][y+1];
		}
		if(y != 0) 			 	 neighbors += this.tiles[x]  [y-1];
		if(y < gColumns) 	 	 neighbors += this.tiles[x]  [y+1];
		if(x < gRows-1){
			if(y != 0) 			 neighbors += this.tiles[x+1][y-1];
								 neighbors += this.tiles[x+1][y  ];
			if(y < gColumns-1) 	 neighbors += this.tiles[x+1][y+1];
		}
		
		return neighbors;
	},
	
	//Sets all cells to zero
	clear: function() {
		this.tiles = [...Array(gRows)].map( x => Array(gColumns).fill(0) );	 //<< x*y array with all values set to zero
	}
}

//Initializes canvas and event listeners (starts when HTML has loaded)
function startGame() {
    myGameArea.start();
	
	myGameArea.canvas.onclick = function(e) { //<< Mouse click event listener
		//outer edges of tiles is set to 0 to simplify neighbor calculation code
		//therefore we use x+1 and y+1
		var x = Math.floor(e.offsetX/tileWidth);
		var y = Math.floor(e.offsetY/tileWidth);
		
		if(!deleteMode){
			tiles.tiles[x][y] = 1;
			drawCell(x, y);
		}else{
			tiles.tiles[x][y] = 0;
			unDrawCell(x, y);
		}
		
		//output some info to console
		console.log("coords: ", x, y);
		console.log("neighbors: ", tiles.getNeighbors(x+1, y+1) );
	}
}

//HTML5 canvas
var myGameArea = {
    canvas : document.createElement("canvas"),
	
    start : function() {
        this.canvas.width = canvas_width;
        this.canvas.height = canvas_height;
		this.canvas.style.position = "absolute";
		this.canvas.style.top  = "100px"; 
		this.canvas.style.left = "100px";
		
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 1000/framerate);
		drawGrid(gColumns, gRows, tileWidth);
    },
		
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		drawGrid(gColumns, gRows);
    }
}

//Fill one tile in grid with color
function drawCell(x, y) {
	ctx = myGameArea.context;
	ctx.fillStyle = "#ff0000";
	ctx.fillRect(x*tileWidth, y*tileWidth, tileWidth, tileWidth);
	drawGrid(tiles.columns, tiles.rows, tileWidth);
}

//Remove graphics from tile in grid
function unDrawCell(x, y) {
	ctx = myGameArea.context;
	ctx.fillStyle = "#ffffff";
	ctx.clearRect(x*tileWidth, y*tileWidth, tileWidth, tileWidth);
	drawGrid(tiles.columns, tiles.rows, tileWidth);
}

//Display grid on screen
function drawGrid(columns, rows, size){
	//Style parameters
	ctx = myGameArea.context;
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#7F7F7F";
	
	//By adding 0.5 we go from 2px width to 1px width
	for(var i=1; i<=columns; i++){
		ctx.moveTo(0, 			 i*size+0.5);
		ctx.lineTo(canvas_width, i*size+0.5);
		ctx.stroke();
	}
	
	for(var i=1; i<=rows; i++){
		ctx.moveTo(i*size+0.5, 0);
		ctx.lineTo(i*size+0.5, canvas_height);
		ctx.stroke();
	}
}

//Toggles between eraser and pencil
function toggleDrawMode(){
	deleteMode = !deleteMode;
	if(deleteMode){
		document.getElementById("drawModeEnabled").innerHTML = "You are erasing";
	}else{
		document.getElementById("drawModeEnabled").innerHTML = "You are drawing";
	}
}

//Set all cells to zero and removes graphics
function clearCells(){
	console.log("attempting to clear cells");
	tiles.clear();
	myGameArea.clear();
}

//Toggles pause and updates text on screen
function togglePause(){
	paused = !paused;
	
	if(paused){
		document.getElementById("gameIsPaused").innerHTML = "You are paused";
	}else{
		document.getElementById("gameIsPaused").innerHTML = "You are unpaused";
	}
}

//This function runs every frame
function updateGameArea() {	
	if(!paused){
		myGameArea.frameNo += 1;
		tiles.iterate();
		drawGrid(gColumns, gRows);
	}
}