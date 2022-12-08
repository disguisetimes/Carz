<?php
	chdir(getcwd() . "/../..");	
	
	function startsWith($str, $start) {
		return substr_compare($str, $start, 0, strlen($start)) === 0;
	}

	function endsWith($str, $end) {
		return substr_compare($str, $end, -strlen($end)) === 0;
	}
	
	function contains($str, $v) {
		return strstr($str, $v);
	}

	if ($_SERVER['REQUEST_URI'] == '/') {
		header("Content-type:text/html");
		readfile("src/frontend/html/front.html");
	}
	
	elseif (endsWith($_SERVER['REQUEST_URI'], '.js')) {
		header("Content-type:text/javascript");
		readfile("src/frontend/js/" . ltrim($_SERVER['REQUEST_URI'], '/'));
	}
	
	elseif ($_SERVER['REQUEST_URI'] == '/all.css') {
		header("Content-type:text/css");
		readfile("src/frontend/css/all.css");
	}	
	
	elseif (startsWith($_SERVER['REQUEST_URI'], '/font')) {
		if (endsWith($_REQUEST['name'], '.woff2')) {
			header("Content-type:font/woff2");
			readfile("res/font/" . $_REQUEST['name']);
		}
	}
	
	elseif ($_SERVER['REQUEST_URI'] == '/favicon.ico') {
		header("Content-type:image/x-icon");
		readfile("res/img/favicon/favicon.ico");
	}
	
	elseif (startsWith($_SERVER['REQUEST_URI'], '/img')) {
		
		$id = $_REQUEST['id'];
		
		if ($id) {
			header("Content-type:image/jpeg");
			readfile("test/listings/img/{$id}.jpg");
		}
	}
	
	elseif (startsWith($_SERVER['REQUEST_URI'], '/tbl')) {
		
		$tblName = $_REQUEST['tblName'];
		
		$jsonStr = file_get_contents("test/db/testData.json");
		$jsonFull = json_decode($jsonStr);
		
		header("Content-type:application/json");
		
		if ($tblName == 'make') {
			$id = $_REQUEST['id'];
			$name = $_REQUEST['name'];			
			$jsonData = $jsonFull->make;
			
			if ($id) {
				echo json_encode(current(array_filter($jsonData,
					function ($e) { return $e->id === $id; })));
			}
			elseif ($name) {
				echo json_encode(current(array_filter($jsonData,
					function ($e) { return $e->name === $name; })));
			}
			else {
				echo json_encode($jsonData);
			}
		}
		elseif ($tblName == 'type') {
			$id = $_REQUEST['id'];
			$name = $_REQUEST['name'];			
			$jsonData = $jsonFull->type;
			
			if ($id) {
				echo json_encode(current(array_filter($jsonData,
					function ($e) { return $e->id === $id; })));
			}
			elseif ($name) {
				echo json_encode(current(array_filter($jsonData,
					function ($e) { return $e->name === $name; })));
			}
			else {
				echo json_encode($jsonData);
			}
		}
		elseif ($tblName == 'model') {
			$id = $_REQUEST['id'];
			$name = $_REQUEST['name'];			
			$jsonData = $jsonFull->model;
			
			if ($id) {
				echo json_encode(current(array_filter($jsonData,
					function ($e) { return $e->id === $id; })));
			}
			elseif ($name) {
				echo json_encode(current(array_filter($jsonData,
					function ($e) { return $e->name === $name; })));
			}
			else {
				echo json_encode($jsonData);
			}
		}
		elseif ($tblName == 'car') {
			$id = $_REQUEST['id'];
			$modelName = $_REQUEST['modelName'];
			$year = $_REQUEST['year'];
			$jsonData = $jsonFull->car;
			
			if ($id) {
				echo json_encode(current(array_filter($jsonData,
					function ($e) { return $e->id === $id; })));
			}
			elseif ($modelName && $year) {
				echo json_encode(current(array_filter($jsonData,
					function ($e) { return $e->model === $modelName && $e->year === $year; })));
			}
			else {
				echo json_encode($jsonData);
			}
		}
		elseif ($tblName == 'listing') {
			$id = $_REQUEST['id'];
			$jsonData = $jsonFull->listing;
			
			if ($id) {
				echo json_encode(current(array_filter($jsonData,
					function ($e) { return $e->id === $id; })));
			}
			else {
				echo json_encode($jsonData);
			}
		}
	}	
	
	elseif ($_SERVER['REQUEST_URI'] == '/tst') {
		
	}
?>