window.onload = function () {
	_metadata = false;
	_classTracks = "track";
	_classSelected = "selected";
	_queryTracks = "." + _classTracks;
	_menu = document.getElementById("divSide");
	_bar = document.getElementById("divBar");
	_playlist = document.getElementById("playlist");
	_controls = document.getElementById("divControls");
	_controlPlay = document.getElementById("controlPlay");
	_progressBar = document.getElementById("divProgress");
	_progressLoad = document.getElementById("progressLoad");
	_progressPlay = document.getElementById("progressPlay");
	_progressText = document.getElementById("progressText");
	_controlPlayPause = "url(\"/pause.svg\")"
	_audio = document.getElementById("audio");
	_sourceMp3 = document.getElementById("sourceMp3");
	_sourceOgg = document.getElementById("sourceOgg");
	_tracks = _playlist.getElementsByClassName(_classTracks);
	_selected = _playlist.getElementsByClassName(_classSelected);

	_playlist.addEventListener("click", clickElement);
	_audio.addEventListener("ended", playNext);
	_audio.addEventListener("error", playNext);
	_audio.addEventListener("progress", progressLoad);
	_audio.addEventListener("timeupdate", progressPlay);
	_progressLoad.addEventListener("click", progressClick);
	_progressPlay.addEventListener("click", progressClick);
	_audio.addEventListener("loadedmetadata", metadataLoad);
}

function menuShow() {
	_menu.style.left = "0";
}

function menuHide() {
	_menu.style.left = "";
}

function selectElement(element) {
	if (element) {
		for (x = _selected.length; x > 0; x--) {
			if (_selected[x - 1]) {
				_selected[x - 1].classList.remove(_classSelected);
			}
		}
		element.classList.add(_classSelected);
		var name = element.getAttribute("src");
		if (name) {
			_sourceMp3.setAttribute("src", "/getsource.php?id=" + name + "&format=null.mp3");
			_sourceOgg.setAttribute("src", "/getsource.php?id=" + name + "&format=null.ogg");
			_metadata = false;
			_audio.load();
			scrollElement(element);
			playPlay();
		}
	}
}

function scrollElement(element) {
	if (element) {
		var offsetTop = window.pageYOffset + _bar.offsetHeight;
		var offsetBottom = window.pageYOffset + window.innerHeight - _controls.offsetHeight;
		if ((element.offsetTop < offsetTop) || (element.offsetTop + element.offsetHeight > offsetBottom)) {
			window.scrollTo(0, element.offsetTop + (element.offsetHeight / 2) - ((window.innerHeight - _controls.offsetHeight + _bar.offsetHeight) / 2));
		}
	}
}

function clickElement(element) {
	var elem = element.target;
	if (elem && elem.classList.contains(_classTracks)) {
		selectElement(elem);
	}
}

function playlistClear() {
	_playlist.innerHTML = "";
}

function playlistAdd(json) {
	var tracks = JSON.parse(json);
	for (x = 0; x < tracks.length; x++) {
		if (tracks[x]["tracks"].length > 0) {
			var album = document.createElement("div");
			var albumArt = document.createElement("img");
			var albumTitle = document.createElement("div");
			var albumList = document.createElement("div");
			album.setAttribute("class", "album");
			albumArt.setAttribute("class", "albumArt");
			albumArt.setAttribute("src", "getart.php?id=" + tracks[x]["art"]);
			albumTitle.setAttribute("class", "albumTitle");
			albumTitle.innerHTML = tracks[x]["artist"] + " - " + tracks[x]["album"] + " (" + tracks[x]["year"] + ", " + tracks[x]["genre"] + ")"
			albumList.setAttribute("class", "albumList");
			for (y = 0; y < tracks[x]["tracks"].length; y++) {
				var elem = tracks[x]["tracks"][y];
				var track = document.createElement("li");
				track.innerHTML = elem["number"] + " " + elem["title"];
				if (elem["artist"]) {
					track.innerHTML += " (" + elem["artist"] + ")"
				}
				track.setAttribute("src", elem["src"]);
				track.classList.add(_classTracks);
				albumList.appendChild(track);
			}
			album.appendChild(albumArt);
			album.appendChild(albumTitle);
			album.appendChild(albumList);
			_playlist.appendChild(album);
		}
	}
}

function playPlay() {
	if ( _sourceMp3.getAttribute("src") && _sourceOgg.getAttribute("src") ) {
		_controlPlay.style.backgroundImage = _controlPlayPause;
		_audio.play();
	} else {
		playNext();
	}
}

function playStop() {
	_controlPlay.style.backgroundImage = "";
	_audio.pause();
}

function playPause() {
	if (!_audio.paused) {
		playStop();
	} else {
		playPlay();
	}
}

function playNext() {
	var element = _tracks[0];
	if (_selected[0]) {
		if (_selected[0].nextElementSibling) {
			element = _selected[0].nextElementSibling;
		} else {
			var nextParent = _selected[0].parentNode.parentNode.nextElementSibling;
			if (nextParent) {
				var nextChild = nextParent.querySelector(_queryTracks);
				if (nextChild) {
					element = nextChild;
				}
			}
		}
	}
	selectElement(element);
}

function playPrev() {
	var element = _tracks[_tracks.length - 1];
	if (_selected[0]) {
		if (_selected[0].previousElementSibling) {
			element = _selected[0].previousElementSibling;
		} else {
			var prevParent = _selected[0].parentNode.parentNode.previousElementSibling;
			if (prevParent) {
				var prevChilds = prevParent.querySelectorAll(_queryTracks);
				var prevChild = prevChilds[prevChilds.length - 1];
				if (prevChild) {
					element = prevChild;
				}
			}
		}
	}
	selectElement(element);
}

function progressLoad() {
	if (_metadata) {
		var load = ((100 / _audio.duration) * _audio.buffered.end(0));
		_progressLoad.style.width = load + "%";
	}
}

function secondsString(time) {
	time = Math.floor(time);
	var minutes = time / 60;
	minutes = Math.floor(minutes);
	var seconds = time - minutes * 60;
	seconds = Math.floor(seconds);
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return minutes + ":" + seconds;
}

function progressPlay() {
	if (_metadata) {
		var play = (100 / _audio.duration) * _audio.currentTime;
		var time = secondsString(_audio.currentTime) + "/" + secondsString(_audio.duration);
		_progressPlay.style.width = play + "%";
		_progressText.innerHTML = time;
	}
}

function progressClick(element) {
	if (_metadata) {
		var time = (_audio.duration / 100) * (100 / _progressBar.clientWidth) * (element.clientX - _progressBar.offsetLeft);
		_audio.currentTime = time;
	}
}

function metadataLoad() {
	_metadata = true;
	progressLoad();
}

//temp

function add() {
	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200 ) {
			playlistAdd(xmlhttp.responseText);
		}
	}
	xmlhttp.open("GET", "/getlist.php", true);
	xmlhttp.send();
}
