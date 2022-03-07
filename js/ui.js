
// Change sections.
$('.nav').click(function() {
	var id = $(this).attr('id');
	if (typeof id !== typeof undefined && id !== false)
	{
		$('html, body').animate({
			scrollTop: ($('#' + id + '.section').offset().top)
		}, 1000);
	}
});

// Every 3 second is called.
// Set animations.
var currentText = 0;
setInterval(function()
{
	// Change text.
	currentText++;
	currentText = currentText % 3;
	var newSpan = document.createElement("SPAN");
	if(currentText == 0)
		newSpan.textContent = "A BIGGEST WAR";
	else if(currentText == 1)
		newSpan.textContent = "A BATLLE ROYAL";
	else
		newSpan.textContent = "A REALTIME STRATEGY GAME";
	document.getElementById("move_text").innerHTML = "";
	document.getElementById("move_text").appendChild(newSpan);
	
	// Change photo.
	showSlides();
	
}, 2500);




// Slide photo home animated
showSlides();
function showSlides() 
{
	var container = document.getElementById("container-images-home");
	var slides = document.getElementsByClassName("mySlides");

	// Put to first the total hidden image.
	container.insertBefore(slides[slides.length-1], container.firstChild);
	
	// Hidden the current.
	slides[slides.length-2].className = "mySlides hidden";
	
	// Set visible the next image.
	slides[slides.length-3].className = "mySlides visible";
} 











