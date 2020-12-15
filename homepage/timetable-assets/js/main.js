(function() {
	
	function generateTable(code, name,start, end, days, intelMatchPercent){

		var parentNode = document.createElement("LI");
			parentNode.className = "cd-schedule__event";
			parentNode.id = "event";

		var childNode = document.createElement("A");

			var startTime = document.createAttribute("data-start");
				startTime.value = start;
			var endTime = document.createAttribute("data-end");
				endTime.value = end;
			var dataEvent = document.createAttribute("data-event");
				dataEvent.value = 'event-1';

		childNode.href="#timetable";
		childNode.id = code;

		//Set child nodes
		childNode.setAttributeNode(startTime);  
		childNode.setAttributeNode(endTime);
		childNode.setAttributeNode(dataEvent);

		var courseCode = document.createElement("EM");
			courseCode.className = 'cd-schedule__name';
			courseCode.innerHTML = '<h1 style="font-size: 14px; font-weight: bolder;">'+code+'</h1>';
		var courseName = document.createElement("EM");
			courseName.className = 'cd-schedule__name';
			courseName.innerHTML = '<h3 style="font-size: 14px; font-weight: bold;">'+name+'</h3>';
		var matchPercent = document.createElement("EM");
			matchPercent.className = 'cd-schedule__name';
			matchPercent.innerHTML = '<br><h5 style="font-size: 12px; font-color: blue;">Match Percent Rate: '
										+intelMatchPercent*100+'%</h4>';
										
		childNode.appendChild(courseCode);
		childNode.appendChild(courseName);
		childNode.appendChild(matchPercent);
		parentNode.appendChild(childNode);
		
	   document.getElementById(days.toLowerCase()).appendChild(parentNode);
	};

	//Validate to make sure there are no conflicts
	function validate(timeList, sTime, eTime) {
		if (+getDate(sTime) < +getDate(eTime)) {
		  var len = timeList.length;
		  return len>0?(+getDate(timeList[len - 1].endTime) < +getDate(sTime) ):true;
		} else {
		  return false;
		}
	  }

	  function getDate(time) {
		var today = new Date();
		var _t = time.split(":");
		today.setHours(_t[0], _t[1], 0, 0);
		return today;
	  }
	  
	// Schedule Template - by CodyHouse.co
	function ScheduleTemplate( element ) {
		var timelineHTML = 	'<li><span>08:00 AM</span></li>'
							+'<li><span>08:30 AM</span></li>'
							+'<li><span>09:00 AM</span></li>'
							+'<li><span>09:30 AM</span></li>'
							+'<li><span>10:00 AM</span></li>'
							+'<li><span>10:30 AM</span></li>'
							+'<li><span>11:00 AM</span></li>'
							+'<li><span>11:30 AM</span></li>'
							+'<li><span>12:00 PM</span></li>'
							+'<li><span>12:30 PM</span></li>'
							+'<li><span>1:00 PM</span></li>'
							+'<li><span>1:30 PM</span></li>'
							+'<li><span>2:00 PM</span></li>'
							+'<li><span>2:30 PM</span></li>'
							+'<li><span>3:00 PM</span></li>'
							+'<li><span>3:30 PM</span></li>'
							+'<li><span>4:00 PM</span></li>'
							+'<li><span>4:30 PM</span></li>'
							+'<li><span>5:00 PM</span></li>'
							+'<li><span>5:30 PM</span></li>'
							+'<li><span>6:00 PM</span></li>'
							+'<li><span>6:30 PM</span></li>'
							+'<li><span>7:00 PM</span></li>'
							+'<li><span>7:30 PM</span></li>'
							+'<li><span>8:00 PM</span></li>'
							+'<li><span>8:30 PM</span></li>'
							+'<li><span>9:00 PM</span></li>'
							+'<li><span>9:30 PM</span></li>'
							+'<li><span>10:00 PM</span></li>';
		document.getElementById('timeLine').innerHTML = timelineHTML;
		
		var reset = {startTime: "00:00",
			endTime: "07:00"};
		var monday = [];
		var tuesday = [];
		var wednesday = [];
		var thursday = [];
		var friday = [];
		var timeList = [];

			var code = (document.getElementById("courseDataCode").textContent).split(',');
			var name = (document.getElementById("courseDataName").textContent).split(",");
			var start = (document.getElementById("courseDataStart").textContent).split(",");
			var end = (document.getElementById("courseDataEnd").textContent).split(",");
			var days = (document.getElementById("courseDataDays").textContent).split(",");
			var intelMatches = (document.getElementById("courseMatchPercent").textContent).split(",");
			
			var startArr = []; //Temporary array to sort the courses

			for(var k=0; k<code.length; k++){

				var startLine = start[k].split(':');
				startArr.push(parseInt(startLine[0]+startLine[1]));

				for(var p=0; p < Math.pow(startArr.length, 2); p++){
					//Squared of the length to ensure that it is sorted thoroughly
					for(var m=0; m < startArr.length; m++){
						//Sort from the earliest course to latest
						if(startArr[m] > startArr[m+1]){
							
							//Sort the temp array of start times (1130) without the :
							var temp = startArr[m];
							startArr[m] = startArr[m+1];
							startArr[m+1] = temp;
							//Sort the actual array of start times (11:30) with the :
							var temp = start[m];
							start[m] = start[m+1];
							start[m+1] = temp;
							//Switch the end times
							var temp = end[m];
							end[m] = end[m+1];
							end[m+1] = temp;
							//Switch codes
							var temp = code[m];
							code[m] = code[m+1];
							code[m+1] = temp;

							var temp = name[m];
							name[m] = name[m+1];
							name[m+1] = temp;

							var temp = days[m];
							days[m] = days[m+1];
							days[m+1] = temp;
						}
					}
				}
			}
			
		for(var n=0; n < code.length; n++){
			if((days[n]).includes('+')){
				var assignedDays = days[n].split('+');
			}
			else{
				var assignedDays = [days[n]];
			}

			var startTime = start[n];
			var endTime =  end[n];

		  for(var i=0; i < assignedDays.length; i++){
			
			//Switch days
			switch(assignedDays[i].toString().toLowerCase()){
				case 'monday': timeList = monday; break;
				case 'tuesday': timeList = tuesday; break;
				case 'wednesday': timeList = wednesday; break;
				case 'thursday': timeList = thursday; break;
				case 'friday': timeList = friday; break;
			}

			//Validate each day and see if there's any conflict
			if (validate(timeList,startTime, endTime)){
				timeList.push({
					startTime: startTime,
					endTime: endTime
				});

				generateTable(function() {
						
					return code[n];
				}(),
				function() {
					return name[n];
				}(),
				function() {
					return start[n];
				}(),
				function() {
					return end[n];
				}(),
				function() {
					return assignedDays[i];
				}(),
				function() {
					return intelMatches[n];
				}()
				);
			}

			else{
				deleteCourse(code[n]);
				swal("Overlapping Error", {
					icon : "error",
					text: 'There was an overlap conflict between courses.'
						+'\nPlease remove one before adding another. Thank you!',
					buttons: {        			
						confirm: {
							className : 'btn-danger'
						}
					},
				});
			}
		}
	}

		
		this.element = element;
		this.timelineItems = this.element.getElementsByClassName('cd-schedule__timeline')[0].getElementsByTagName('li');
		this.timelineStart = getScheduleTimestamp(this.timelineItems[0].textContent);
		this.timelineUnitDuration = getScheduleTimestamp(this.timelineItems[1].textContent) - getScheduleTimestamp(this.timelineItems[0].textContent);
		
		this.topInfoElement = this.element.getElementsByClassName('cd-schedule__top-info')[0];
		this.singleEvents = this.element.getElementsByClassName('cd-schedule__event');
		
		this.modal = this.element.getElementsByClassName('cd-schedule-modal')[0];
		this.modalHeader = this.element.getElementsByClassName('cd-schedule-modal__header')[0];
		this.modalHeaderBg = this.element.getElementsByClassName('cd-schedule-modal__header-bg')[0];
		this.modalBody = this.element.getElementsByClassName('cd-schedule-modal__body')[0];
		this.modalBodyBg = this.element.getElementsByClassName('cd-schedule-modal__body-bg')[0];
		this.modalClose = this.modal.getElementsByClassName('cd-schedule-modal__close')[0];
		this.modalDate = this.modal.getElementsByClassName('cd-schedule-modal__date')[0]; 
		this.modalEventName = this.modal.getElementsByClassName('cd-schedule-modal__name')[0];
		this.coverLayer = this.element.getElementsByClassName('cd-schedule__cover-layer')[0];

		this.modalMaxWidth = 800;
		this.modalMaxHeight = 480;

		this.animating = false;
		this.supportAnimation = Util.cssSupports('transition');

		this.initSchedule();
	};

	ScheduleTemplate.prototype.initSchedule = function() {
		this.scheduleReset();
		this.initEvents();
	};

	ScheduleTemplate.prototype.scheduleReset = function() {
		// according to the mq value, init the style of the template
		var mq = this.mq(),
			loaded = Util.hasClass(this.element, 'js-schedule-loaded'),
			modalOpen = Util.hasClass(this.modal, 'cd-schedule-modal--open');
		if( mq == 'desktop' && !loaded ) {
			Util.addClass(this.element, 'js-schedule-loaded');
			this.placeEvents();
			modalOpen && this.checkEventModal(modalOpen);
		} else if( mq == 'mobile' && loaded) {
			//in this case you are on a mobile version (first load or resize from desktop)
			Util.removeClass(this.element, 'cd-schedule--loading js-schedule-loaded');
			this.resetEventsStyle();
			modalOpen && this.checkEventModal();
		} else if( mq == 'desktop' && modalOpen ) {
			//on a mobile version with modal open - need to resize/move modal window
			this.checkEventModal(modalOpen);
			Util.removeClass(this.element, 'cd-schedule--loading');
		} else {
			Util.removeClass(this.element, 'cd-schedule--loading');
		}
	};

	ScheduleTemplate.prototype.resetEventsStyle = function() {
		// remove js style applied to the single events
		for(var i = 0; i < this.singleEvents.length; i++) {
			this.singleEvents[i].removeAttribute('style');
		}
	};

	ScheduleTemplate.prototype.placeEvents = function() {
		// on big devices - place events in the template according to their time/day
		var self = this,
			slotHeight = this.topInfoElement.offsetHeight;
		for(var i = 0; i < this.singleEvents.length; i++) {
			var anchor = this.singleEvents[i].getElementsByTagName('a')[0];
			var start = getScheduleTimestamp(anchor.getAttribute('data-start')),
				duration = getScheduleTimestamp(anchor.getAttribute('data-end')) - start;

			var eventTop = slotHeight*(start - self.timelineStart)/self.timelineUnitDuration,
				eventHeight = slotHeight*duration/self.timelineUnitDuration;

			this.singleEvents[i].setAttribute('style', 'top: '+(eventTop-1)+'px; height: '+(eventHeight +1)+'px');
		}

		Util.removeClass(this.element, 'cd-schedule--loading');
	};

	ScheduleTemplate.prototype.initEvents = function() {
		var self = this;
		
		for(var i = 0; i < this.singleEvents.length; i++) {
			// open modal when user selects an event
			this.singleEvents[i].addEventListener('click', function(event){

				
				var start = $(this.getElementsByTagName('a')).attr('data-start');
				var end = $(this.getElementsByTagName('a')).attr('data-end');
				var duration = getScheduleTimestamp(end) - getScheduleTimestamp(start);
				
				var coursecode = this.getElementsByTagName('em')[0].innerText;
				var coursename = this.getElementsByTagName('em')[1].innerText;
					window.location.href = "#"+coursecode;
				if(parseInt(start)>11){
					var min = start.split(":");
					min = min[1];
					switch(parseInt(start)){
						case 12: start = "12:"+min+"PM"; break;
						case 13: start = "1:"+min+"PM"; break;
						case 14: start = "2:"+min+"PM"; break;
						case 15: start = "3:"+min+"PM"; break;
						case 16: start = "4:"+min+"PM"; break;
						case 17: start = "5:"+min+"PM"; break;
						case 18: start = "6:"+min+"PM"; break;
						case 19: start = "7:"+min+"PM"; break;
						case 20: start = "8:"+min+"PM"; break;
						case 19: start = "9:"+min+"PM"; break;
						case 20: start = "10:"+min+"PM"; break;
					}
				}
				else
					start += ' AM';

				if(parseInt(end)>11){
					var min = end.split(":");
					min = min[1];
					switch(parseInt(end)){
						case 12: end = "12:"+min+"PM"; break;
						case 13: end = "1:"+min+"PM"; break;
						case 14: end = "2:"+min+"PM"; break;
						case 15: end = "3:"+min+"PM"; break;
						case 16: end = "4:"+min+"PM"; break;
						case 17: end = "5:"+min+"PM"; break;
						case 18: end = "6:"+min+"PM"; break;
						case 19: end = "7:"+min+"PM"; break;
						case 20: end = "8:"+min+"PM"; break;
						case 19: end = "9:"+min+"PM"; break;
						case 20: end = "10:"+min+"PM"; break;
					}
				}
				else
					end += ' AM';

				if(parseInt(duration) > 60){
					var total = parseFloat(duration/60);
					var hr = (total.toString()).split('.');
					var min = (total - parseInt(hr)).toFixed(2);
					min = Math.round(60*min);
					if(parseInt(hr)>1)
						duration = hr[0]+' hours and '+min;
					else
						duration = hr[0]+' hour and '+min;
				}

				var textContent = 'Time: '+start+' - '+end+'\n'+'Duration: '+duration+' minutes';
				swal({
					title: coursecode+" : "+coursename,
					text: textContent,
					id: 'courseInfoPopUp',
					buttons: {     
						confirm: {
							text : 'REMOVE',
							className : 'btn-danger'
						},
						cancel: {
							text: 'CLOSE',
							visible: true,
							className: 'btn-primary'
						}
					},
				}).then((Delete) => {
					if (Delete) {
						swal({
							title: coursecode +' Removed!',
							text: 'You have successfully remove "'+coursename+ '" from your myCourse Planner.',
							icon: 'success',
							buttons : {
								confirm: {
									text: "CLOSE",
									className : 'btn-success'
								}
							}
						});
						
						deleteCourse(coursecode)

					} else {
						swal.close();
					}
				});
			});
		}
		//close modal window
		this.modalClose.addEventListener('click', function(event){
			event.preventDefault();
			if( !self.animating ) self.closeModal();
		});
		this.coverLayer.addEventListener('click', function(event){
			event.preventDefault();
			if( !self.animating ) self.closeModal();
		});
	};

	ScheduleTemplate.prototype.openModal = function(target) {
		var self = this;
		var mq = self.mq();
		this.animating = true;
		var startTime = target.getAttribute('data-start');
		var endTime = target.getAttribute('data-end');
		
		if(parseInt(startTime)>12){
			startTime += "PM";
			endTime += "PM";
		}
		else{
			startTime += "AM";
			endTime += "AM";
		}


		//update event name and time
		this.modalEventName.textContent = target.getElementsByTagName('em')[0].textContent;
		this.modalDate.textContent = startTime+' - '+endTime;
		this.modal.setAttribute('data-event', target.getAttribute('data-event'));

		//update event content
		this.loadEventContent(target.getAttribute('data-content'));

		Util.addClass(this.modal, 'cd-schedule-modal--open');
		
		setTimeout(function(){
			//fixes a flash when an event is selected - desktop version only
			Util.addClass(target.closest('li'), 'cd-schedule__event--selected');
		}, 10);

		if( mq == 'mobile' ) {
			self.modal.addEventListener('transitionend', function cb(){
				self.animating = false;
				self.modal.removeEventListener('transitionend', cb);
			});
		} else {
			var eventPosition = target.getBoundingClientRect(),
				eventTop = eventPosition.top,
				eventLeft = eventPosition.left,
				eventHeight = target.offsetHeight,
				eventWidth = target.offsetWidth;

			var windowWidth = window.innerWidth,
				windowHeight = window.innerHeight;

			var modalWidth = ( windowWidth*.8 > self.modalMaxWidth ) ? self.modalMaxWidth : windowWidth*.8,
				modalHeight = ( windowHeight*.8 > self.modalMaxHeight ) ? self.modalMaxHeight : windowHeight*.8;

			var modalTranslateX = parseInt((windowWidth - modalWidth)/2 - eventLeft),
				modalTranslateY = parseInt((windowHeight - modalHeight)/2 - eventTop);
			
			var HeaderBgScaleY = modalHeight/eventHeight,
				BodyBgScaleX = (modalWidth - eventWidth);

			//change modal height/width and translate it
			self.modal.setAttribute('style', 'top:'+eventTop+'px;left:'+eventLeft+'px;height:'+modalHeight+'px;width:'+modalWidth+'px;transform: translateY('+modalTranslateY+'px) translateX('+modalTranslateX+'px)');
			//set modalHeader width
			self.modalHeader.setAttribute('style', 'width:'+eventWidth+'px');
			//set modalBody left margin
			self.modalBody.setAttribute('style', 'margin-left:'+eventWidth+'px');
			//change modalBodyBg height/width ans scale it
			self.modalBodyBg.setAttribute('style', 'height:'+eventHeight+'px; width: 1px; transform: scaleY('+HeaderBgScaleY+') scaleX('+BodyBgScaleX+')');
			//change modal modalHeaderBg height/width and scale it
			self.modalHeaderBg.setAttribute('style', 'height: '+eventHeight+'px; width: '+eventWidth+'px; transform: scaleY('+HeaderBgScaleY+')');
			
			self.modalHeaderBg.addEventListener('transitionend', function cb(){
				//wait for the  end of the modalHeaderBg transformation and show the modal content
				self.animating = false;
				Util.addClass(self.modal, 'cd-schedule-modal--animation-completed');
				self.modalHeaderBg.removeEventListener('transitionend', cb);
			});
		}

		//if browser do not support transitions -> no need to wait for the end of it
		this.animationFallback();
	};

	ScheduleTemplate.prototype.closeModal = function() {
		var self = this;
		var mq = self.mq();

		var item = self.element.getElementsByClassName('cd-schedule__event--selected')[0],
			target = item.getElementsByTagName('a')[0];

		this.animating = true;

		if( mq == 'mobile' ) {
			Util.removeClass(this.modal, 'cd-schedule-modal--open');
			self.modal.addEventListener('transitionend', function cb(){
				Util.removeClass(self.modal, 'cd-schedule-modal--content-loaded');
				Util.removeClass(item, 'cd-schedule__event--selected');
				self.animating = false;
				self.modal.removeEventListener('transitionend', cb);
			});
		} else {
			var eventPosition = target.getBoundingClientRect(),
				eventTop = eventPosition.top,
				eventLeft = eventPosition.left,
				eventHeight = target.offsetHeight,
				eventWidth = target.offsetWidth;

			var modalStyle = window.getComputedStyle(self.modal),
				modalTop = Number(modalStyle.getPropertyValue('top').replace('px', '')),
				modalLeft = Number(modalStyle.getPropertyValue('left').replace('px', ''));

			var modalTranslateX = eventLeft - modalLeft,
				modalTranslateY = eventTop - modalTop;

			Util.removeClass(this.modal, 'cd-schedule-modal--open cd-schedule-modal--animation-completed');

			//change modal width/height and translate it
			self.modal.style.width = eventWidth+'px';self.modal.style.height = eventHeight+'px';self.modal.style.transform = 'translateX('+modalTranslateX+'px) translateY('+modalTranslateY+'px)';
			//scale down modalBodyBg element
			self.modalBodyBg.style.transform = 'scaleX(0) scaleY(1)';
			//scale down modalHeaderBg element
			// self.modalHeaderBg.setAttribute('style', 'transform: scaleY(1)');
			self.modalHeaderBg.style.transform = 'scaleY(1)';

			self.modalHeaderBg.addEventListener('transitionend', function cb(){
				//wait for the  end of the modalHeaderBg transformation and reset modal style
				Util.addClass(self.modal, 'cd-schedule-modal--no-transition');
				setTimeout(function(){
					self.modal.removeAttribute('style');
					self.modalBody.removeAttribute('style');
					self.modalHeader.removeAttribute('style');
					self.modalHeaderBg.removeAttribute('style');
					self.modalBodyBg.removeAttribute('style');
				}, 10);
				setTimeout(function(){
					Util.removeClass(self.modal, 'cd-schedule-modal--no-transition');
				}, 20);
				self.animating = false;
				Util.removeClass(self.modal, 'cd-schedule-modal--content-loaded');
				Util.removeClass(item, 'cd-schedule__event--selected');
				self.modalHeaderBg.removeEventListener('transitionend', cb);
			});
		}

		//if browser do not support transitions -> no need to wait for the end of it
		this.animationFallback();
	};

	ScheduleTemplate.prototype.checkEventModal = function(modalOpen) {
		// this function is used on resize to reset events/modal style
		this.animating = true;
		var self = this;
		var mq = this.mq();
		if( mq == 'mobile' ) {
			//reset modal style on mobile
			self.modal.removeAttribute('style');
			self.modalBody.removeAttribute('style');
			self.modalHeader.removeAttribute('style');
			self.modalHeaderBg.removeAttribute('style');
			self.modalBodyBg.removeAttribute('style');
			Util.removeClass(self.modal, 'cd-schedule-modal--no-transition');
			self.animating = false;	
		} else if( mq == 'desktop' && modalOpen) {
			Util.addClass(self.modal, 'cd-schedule-modal--no-transition cd-schedule-modal--animation-completed');
			var item = self.element.getElementsByClassName('cd-schedule__event--selected')[0],
				target = item.getElementsByTagName('a')[0];

			var eventPosition = target.getBoundingClientRect(),
				eventTop = eventPosition.top,
				eventLeft = eventPosition.left,
				eventHeight = target.offsetHeight,
				eventWidth = target.offsetWidth;

			var windowWidth = window.innerWidth,
				windowHeight = window.innerHeight;

			var modalWidth = ( windowWidth*.8 > self.modalMaxWidth ) ? self.modalMaxWidth : windowWidth*.8,
				modalHeight = ( windowHeight*.8 > self.modalMaxHeight ) ? self.modalMaxHeight : windowHeight*.8;

			var HeaderBgScaleY = modalHeight/eventHeight,
				BodyBgScaleX = (modalWidth - eventWidth);


			setTimeout(function(){
				self.modal.setAttribute('style', 'top:'+(windowHeight/2 - modalHeight/2)+'px;left:'+(windowWidth/2 - modalWidth/2)+'px;height:'+modalHeight+'px;width:'+modalWidth+'px;transform: translateY(0) translateX(0)');
				//change modal modalBodyBg height/width
				self.modalBodyBg.style.height = modalHeight+'px';self.modalBodyBg.style.transform = 'scaleY(1) scaleX('+BodyBgScaleX+')';self.modalBodyBg.style.width = '1px';
				//set modalHeader width
				self.modalHeader.setAttribute('style', 'width:'+eventWidth+'px');
				//set modalBody left margin
				self.modalBody.setAttribute('style', 'margin-left:'+eventWidth+'px');
				//change modal modalHeaderBg height/width and scale it
				self.modalHeaderBg.setAttribute('style', 'height: '+eventHeight+'px;width:'+eventWidth+'px; transform:scaleY('+HeaderBgScaleY+');');
			}, 10);

			setTimeout(function(){
				Util.removeClass(self.modal, 'cd-schedule-modal--no-transition');
				self.animating = false;	
			}, 20);

		}
	};

	ScheduleTemplate.prototype.getEventContent = function(string) {
		// reset the loaded event content so that it can be inserted in the modal
		var div = document.createElement('div');
		div.innerHTML = string.trim();
		return div.getElementsByClassName('cd-schedule-modal__event-info')[0].innerHTML;
	};

	ScheduleTemplate.prototype.animationFallback = function() {
		if( !this.supportAnimation ) { // fallback for browsers not supporting transitions
			var event = new CustomEvent('transitionend');
			self.modal.dispatchEvent(event);
			self.modalHeaderBg.dispatchEvent(event);
		}
	};

	ScheduleTemplate.prototype.mq = function(){
		//get MQ value ('desktop' or 'mobile') 
		var self = this;
		return window.getComputedStyle(this.element, '::before').getPropertyValue('content').replace(/'|"/g, "");
	};

	function getScheduleTimestamp(time) {
		//accepts hh:mm format - convert hh:mm to timestamp
		time = time.replace(/ /g,'');
		var timeArray = time.split(':');
		var timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
		return timeStamp;
	};

	var scheduleTemplate = document.getElementsByClassName('js-cd-schedule'),	
		scheduleTemplateArray = [],
		resizing = false;
	if( scheduleTemplate.length > 0 ) { // init ScheduleTemplate objects
		for( var i = 0; i < scheduleTemplate.length; i++) {
			(function(i){
				scheduleTemplateArray.push(new ScheduleTemplate(scheduleTemplate[i]));
			})(i);
		}

		window.addEventListener('resize', function(event) { 
			// on resize - update events position and modal position (if open)
			if( !resizing ) {
				resizing = true;
				(!window.requestAnimationFrame) ? setTimeout(checkResize, 250) : window.requestAnimationFrame(checkResize);
			}
		});

		window.addEventListener('keyup', function(event){
			// close event modal when pressing escape key
			if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
				for(var i = 0; i < scheduleTemplateArray.length; i++) {
					scheduleTemplateArray[i].closeModal();
				}
			}
		});

		function checkResize(){
			for(var i = 0; i < scheduleTemplateArray.length; i++) {
				scheduleTemplateArray[i].scheduleReset();
			}
			resizing = false;
		};
	}
}());