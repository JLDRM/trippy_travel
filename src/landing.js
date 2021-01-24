import { minesweeperModule } from './minesweeper.module.js';
import { hallOfFameModule } from './hall-of-fame.module.js';
import { trippycss } from './trippy-stuff.js'

"use strict";

(function () {

    console.log(`%cTrippy Travel:`, trippycss);
    console.log("Whatsup fellas. I know this is an easily incomprehensible art. Anyway, this will be enhanced in the future.");
    console.log("Pleased to invite you to 'Sources' tab to take a look at the actual implementation.");
    console.log("Thanks for watching 😻");
    console.log('More information on https://github.com/JLDRM/trippy_travel')

    var disturb_counter = 0;
    var speak_bubble_timer;
    const host = document.getElementById("host_container");

    const speak_bubble = document.getElementById("speak_bubble");
    const speak_bubble_text = document.getElementById("speak_bubble_text");

    const minesweeper_loader = document.getElementById("heartbeat-loader");
    const minesweeper = document.getElementById("minesweeper-container");

    const hall_of_fame_container = document.getElementById('hall-of-fame-container');
    const hall_of_fame = document.getElementById('hall-of-fame');

    const winner_form_container = document.getElementById('winner-form-container');

    document.addEventListener('scroll', function () {
        fucking_host_speaks("Where are you going?");
    });

    host.addEventListener('click', function (a, b) {
        if (speak_bubble.classList.contains("speak")) {
            return;
        }
        disturb_counter++;
        if (disturb_counter > 3) {
            fucking_host_speaks("What are you searching?");
        } else {
            fucking_host_speaks("Don't touch me!");
        }
    });

    /** Make the fucking grace speaks
     * @param string your grace words
    */
    function fucking_host_speaks(god_words) {
        if (speak_bubble_timer) {
            clearTimeout(speak_bubble_timer);
        }
        speak_bubble.classList.add("speak");
        set_god_words(god_words);
        speak_bubble_timer = setTimeout(() => {
            speak_bubble.classList.remove("speak");
        }, 2500);
    };

    /** Fullfill the text depending the 24 max space the speech can handle
     * @param {string} god_words text to render
    */
    function set_god_words(god_words) {
        if (god_words.length > 24) {
            speak_bubble_text.innerHTML = "Fucked";
        };
        if (god_words.length === 24) {
            speak_bubble_text.innerHTML = god_words;
        }
        var centered_god_words = center_words(god_words);
        speak_bubble_text.innerHTML = centered_god_words;
    };

    /**
     * Format and return the text centered with white spaces
     * @param {string} god_words text to format
     * @returns {string} string
     */
    function center_words(god_words) {
        var diff = 24 - god_words.length;
        var a = 0;
        var b = 0;
        if (diff % 2 === 1) {
            a = (diff + 1) / 2;
            b = a - 1;
        } else {
            a = diff / 2;
            b = diff / 2;
        }
        var start = "&nbsp".repeat(a);
        var final = "&nbsp".repeat(b);
        return start + god_words + final;
    }

    /**
     * Handle all comunications from minsweeper module
     * @param {any} comunication to handle
     */
    function HandleComunications(comunication) {
        if (comunication == 'GAME_LOADED') {
            minesweeper_loader.style.display = "none";
            minesweeper.style.display = "grid";
            setTimeout(() => {
                minesweeper.style.opacity = 1;
            }, 300);
        }
        else if (comunication.winner) {
            renderWinnerForm(comunication.winner.score);
        }
        else {
            fucking_host_speaks(comunication);
        }
    }

    /**
     * Create and render the hall of fame
     * @param {any} data the collection of hall of fame
     */
    function renderHallOfFame({ data }) {
        function sorterByScore(a, b) {
            if (Number(a.scoreTime) > Number(b.scoreTime)) {
                return 1;
            }
            if (Number(a.scoreTime) < Number(b.scoreTime)) {
                return -1;
            } else {
                return 0;
            }
        }

        hall_of_fame_container.style.opacity = 0;

        const sortedRecords = data.hall_of_fame.sort(sorterByScore);
        
        sortedRecords.forEach(record => {
            let newRecordTr = document.createElement('tr');
            newRecordTr.setAttribute('id', record.id)
            
            let nicknameTd = document.createElement('td');
            let scoreTimeTd = document.createElement('td');
            let descriptionTd = document.createElement('td');
            nicknameTd.innerHTML = record.nickname;
            scoreTimeTd.innerHTML = record.scoreTime;
            descriptionTd.innerHTML = record.description;
            newRecordTr.appendChild(nicknameTd);
            newRecordTr.appendChild(scoreTimeTd);
            newRecordTr.appendChild(descriptionTd);

            let oldRecordTr = document.getElementById(record.id);
            if (oldRecordTr) {
                hall_of_fame.removeChild(oldRecordTr);
            }
            hall_of_fame.appendChild(newRecordTr);
        });

        hall_of_fame_container.style.opacity = 1;
    }

    /**
     * Create and render the winner form to submit the victory 
     * @param {number} scoreTime the time received from the minesweepermodule on win
     */
    function renderWinnerForm(scoreTime) {
        let winner_form = document.createElement('form');
        winner_form.setAttribute('id', 'winner-form');

        let nicknameInput = document.createElement('input');
        nicknameInput.setAttribute('class', 'winner-form-input');
        nicknameInput.setAttribute('type', 'text');
        nicknameInput.setAttribute('placeholder', 'Nickname');
        nicknameInput.setAttribute('required', true);

        let descriptionInput = document.createElement('input');
        descriptionInput.setAttribute('class', 'winner-form-input');
        descriptionInput.setAttribute('type', 'text');
        descriptionInput.setAttribute('placeholder', 'Description of the victory...');
        descriptionInput.setAttribute('required', true);

        let button = document.createElement('button');
        button.innerHTML = 'Enter';
        button.setAttribute('type', 'submit');

        winner_form_container.style.display = "block";

        winner_form.appendChild(nicknameInput);
        winner_form.appendChild(descriptionInput);
        winner_form.appendChild(button);
        winner_form.addEventListener('submit', function (e) {
            e.preventDefault();
            button.setAttribute('disabled', true);
            hallOfFameModule.addRecordPromise(nicknameInput.value, scoreTime, descriptionInput.value)
                .then(response => response.json())
                .catch(error => console.error('Error:', error))
                .then(() => { getAndRenderHallOfFame() });
        });
        winner_form_container.appendChild(winner_form);
    }

    /**
     * Get all winner from hall of fame DB and execute te renderHallOfFame with it.
     */
    function getAndRenderHallOfFame() {
        let winnerForm = document.getElementById('winner-form');
        if (winnerForm) {
            winner_form_container.removeChild(winnerForm);
            winner_form_container.style.display = 'none';
        }
        hallOfFameModule.getHallOfFamePromise()
            .then(response => response.json())
            .catch(error => console.error('Error:', error))
            .then(renderHallOfFame);
    }

    minesweeperModule.communicator.subscribe({ next: HandleComunications })

    getAndRenderHallOfFame();

})();

