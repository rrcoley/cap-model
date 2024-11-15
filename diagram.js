var capmodel = new URLSearchParams(window.location.search).get('Model');
if (capmodel === null) {
	capmodel="CyberSecurity";
}
const tdiv =  document.getElementsByClassName('main-title')[0];
tdiv.innerHTML=capmodel+" Architecture Capabilities";

// Function to fetch data from the JSON API endpoint
async function fetchCapModel() 
{
	try {
		// URL should tag on capmodel
		const response = await fetch('http://localhost:800/cloud.json', {
			headers: {
				'Content-Type': 'application/json',
			}
		});

		if (!response.ok) {
			throw new Error('HTTP error! status: ${response.status}');
		}

		const data = await response.json();
		const CapModel = data.record;

		// Append all sections dynamically to the container
		const sectionsContainer =  document.getElementById('sections-container');

		CapModel.forEach(sectionData => {
			const section = createSection(sectionData);
			sectionsContainer.appendChild(section);
		});
	} catch (error) {
		console.error("Failed to load data:",error);
	}
}

// Call the fetch function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', fetchCapModel);
	
// Function to convert named CSS colors to hex
function colorNameToHex(color) 
{
	const colors = {
		"purple": 	"#9c27b0",
		"blue": 	"#2196f3",
		"green": 	"#4caf50",
		"red": 		"#f44336",
		"orange": 	"#ff9800",
		"yellow": 	"#ffeb3b",
		"cyan": 	"#00bcd4",
		"teal": 	"#009688",
		"pink": 	"#e91e63",
		"indigo": 	"#3f51b5",
	};
	return colors[color.toLowerCase()] || color;
}

// Function to darken a hex color by a certain percentage
function darkenColor(color, percent) 
{
	const num = parseInt(color.slice(1),16);
	const amt = Math.round(2.55 * percent);

	const R = (num >> 16) -amt;
	const G = ((num >> 8) & 0x00ff) - amt;
	const B = (num & 0x0000ff) - amt;

	return `#${(
		0x1000000 +
		(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x100000 +	
		(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +	
		(B < 255 ? (B < 1 ? 0 : B) : 255))
		.toString(16)
		.slice(1)}`;
}

function applyFullWidthClass() 
{
	const containerWidth = document.querySelector('.container').offsetWidth;
	const sections = document.querySelectorAll('.section');

	sections.forEach((section,index) => {
		section.classList.remove('full-width'); 

		const sectionWidth = section.offsetWidth;
		const sectionRightEdge = section.getBoundingClientRect().right;
		const containerRightEdge = containerWidth;

		// Apply .full-width if this is the last section in the row and there is space to expand
		if (section.RightEdge < containerRightEdge && index === sections.length - 1) {
			section.classList.add('full-width');
		}
	});
}

window.addEventListener('resize', applyFullWidthClass);
document.addEventListener('DOMContentLoaded',applyFullWidthClass);

// Function to create and append section HTML elements dynamically
function createSection(sectionData) 
{
	const section = document.createElement('div');

	section.classList.add('section', sectionData.color);
	section.innerHTML = `<div class="section-title">${sectionData.title}</div>`;

	section.addEventListener('click', () => {
		openModal(sectionData.title,sectionData.description);
	});

	if (sectionData.subSections) {
		const subSectionContainer = document.createElement('div');

		sectionData.subSections.forEach(subSectionData => {
			const subSection = createSubSection(subSectionData, sectionData.color);
			subSectionContainer.appendChild(subSection);
		});
		section.appendChild(subSectionContainer);
	}
	return section;
}

// Function to create and append sub-section HTML elements dynamically
function createSubSection(subSectionData, parentColor) 
{
	const subSection = document.createElement('div');

	subSection.classList.add('sub-section');
	subSection.innerHTML = `<div class="sub-section-title">${subSectionData.title}</div>`;

	subSection.addEventListener('click', (event) => {
		event.stopPropagation(); 
		openModal(subSectionData.title,subSectionData.description);
	});

	if (subSectionData.subSections) {
		const subSectionContent = document.createElement('div');

		subSectionContent.classList.add('section-content');

		subSectionData.subSections.forEach(boxData => {
			const box = createBox(boxData, parentColor);
			subSectionContent.appendChild(box);
		});
		subSection.appendChild(subSectionContent);
	}
	return subSection;
}

// Function to create boxes dynamically
function createBox(boxData,parentColor) 
{
	const box=document.createElement('div');
	
	box.classList.add('box');
	box.innerHTML = boxData.title;

	box.addEventListener('click',(event) => {
		event.stopPropagation();
		openModal(boxData.title, boxData.description, boxData.subSections, parentColor);
	});	
	return box;
}

// Function to open the modal with the title, descriptions and optionally L4's
function openModal(title, description, subSections = null, parentColor = null) 
{
	const modalTitle = document.getElementById('modal-title');
	const modalDescription = document.getElementById('modal-description');
	const modal = document.getElementById('modal');
		
	modalTitle.textContent = title;
	modalDescription.textContent = description;

	// Clear any existing L4 boxes
	const existingL4Container = document.querySelector('.l4-container');
	if (existingL4Container) {
		existingL4Container.remove();
	}

	// If L4 subSections exist, create a container for them and append boxes
	if (subSections) {
		const l4Container = document.createElement('div');
		l4Container.classList.add('l4-container');
		l4Container.style.display = 'flex';
		l4Container.style.justifyContent = 'center';
		l4Container.style.gap = '10px';
		l4Container.style.marginTop = '20px';
	
		const hexParentColor = colorNameToHex(parentColor);

		subSections.forEach(l4Data => {
			const l4Box = document.createElement('div');

			l4Box.classList.add('box');
			l4Box.textContent = l4Data.title;
	
			// Assign a darker shade of the parent L3 color to L4 box
			l4box.style.backgroundColor = darkenColor(hexParentColor, 0.5);

			l4Box.addEventListner('click',(event) => {
				event.stopPropogation();
				openModal(l4Data.title, l4Data.description, null, l4Box.style.backgroundColor);
			});

			l4Container.appendChild(l4Box);
		});
		modalDescription.appendChild(l4Container);
	}
	modal.style.display = 'flex';
}

// Close modal when clicking on the X
document.getElementById('modal-close-x').addEventListener('click', () => 
{
	document.getElementById('modal').style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click',(event) => 
{
	const modal = document.getElementById('modal');
	if (event.target === modal) {
		modal.style.display = 'none';
	}
});

// Append all sections dynamically to the container
const sectionsContainer = document.getElementById('sections-container');
if (typeof CapModel !== 'undefined') {
CapModel.forEach(sectionData => 
{
	const section = createSection(sectionData);
	
	sectionsContainer.appendChild(section);
});
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() 
{
	document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) 
{
	if (!event.target.matches('.dropbtn')) {
		var dropdowns = document.getElementsByClassName("dropdown-content");
		var i;

		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}
