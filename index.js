"use strict";

console.log("hell yeah");

const host = document.getElementById("host_container");
var disturb_counter = 0;

const speak_bubble = document.getElementById("speak_bubble");
const speak_bubble_text = document.getElementById("speak_bubble_text");

const sucker_input = document.getElementById("pass_form");

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

sucker_input.addEventListener('submit', function (e) {
    fucking_host_speaks("Thats holly crap...human")
    e.preventDefault();
})


/** Make the fucking grace speaks
 * @param string your grace words
*/
function fucking_host_speaks(god_words) {
    speak_bubble.classList.add("speak");
    set_god_words(god_words);
    setTimeout(() => {
        speak_bubble.classList.remove("speak");
    }, 2000);
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
