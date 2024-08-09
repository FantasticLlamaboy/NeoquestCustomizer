// ==UserScript==
// @name         Neoquest Customizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make your pet the Neoquest Hero! To use, Go to Options screen and input Species and Color. Updates
// @author       Llamaboy
// @match        https://www.neopets.com/games/neoquest/neoquest.phtml*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Add input fields to the Options screen
    function addCustomizationFields() {
        const header = document.querySelector('.contentModuleHeader');
        if (header) {
            const speciesInput = document.createElement('input');
            speciesInput.type = 'text';
            speciesInput.placeholder = 'Species';
            speciesInput.id = 'speciesInput';

            const colorInput = document.createElement('input');
            colorInput.type = 'text';
            colorInput.placeholder = 'Color';
            colorInput.id = 'colorInput';

            const applyButton = document.createElement('button');
            applyButton.textContent = 'Apply';
            applyButton.onclick = applyCustomization;

            header.appendChild(speciesInput);
            header.appendChild(colorInput);
            header.appendChild(applyButton);
        }
    }

    // Function to handle the Apply button click
    function applyCustomization() {
        const species = document.getElementById('speciesInput').value;
        const color = document.getElementById('colorInput').value;

        // Save to cookie
        document.cookie = `species=${species}; path=/`;
        document.cookie = `color=${color}; path=/`;

        // Replace images
        replaceImages(species, color);
    }

    // Function to replace images based on species and color
    function replaceImages(species, color) {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.src.includes('images.neopets.com/nq/n/lupe_combat.gif')) {
                img.src = `https://images.neopets.com/pets/closeattack/${species}_${color}_right.gif`;
            } else if (img.src.includes('images.neopets.com/nq/n/lupe_win.gif')) {
                img.src = `https://images.neopets.com/pets/happy/${species}_${color}_baby.gif`;
            } else if (img.src.includes('images.neopets.com/nq/n/lupe_lose.gif')) {
                img.src = `https://images.neopets.com/pets/beaten/${species}_${color}_baby.gif`;
            }
        });
    }

    // Check if on the options page to add customization fields
    if (window.location.search.includes('action=options')) {
        console.log("in options");
        addCustomizationFields();
    } else {
        // Load species and color from cookies if not on options page
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        let species = cookies.find(cookie => cookie.startsWith('species='));
        let color = cookies.find(cookie => cookie.startsWith('color='));

        species = species ? species.split('=')[1] : '';
        color = color ? color.split('=')[1] : '';

        if (species && color) {
            replaceImages(species, color);
        }
    }
})();
